import { NextResponse } from "next/server";

export const runtime = "nodejs";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { REQUEST_ID_HEADER } from "@/lib/request-logger";
import { serializeError, withLogContext } from "@/lib/logger";

function endOfDayPlusDays(start: Date, days: number) {
    const d = new Date(start);
    d.setDate(d.getDate() + days);
    d.setHours(23, 59, 59, 0);
    return d;
}

export async function POST(req: Request) {
    const requestId = req.headers.get(REQUEST_ID_HEADER) ?? crypto.randomUUID();
    const logger = withLogContext({ requestId, route: "/api/auth/signup" });

    try {
        const body = await req.json();
        const { name, email, password } = body ?? {};

        if (!email || !password || !name) {
            logger.warn({ event: "signup_validation_failed", reason: "missing_required_fields" });
            return NextResponse.json({ success: false, message: "name, email and password are required" }, { status: 400 });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // Basic password policy
        if (String(password).length < 8) {
            logger.warn({ event: "signup_validation_failed", reason: "password_too_short" });
            return NextResponse.json({ success: false, message: "Password must be at least 8 characters" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
            logger.info({ event: "signup_rejected", reason: "email_already_registered" });
            return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });
        }

        const hash = await bcrypt.hash(password, 12);

        const now = new Date();
        const trialStartAt = now;
        const trialEndsAt = endOfDayPlusDays(now, 14);

        await prisma.user.create({
            data: {
                email: normalizedEmail,
                passwordHash: hash,
                name,
                instituteId: null,
                trialStartAt,
                trialEndsAt,
                trialStatus: "ACTIVE",
                onboardingCompleted: false,
            },
        });

        logger.info({
            event: "signup_succeeded",
            email: normalizedEmail,
            onboardingCompleted: false,
        });

        return NextResponse.json({ success: true, redirect: "/onboarding" }, { status: 201 });
    } catch (err: any) {
        logger.error({
            event: "signup_failed",
            error: serializeError(err),
        });
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
