import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, readSessionFromCookie, setSessionCookie } from "@/lib/auth/auth";
import { canManageBilling } from "@/lib/auth/permissions";
import { BillingInterval, subscriptionService } from "@/features/subscription/subscriptionApi";
import { billingService } from "@/features/billing/billingApi";
import { BillingProvider, BillingServiceFactory } from "@/lib/billing/billing.service";
import { toAppError } from "@/lib/utils/error";
import { isPlanType } from "@/config/plans";
import { env } from "@/lib/config/env";

export async function GET() {
    try {
        const session = await readSessionFromCookie();
        if (!session?.instituteId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
                { status: 401 }
            );
        }

        const data = await billingService.getBillingDashboard(session.instituteId);

        if (
            session.subscriptionStatus &&
            data?.summary?.status &&
            session.subscriptionStatus !== data.summary.status
        ) {
            const nextToken = createSessionToken({
                ...session,
                subscriptionStatus: data.summary.status,
            });
            await setSessionCookie(nextToken);
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await readSessionFromCookie();
        if (!session?.instituteId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
                { status: 401 }
            );
        }

        if (!canManageBilling(session.role)) {
            return NextResponse.json(
                { success: false, error: { code: "FORBIDDEN", message: "Only owner can manage billing" } },
                { status: 403 }
            );
        }

        const body = (await req.json().catch(() => ({}))) as { action?: string; planType?: string; interval?: string };
        const typedBody = body as { action?: string; planType?: string; interval?: string; invoiceId?: string };
        if (body.action === "generate-invoice") {
            const invoice = await billingService.createOrUpdateClosedMonthInvoice(session.instituteId);
            return NextResponse.json({ success: true, data: invoice });
        }

        if (body.action === "retry-invoice") {
            if (!typedBody.invoiceId) {
                return NextResponse.json(
                    { success: false, error: { code: "INVOICE_ID_REQUIRED", message: "invoiceId is required" } },
                    { status: 400 }
                );
            }

            const data = await billingService.attemptAutopayForInvoice(typedBody.invoiceId);
            return NextResponse.json({ success: true, data });
        }

        if (body.action === "run-dunning") {
            const data = await billingService.runDunningCycle();
            return NextResponse.json({ success: true, data });
        }

        if (body.action !== "create-subscription") {
            return NextResponse.json(
                { success: false, error: { code: "INVALID_ACTION", message: "Unsupported action" } },
                { status: 400 }
            );
        }

        if (body.planType && !isPlanType(body.planType)) {
            return NextResponse.json(
                { success: false, error: { code: "INVALID_PLAN", message: "Unsupported plan type" } },
                { status: 400 }
            );
        }

        const interval: BillingInterval =
            body.interval && (body.interval === "YEARLY" || body.interval === "MONTHLY")
                ? body.interval
                : "MONTHLY";

        const provider = (body.provider as BillingProvider | undefined)
            || (session.country === "IN" ? BillingProvider.RAZORPAY : BillingProvider.STRIPE);

        console.log("PLAN:", body.planType, "INTERVAL:", interval, "PROVIDER:", provider);

        const billingServiceImpl = BillingServiceFactory.getBillingService(provider);

        // use existing mapping for plan type to provider plan ID (simplified)
        const providerPlanId = provider === BillingProvider.RAZORPAY
            ? process.env.RAZORPAY_PLAN_ID
            : process.env.STRIPE_PRICE_ID;

        if (!providerPlanId) {
            throw new Error("Provider plan ID is not configured");
        }

        const customer = await billingServiceImpl.createCustomer({
            instituteId: session.instituteId,
            email: session.email ?? "",
            name: session.name ?? "",
            country: session.country ?? "",
        });

        const subscription = await billingServiceImpl.createSubscription({
            instituteId: session.instituteId,
            providerCustomerId: customer.providerCustomerId,
            providerPlanId,
            billingInterval: interval,
        });

        await subscriptionService.updateSubscriptionProvider(session.instituteId, {
            provider,
            providerCustomerId: customer.providerCustomerId,
            providerSubscriptionId: subscription.providerSubscriptionId,
            providerPlanId,
        });

        return NextResponse.json({
            success: true,
            data: {
                subscriptionId: subscription.providerSubscriptionId,
                provider,
                planType: body.planType,
                interval,
                reused: false,
            },
        });
    } catch (error) {
        const appError = toAppError(error);
        return NextResponse.json(
            { success: false, error: { code: appError.code, message: appError.message } },
            { status: appError.statusCode }
        );
    }
}

