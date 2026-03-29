import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/utils/error";
import { GET, POST } from "@/app/api/v1/billing/route";

const { mockReadSessionFromCookie, mockSubscriptionService, mockBillingServiceImpl, mockBillingServiceFactory, mockBillingService } = vi.hoisted(() => {
    const billingServiceImpl = {
        createCustomer: vi.fn(),
        createSubscription: vi.fn(),
    };

    const billingServiceFactory = {
        getBillingService: vi.fn(() => billingServiceImpl),
    };

    const billingService = {
        getBillingDashboard: vi.fn(),
        createOrUpdateClosedMonthInvoice: vi.fn(),
        attemptAutopayForInvoice: vi.fn(),
        runDunningCycle: vi.fn(),
    };

    return {
        mockReadSessionFromCookie: vi.fn(),
        mockSubscriptionService: {
            getBillingSummary: vi.fn(),
            updateSubscriptionProvider: vi.fn(),
        },
        mockBillingServiceImpl: billingServiceImpl,
        mockBillingServiceFactory: billingServiceFactory,
        mockBillingService: billingService,
    };
});

vi.mock("@/lib/auth/auth", () => ({
    readSessionFromCookie: mockReadSessionFromCookie,
}));

vi.mock("@/lib/billing/billing.service", () => ({
    BillingProvider: {
        RAZORPAY: "RAZORPAY",
        STRIPE: "STRIPE",
    },
    BillingServiceFactory: mockBillingServiceFactory,
}));

vi.mock("@/features/billing/billingApi", () => ({
    billingService: mockBillingService,
}));

vi.mock("@/features/subscription/subscriptionDataApi", () => ({
    subscriptionRepository: {
        updateByInstituteId: vi.fn(),
    },
}));

vi.mock("@/features/subscription/subscriptionApi", () => ({
    subscriptionService: mockSubscriptionService,
}));

describe("/api/v1/billing", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.RAZORPAY_PLAN_ID = "plan_razorpay_monthly";
        process.env.STRIPE_PRICE_ID = "price_stripe_monthly";
    });

    it("GET returns unauthorized without session", async () => {
        mockReadSessionFromCookie.mockResolvedValue(null);

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body.success).toBe(false);
    });

    it("GET returns billing summary", async () => {
        mockReadSessionFromCookie.mockResolvedValue({ instituteId: "inst1" });
        mockBillingService.getBillingDashboard.mockResolvedValue({
            summary: {
                planType: "FREE",
                status: "TRIAL",
                usersUsed: 1,
                userLimit: 1,
                trialEndsAt: new Date().toISOString(),
            },
            usage: {},
            policy: {},
            sender: {},
            invoices: [],
        });

        const response = await GET();
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(mockBillingService.getBillingDashboard).toHaveBeenCalledWith("inst1");
    });

    it("POST rejects invalid action", async () => {
        mockReadSessionFromCookie.mockResolvedValue({ instituteId: "inst1", role: "OWNER" });

        const request = new Request("http://localhost/api/v1/billing", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "bad-action" }),
        });

        const response = await POST(request as never);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.success).toBe(false);
        expect(body.error.code).toBe("INVALID_ACTION");
    });

    it("POST rejects invalid plan", async () => {
        mockReadSessionFromCookie.mockResolvedValue({ instituteId: "inst1", role: "OWNER" });

        const request = new Request("http://localhost/api/v1/billing", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "create-subscription", planType: "UNKNOWN" }),
        });

        const response = await POST(request as never);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.success).toBe(false);
        expect(body.error.code).toBe("INVALID_PLAN");
    });

    it("POST creates subscription for valid action", async () => {
        mockReadSessionFromCookie.mockResolvedValue({ instituteId: "inst1", role: "OWNER", country: "IN" });
        mockBillingServiceImpl.createCustomer.mockResolvedValue({ providerCustomerId: "cust_123" });
        mockBillingServiceImpl.createSubscription.mockResolvedValue({
            providerSubscriptionId: "sub_123",
            providerCustomerId: "cust_123",
            providerPlanId: "plan_razorpay_monthly",
            status: "ACTIVE",
        });

        const request = new Request("http://localhost/api/v1/billing", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "create-subscription", planType: "BASIC", interval: "MONTHLY", provider: "RAZORPAY" }),
        });

        const response = await POST(request as never);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(mockBillingServiceFactory.getBillingService).toHaveBeenCalledWith("RAZORPAY");
        expect(mockBillingServiceImpl.createCustomer).toHaveBeenCalledWith({
            instituteId: "inst1",
            email: "",
            name: "",
            country: "IN",
        });
        expect(mockBillingServiceImpl.createSubscription).toHaveBeenCalledWith({
            instituteId: "inst1",
            providerCustomerId: "cust_123",
            providerPlanId: process.env.RAZORPAY_PLAN_ID ?? undefined,
            billingInterval: "MONTHLY",
        });
        expect(mockSubscriptionService.updateSubscriptionProvider).toHaveBeenCalledWith("inst1", {
            provider: "RAZORPAY",
            providerCustomerId: "cust_123",
            providerSubscriptionId: "sub_123",
            providerPlanId: "plan_razorpay_monthly",
        });
    });

    it("POST returns service failure status", async () => {
        mockReadSessionFromCookie.mockResolvedValue({ instituteId: "inst1", role: "OWNER", country: "IN" });
        mockBillingServiceImpl.createCustomer.mockResolvedValue({ providerCustomerId: "cust_123" });
        mockBillingServiceImpl.createSubscription.mockRejectedValue(
            new AppError("Provider down", 503, "PROVIDER_DOWN")
        );

        const request = new Request("http://localhost/api/v1/billing", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "create-subscription", planType: "BASIC" }),
        });

        const response = await POST(request as never);
        const body = await response.json();

        expect(response.status).toBe(503);
        expect(body.success).toBe(false);
        expect(body.error.code).toBe("PROVIDER_DOWN");
    });
});

