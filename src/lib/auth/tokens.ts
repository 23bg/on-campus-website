import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { env, requireEnv } from "@/lib/config/env";

export type AccessTokenPayload = {
    userId: string;
    email: string;
    role: "OWNER" | "EDITOR" | "VIEWER" | "MANAGER";
    instituteId: string;
    isOnboarded: boolean;
    subscriptionStatus: "TRIAL" | "ACTIVE" | "INACTIVE" | "CANCELLED";
};

export type RefreshTokenPayload = {
    userId: string;
    tokenVersion: number;
};

const getJwtSecret = (): string => requireEnv("JWT_SECRET");

const stripJwtMetaClaims = <T extends Record<string, unknown>>(payload: T): T => {
    const { exp: _exp, iat: _iat, nbf: _nbf, jti: _jti, ...rest } = payload as T & {
        exp?: number;
        iat?: number;
        nbf?: number;
        jti?: string;
    };
    return rest as T;
};

// === ACCESS TOKEN (15 min) ===
export const createAccessToken = (payload: AccessTokenPayload): string =>
    jwt.sign(stripJwtMetaClaims(payload), getJwtSecret(), { expiresIn: "15m" });

export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
    try {
        return jwt.verify(token, getJwtSecret()) as AccessTokenPayload;
    } catch {
        return null;
    }
};

// === REFRESH TOKEN (7 days) ===
export const createRefreshToken = (payload: RefreshTokenPayload): string =>
    jwt.sign(stripJwtMetaClaims(payload), getJwtSecret(), { expiresIn: "7d" });

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
    try {
        return jwt.verify(token, getJwtSecret()) as RefreshTokenPayload;
    } catch {
        return null;
    }
};

// === COOKIE SETTERS ===
export const setAccessTokenCookie = async (token: string): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60, // 15 minutes
    });
};

export const setRefreshTokenCookie = async (token: string): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.set("refresh_token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });
};

export const clearAuthCookies = async (): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
};

// === READ FROM COOKIES ===
export const readAccessTokenFromCookie = async (): Promise<AccessTokenPayload | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return null;
    return verifyAccessToken(token);
};

export const readRefreshTokenFromCookie = async (): Promise<RefreshTokenPayload | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("refresh_token")?.value;
    if (!token) return null;
    return verifyRefreshToken(token);
};
