import { AppError } from "@/lib/utils/error";
import { subscriptionRepository } from "@/features/subscription/repositories/subscription.repo";
import { assertRazorpayReady, razorpay } from "@/lib/billing/razorpay";
import { env } from "@/lib/config/env";

export type SubscriptionState = "TRIAL" | "ACTIVE" | "INACTIVE" | "CANCELLED";

const DASHBOARD_ALLOWED: SubscriptionState[] = ["TRIAL", "ACTIVE"];

export const subscriptionService = {
    canAccessDashboard(status: SubscriptionState): boolean {
        return DASHBOARD_ALLOWED.includes(status);
    },

    async createSubscription(instituteId: string) {
        return subscriptionRepository.createTrial(instituteId);
    },

    async getSubscription(instituteId: string) {
        const subscription = await subscriptionRepository.findByInstituteId(instituteId);
        if (!subscription) {
            return subscriptionRepository.createTrial(instituteId);
        }
        return subscription;
    },

    async getBillingSummary(instituteId: string) {
        const subscription = await this.getSubscription(instituteId);
        return {
            planAmount: 999,
            currency: "INR",
            status: subscription.status,
            nextBillingDate: subscription.currentPeriodEnd,
            razorpaySubId: subscription.razorpaySubId,
        };
    },

    async createRazorpaySubscription(instituteId: string) {
        assertRazorpayReady();
        if (!env.RAZORPAY_PLAN_ID) {
            throw new AppError("Missing RAZORPAY_PLAN_ID", 500, "RAZORPAY_PLAN_ID_MISSING");
        }

        const subscription = await this.getSubscription(instituteId);
        if (subscription.razorpaySubId) {
            return {
                razorpaySubId: subscription.razorpaySubId,
                reused: true,
            };
        }

        const created = await razorpay!.subscriptions.create({
            plan_id: env.RAZORPAY_PLAN_ID,
            quantity: 1,
            total_count: 12,
            customer_notify: 1,
            notes: {
                instituteId,
            },
        });

        await subscriptionRepository.updateByInstituteId(instituteId, {
            razorpaySubId: created.id,
            status: "TRIAL",
        });

        return {
            razorpaySubId: created.id,
            status: "TRIAL" as const,
            reused: false,
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
