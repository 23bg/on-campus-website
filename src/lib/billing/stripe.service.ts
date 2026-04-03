import { BillingCustomerData, BillingService, BillingServiceResult, BillingSubscriptionData } from "./types";
import { AppError } from "@/lib/utils/error";

// Stripe private API is not currently available for this build environment.
// The provider is present for compile purposes only; use Razorpay by default.
function stripeNotAvailable(): never {
    throw new AppError("Stripe integration is unavailable", 501, "STRIPE_UNAVAILABLE");
}

export class StripeService implements BillingService {
    async createCustomer(_data: BillingCustomerData): Promise<{ providerCustomerId: string }> {
        stripeNotAvailable();
    }

    async createSubscription(_data: BillingSubscriptionData): Promise<BillingServiceResult> {
        stripeNotAvailable();
    }

    async cancelSubscription(_providerSubscriptionId: string): Promise<void> {
        stripeNotAvailable();
    }

    async getSubscription(_providerSubscriptionId: string): Promise<BillingServiceResult> {
        stripeNotAvailable();
    }
}
