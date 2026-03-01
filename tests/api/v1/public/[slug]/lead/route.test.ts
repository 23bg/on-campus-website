import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/utils/error";
import { POST } from "@/app/api/v1/public/[slug]/lead/route";

const { mockInstituteRepo, mockLeadService, mockRateLimit } = vi.hoisted(() => ({
    mockInstituteRepo: {
        findBySlug: vi.fn(),
    },
    mockLeadService: {
        createLead: vi.fn(),
    },
    mockRateLimit: vi.fn(),
}));

vi.mock("@/features/institute/repositories/institute.repo", () => ({
    instituteRepository: mockInstituteRepo,
}));

vi.mock("@/features/lead/services/lead.service", () => ({
    leadService: mockLeadService,
}));

vi.mock("@/lib/utils/rateLimit", () => ({
    enforceRateLimit: mockRateLimit,
}));

describe("POST /api/v1/public/[slug]/lead", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRateLimit.mockReturnValue({ ok: true, retryAfter: 0 });
    });

    it("returns 404 when institute slug is missing", async () => {
        mockInstituteRepo.findBySlug.mockResolvedValue(null);

        const request = new Request("http://localhost/api/v1/public/acme/lead", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name: "Rahul", phone: "9876543210" }),
        });

        const response = await POST(request as never, { params: Promise.resolve({ slug: "acme" }) });
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.error.code).toBe("INSTITUTE_NOT_FOUND");
    });

    it("creates lead for JSON submission", async () => {
        mockInstituteRepo.findBySlug.mockResolvedValue({ id: "inst1" });
        mockLeadService.createLead.mockResolvedValue({ id: "l1" });

        const request = new Request("http://localhost/api/v1/public/acme/lead", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-forwarded-for": "1.2.3.4",
            },
            body: JSON.stringify({ name: "Rahul", phone: "9876543210", course: "JEE" }),
        });

        const response = await POST(request as never, { params: Promise.resolve({ slug: "acme" }) });
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(mockLeadService.createLead).toHaveBeenCalledWith(
            expect.objectContaining({ instituteId: "inst1", name: "Rahul", phone: "9876543210", course: "JEE" })
        );
    });

    it("returns duplicate lead error with details", async () => {
        mockInstituteRepo.findBySlug.mockResolvedValue({ id: "inst1" });
        mockLeadService.createLead.mockRejectedValue(
            new AppError("Lead exists", 409, "DUPLICATE_LEAD", { existingLeadId: "l1" })
        );

        const request = new Request("http://localhost/api/v1/public/acme/lead", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name: "Rahul", phone: "9876543210" }),
        });

        const response = await POST(request as never, { params: Promise.resolve({ slug: "acme" }) });
        const body = await response.json();

        expect(response.status).toBe(409);
        expect(body.error.code).toBe("DUPLICATE_LEAD");
        expect(body.error.details).toEqual({ existingLeadId: "l1" });
    });
});
