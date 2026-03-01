import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/utils/error";
import { POST } from "@/app/api/v1/student-auth/login/route";

const { mockStudentPortalService, mockStudentAuth } = vi.hoisted(() => ({
    mockStudentPortalService: {
        login: vi.fn(),
    },
    mockStudentAuth: {
        createStudentSessionToken: vi.fn(),
        setStudentSessionCookie: vi.fn(),
    },
}));

vi.mock("@/features/student/services/student-portal.service", () => ({
    studentPortalService: mockStudentPortalService,
}));

vi.mock("@/lib/auth/student-auth", () => ({
    createStudentSessionToken: mockStudentAuth.createStudentSessionToken,
    setStudentSessionCookie: mockStudentAuth.setStudentSessionCookie,
}));

describe("POST /api/v1/student-auth/login", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns success and sets session cookie", async () => {
        mockStudentPortalService.login.mockResolvedValue({ studentId: "s1", instituteId: "inst1", name: "A" });
        mockStudentAuth.createStudentSessionToken.mockReturnValue("token");
        mockStudentAuth.setStudentSessionCookie.mockResolvedValue(undefined);

        const request = new Request("http://localhost/api/v1/student-auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ identifier: "student1", password: "secret123" }),
        });

        const response = await POST(request as never);
        const body = await response.json();
        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(mockStudentPortalService.login).toHaveBeenCalledWith("student1", "secret123");
        expect(mockStudentAuth.setStudentSessionCookie).toHaveBeenCalledWith("token");
    });

    it("returns service error status", async () => {
        mockStudentPortalService.login.mockRejectedValue(new AppError("Invalid", 401, "INVALID_CREDENTIALS"));

        const request = new Request("http://localhost/api/v1/student-auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ identifier: "student1", password: "bad" }),
        });

        const response = await POST(request as never);
        const body = await response.json();
        expect(response.status).toBe(401);
        expect(body.error.code).toBe("INVALID_CREDENTIALS");
    });
});
