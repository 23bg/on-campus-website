export enum BillingProvider {
    RAZORPAY = "RAZORPAY",
    STRIPE = "STRIPE",
}

export type BillingCustomerData = {
    instituteId: string;
    email: string;
    name?: string;
    country?: string;
};

export type BillingSubscriptionData = {
    instituteId: string;
    providerPlanId: string;
    billingInterval: "MONTHLY" | "YEARLY";
    providerCustomerId: string;
    price?: number;
};

export type BillingServiceResult = {
    providerSubscriptionId: string;
    providerCustomerId: string;
    providerPlanId: string;
    status: string;
};

export interface BillingService {
    createCustomer(data: BillingCustomerData): Promise<{ providerCustomerId: string }>;
    createSubscription(data: BillingSubscriptionData): Promise<BillingServiceResult>;
    cancelSubscription(providerSubscriptionId: string): Promise<void>;
    getSubscription(providerSubscriptionId: string): Promise<BillingServiceResult>;
}
