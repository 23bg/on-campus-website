import { AppError } from "@/lib/utils/error";
import { subscriptionRepository } from "@/features/subscription/repositories/subscription.repo";
import { assertRazorpayReady, razorpay, verifyRazorpayCheckoutSignature } from "@/lib/billing/razorpay";
import { env } from "@/lib/config/env";
import { DEFAULT_PLAN_TYPE, isPlanType, PLAN_CONFIG, PlanType } from "@/config/plans";
import { userRepository } from "@/features/auth/repositories/user.repo";

export type SubscriptionState = "TRIAL" | "ACTIVE" | "INACTIVE" | "CANCELLED";
type SubscriptionRecord = NonNullable<Awaited<ReturnType<typeof subscriptionRepository.findByInstituteId>>>;

const DASHBOARD_ALLOWED: SubscriptionState[] = ["TRIAL", "ACTIVE"];

export type BillingInterval = "MONTHLY" | "YEARLY";

const normalizeStoredPlanType = (storedPlanType: string | null | undefined, userLimit?: number | null): PlanType => {
    if (storedPlanType === "STARTER" || storedPlanType === "GROWTH" || storedPlanType === "SCALE") {
        return storedPlanType;
    }

    if (storedPlanType === "SOLO") {
        return "STARTER";
    }

    if (storedPlanType === "TEAM") {
        if ((userLimit ?? 0) >= PLAN_CONFIG.SCALE.userLimit) {
            return "SCALE";
        }
        return "GROWTH";
    }

    return DEFAULT_PLAN_TYPE;
};

export const subscriptionService = {
    canAccessDashboard(status: SubscriptionState): boolean {
        return DASHBOARD_ALLOWED.includes(status);
    },

    resolvePlanType(input?: string | null): PlanType {
        if (input && isPlanType(input)) {
            return input;
        }
        return DEFAULT_PLAN_TYPE;
    },

    getRazorpayPlanId(planType: PlanType, interval: BillingInterval = "MONTHLY"): string {
        const lookup: Record<PlanType, Record<BillingInterval, string | undefined>> = {
            STARTER: {
                MONTHLY: env.RAZORPAY_PLAN_ID_STARTER_MONTHLY,
                YEARLY: env.RAZORPAY_PLAN_ID_STARTER_YEARLY,
            },
            GROWTH: {
                MONTHLY: env.RAZORPAY_PLAN_ID_GROWTH_MONTHLY,
                YEARLY: env.RAZORPAY_PLAN_ID_GROWTH_YEARLY,
            },
            SCALE: {
                MONTHLY: env.RAZORPAY_PLAN_ID_SCALE_MONTHLY,
                YEARLY: env.RAZORPAY_PLAN_ID_SCALE_YEARLY,
            },
        };

        const planId = lookup[planType]?.[interval];
        if (!planId) {
            throw new AppError(`Missing Razorpay plan id for ${planType}/${interval}`, 500, "RAZORPAY_PLAN_ID_MISSING");
        }

        return planId;
    },

    async createSubscription(instituteId: string, planType: PlanType = DEFAULT_PLAN_TYPE) {
        return subscriptionRepository.createTrial(instituteId, planType);
    },

    async syncTrialStatus(subscription: SubscriptionRecord): Promise<SubscriptionRecord> {
        if (
            subscription.status === "TRIAL" &&
            subscription.trialEndsAt &&
            subscription.trialEndsAt.getTime() < Date.now()
        ) {
            return subscriptionRepository.updateByInstituteId(subscription.instituteId, {
                status: "INACTIVE",
            });
        }

        return subscription;
    },

    async getSubscription(instituteId: string) {
        const existing = await subscriptionRepository.findByInstituteId(instituteId);
        if (!existing) {
            const created = await subscriptionRepository.createTrial(instituteId);
            return this.syncTrialStatus(created);
        }

        return this.syncTrialStatus(existing);
    },

    async getBillingSummary(instituteId: string) {
        const subscription = await this.getSubscription(instituteId);
        const planType = normalizeStoredPlanType(subscription.planType, subscription.userLimit);
        const plan = PLAN_CONFIG[planType];
        const usersUsed = await userRepository.countByInstitute(instituteId);
        const userLimit = subscription.userLimit ?? plan.userLimit;
        const hasAnySubscriptionActivity = Boolean(subscription.razorpaySubId || subscription.currentPeriodEnd || subscription.status === "ACTIVE");

        return {
            planType,
            planName: plan.name,
            planAmount: plan.priceMonthly,
            currency: "INR",
            userLimit,
            usersUsed,
            status: subscription.status,
            nextBillingDate: subscription.currentPeriodEnd ?? subscription.trialEndsAt,
            razorpaySubId: subscription.razorpaySubId,
            lastPaymentAmount: hasAnySubscriptionActivity ? plan.priceMonthly : null,
            lastPaymentDate: hasAnySubscriptionActivity ? subscription.updatedAt : null,
        };
    },

    async createRazorpaySubscription(
        instituteId: string,
        requestedPlanType?: string,
        interval: BillingInterval = "MONTHLY"
    ) {
        assertRazorpayReady();
        const planType = this.resolvePlanType(requestedPlanType);
        const plan = PLAN_CONFIG[planType];
        const planId = this.getRazorpayPlanId(planType, interval);

        const existing = await subscriptionRepository.findByInstituteId(instituteId);
        const existingPlanType = existing
            ? normalizeStoredPlanType(existing.planType, existing.userLimit)
            : null;

        if (existing?.razorpaySubId && existingPlanType === planType) {
            return {
                subscriptionId: existing.razorpaySubId,
                planType,
                interval,
                reused: true,
            };
        }

        const created = await razorpay!.subscriptions.create({
            plan_id: planId,
            quantity: 1,
            total_count: 12,
            customer_notify: 1,
            notes: {
                instituteId,
                planType,
            },
        });

        await subscriptionRepository.upsertByRazorpaySubId(created.id, instituteId, {
            status: "INACTIVE",
            planType,
            userLimit: plan.userLimit,
        });

        return {
            subscriptionId: created.id,
            planType,
            interval,
            status: "INACTIVE" as const,
            reused: false,
        };
    },

    async confirmRazorpaySubscription(input: {
        instituteId: string;
        paymentId: string;
        subscriptionId: string;
        signature: string;
    }) {
        const isValid = verifyRazorpayCheckoutSignature({
            paymentId: input.paymentId,
            subscriptionId: input.subscriptionId,
            signature: input.signature,
        });

        if (!isValid) {
            throw new AppError("Invalid Razorpay checkout signature", 401, "INVALID_CHECKOUT_SIGNATURE");
        }

        const existing = await subscriptionRepository.findByInstituteId(input.instituteId);
        if (!existing || existing.razorpaySubId !== input.subscriptionId) {
            throw new AppError("Subscription mismatch for institute", 400, "SUBSCRIPTION_MISMATCH");
        }

        const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        const updated = await subscriptionRepository.updateByInstituteId(input.instituteId, {
            status: "TRIAL",
            trialEndsAt,
        });

        return {
            instituteId: updated.instituteId,
            razorpaySubId: updated.razorpaySubId,
            status: updated.status,
            trialEndsAt: updated.trialEndsAt,
        };
    },

    async isActive(instituteId: string): Promise<boolean> {
        const subscription = await this.getSubscription(instituteId);
        return DASHBOARD_ALLOWED.includes(subscription.status as SubscriptionState);
    },

    mapWebhookEventToStatus(event: string): SubscriptionState | null {
        switch (event) {
            case "subscription.activated":
                return "ACTIVE";
            case "subscription.charged":
                return "ACTIVE";
            case "subscription.cancelled":
                return "CANCELLED";
            case "payment.failed":
                return "INACTIVE";
            default:
                return null;
        }
    },

    assertKnownEvent(event: string): void {
        const supported = ["subscription.activated", "subscription.charged", "subscription.cancelled", "payment.failed"];
        if (!supported.includes(event)) {
            throw new AppError(`Unsupported Razorpay event: ${event}`, 400, "UNSUPPORTED_WEBHOOK_EVENT");
        }
    },

    async handleWebhookEvent(input: {
        event: string;
        instituteId?: string;
        razorpaySubId?: string;
        currentPeriodEnd?: Date | null;
    }) {
        this.assertKnownEvent(input.event);
        const status = this.mapWebhookEventToStatus(input.event);

        if (!status) {
            throw new AppError("Unable to map webhook event status", 400, "INVALID_SUBSCRIPTION_EVENT");
        }

        if (input.razorpaySubId && input.instituteId) {
            return subscriptionRepository.upsertByRazorpaySubId(input.razorpaySubId, input.instituteId, {
                status,
                currentPeriodEnd: input.currentPeriodEnd,
            });
        }

        if (input.razorpaySubId) {
            return subscriptionRepository.updateByRazorpaySubId(input.razorpaySubId, {
                status,
                currentPeriodEnd: input.currentPeriodEnd,
            });
        }

        if (!input.instituteId) {
            throw new AppError("instituteId or razorpaySubId is required", 400, "SUBSCRIPTION_TARGET_MISSING");
        }

        return subscriptionRepository.updateByInstituteId(input.instituteId, {
            status,
            currentPeriodEnd: input.currentPeriodEnd,
        });
    },
};
