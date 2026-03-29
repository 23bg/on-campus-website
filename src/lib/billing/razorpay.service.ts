import { BillingCustomerData, BillingService, BillingServiceResult, BillingSubscriptionData } from "./types";
import { assertRazorpayReady, razorpay, verifyRazorpayCheckoutSignature } from "./razorpay";
import { AppError } from "@/lib/utils/error";

export class RazorpayService implements BillingService {
    async createCustomer(data: BillingCustomerData): Promise<{ providerCustomerId: string }> {
        assertRazorpayReady();
        const customer = await razorpay?.customers.create({
            name: data.name,
            email: data.email,
            contact: data.country || undefined,
            notes: { instituteId: data.instituteId },
        });
        if (!customer?.id) {
            throw new AppError("Unable to create Razorpay customer", 500, "RAZORPAY_CUSTOMER_FAILED");
        }
        return { providerCustomerId: customer.id };
    }

    async createSubscription(data: BillingSubscriptionData): Promise<BillingServiceResult> {
        assertRazorpayReady();
        if (!data.providerCustomerId) {
            throw new AppError("providerCustomerId is required", 400, "INVALID_SUBSCRIPTION_REQUEST");
        }

        const subscription = await razorpay?.subscriptions.create({
            plan_id: data.providerPlanId,
            customer_notify: 1,
            total_count: data.billingInterval === "MONTHLY" ? 12 : 1,
            // customer_id: data.providerCustomerId,
            notes: { instituteId: data.instituteId },
        });

        if (!subscription?.id) {
            throw new AppError("Unable to create Razorpay subscription", 500, "RAZORPAY_SUBSCRIPTION_FAILED");
        }

        return {
            providerSubscriptionId: subscription.id,
            providerCustomerId: data.providerCustomerId,
            providerPlanId: data.providerPlanId,
            status: subscription.status,
        };
    }

    async cancelSubscription(providerSubscriptionId: string): Promise<void> {
        assertRazorpayReady();
        await razorpay?.subscriptions.cancel(providerSubscriptionId);
    }

    async getSubscription(providerSubscriptionId: string): Promise<BillingServiceResult> {
        assertRazorpayReady();
        const subscription = await razorpay?.subscriptions.fetch(providerSubscriptionId);
        if (!subscription?.id) {
            throw new AppError("Razorpay subscription not found", 404, "RAZORPAY_SUBSCRIPTION_NOT_FOUND");
        }
        return {
            providerSubscriptionId: subscription.id,
            providerCustomerId: subscription.customer_id ?? '',
            providerPlanId: subscription.plan_id,
            status: subscription.status,
        };
    }

    async verifyCheckoutSignature(args: {
        paymentId: string;
        subscriptionId: string;
        signature: string;
    }): Promise<boolean> {
        return verifyRazorpayCheckoutSignature(args);
    }
}
