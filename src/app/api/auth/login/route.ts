import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db/prisma";
import { requireEnv } from "@/lib/config/env";
import { REQUEST_ID_HEADER } from "@/lib/request-logger";
import { serializeError, withLogContext } from "@/lib/logger";

export const runtime = "nodejs";

const JWT_SECRET = requireEnv("JWT_SECRET");
const COOKIE_NAME = "oncampus_session";
const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
    const requestId = req.headers.get(REQUEST_ID_HEADER) ?? crypto.randomUUID();
    const logger = withLogContext({ requestId, route: "/api/auth/login" });

    try {
        const body = await req.json();
        const { email, password } = body ?? {};
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!email || !password) {
            logger.warn({ event: "login_validation_failed", reason: "missing_required_fields" });
            return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

        if (!user) {
            logger.info({ event: "login_rejected", reason: "account_not_found", email: normalizedEmail });
            return NextResponse.json({ success: false, message: "Account not found. Please sign up." }, { status: 404 });
        }

        if (!user.passwordHash) {
            logger.warn({ event: "login_rejected", reason: "password_not_set", userId: user.id });
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) {
            logger.warn({ event: "login_rejected", reason: "invalid_password", userId: user.id });
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        // Gather institute + subscription/trial info
        let onboardingCompleted = false;
        let trialEndsAt = null;
        let trialStatus = null;

        if (user.instituteId) {
            const institute = await prisma.institute.findUnique({ where: { id: user.instituteId } });
            onboardingCompleted = Boolean(institute?.isOnboarded);

            const subscription = await prisma.subscription.findUnique({ where: { instituteId: user.instituteId } });
            trialEndsAt = subscription?.trialEndsAt ?? null;
            trialStatus = subscription?.status ?? null;
        }

        // Create JWT
        const token = jwt.sign(
            {
                sub: user.id,
                role: user.role,
                instituteId: user.instituteId ?? null,
            },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY_SECONDS }
        );

        const secure = process.env.NODE_ENV === "production";

        const res = NextResponse.json({
            success: true,
            userId: user.id,
            onboardingCompleted,
            instituteId: user.instituteId ?? null,
            trialEndsAt,
            trialStatus,
        });

        res.headers.append("Set-Cookie", `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${TOKEN_EXPIRY_SECONDS}; SameSite=Lax${secure ? "; Secure" : ""}`);

        logger.info({
            event: "login_succeeded",
            userId: user.id,
            instituteId: user.instituteId ?? null,
            onboardingCompleted,
        });

        return res;
    } catch (err: any) {
        logger.error({
            event: "login_failed",
            error: serializeError(err),
        });
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
