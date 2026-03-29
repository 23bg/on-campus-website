import Stripe from "@stripe/stripe-js";
import { env } from "@/lib/config/env";
import { BillingCustomerData, BillingService, BillingServiceResult, BillingSubscriptionData } from "./types";
import { AppError } from "@/lib/utils/error";

if (!env.STRIPE_SECRET_KEY) {
    throw new AppError("Missing STRIPE_SECRET_KEY", 500, "STRIPE_CONFIG_MISSING");
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});

export class StripeService implements BillingService {
    async createCustomer(data: BillingCustomerData): Promise<{ providerCustomerId: string }> {
        const customer = await stripe.customers.create({
            email: data.email,
            name: data.name,
            metadata: { instituteId: data.instituteId },
        });

        if (!customer.id) {
            throw new AppError("Unable to create Stripe customer", 500, "STRIPE_CUSTOMER_FAILED");
        }

        return { providerCustomerId: customer.id };
    }

    async createSubscription(data: BillingSubscriptionData): Promise<BillingServiceResult> {
        if (!data.providerCustomerId) {
            throw new AppError("providerCustomerId is required", 400, "INVALID_SUBSCRIPTION_REQUEST");
        }

        const priceId = data.providerPlanId;
        const subscription = await stripe.subscriptions.create({
            customer: data.providerCustomerId,
            items: [{ price: priceId }],
            expand: ["latest_invoice.payment_intent"],
            metadata: { instituteId: data.instituteId },
        });

        if (!subscription.id) {
            throw new AppError("Unable to create Stripe subscription", 500, "STRIPE_SUBSCRIPTION_FAILED");
        }

        return {
            providerSubscriptionId: subscription.id,
            providerCustomerId: data.providerCustomerId,
            providerPlanId: priceId,
            status: subscription.status,
        };
    }

    async cancelSubscription(providerSubscriptionId: string): Promise<void> {
        await stripe.subscriptions.del(providerSubscriptionId);
    }

    async getSubscription(providerSubscriptionId: string): Promise<BillingServiceResult> {
        const subscription = await stripe.subscriptions.retrieve(providerSubscriptionId);
        if (!subscription.id) {
            throw new AppError("Stripe subscription not found", 404, "STRIPE_SUBSCRIPTION_NOT_FOUND");
        }

        return {
            providerSubscriptionId: subscription.id,
            providerCustomerId: subscription.customer as string,
            providerPlanId: (subscription.items.data[0]?.price?.id as string) ?? "",
            status: subscription.status,
        };
    }
}
