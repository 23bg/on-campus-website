import { BillingProvider, BillingService } from "./types";
import { RazorpayService } from "./razorpay.service";
import { StripeService } from "./stripe.service";

export class BillingServiceFactory {
    static getBillingService(provider: BillingProvider): BillingService {
        switch (provider) {
            case BillingProvider.RAZORPAY:
                return new RazorpayService();
            case BillingProvider.STRIPE:
                return new StripeService();
            default:
                throw new Error(`Unsupported billing provider: ${provider}`);
        }
    }
}

export const DEFAULT_BILLING_PROVIDER = BillingProvider.RAZORPAY;
