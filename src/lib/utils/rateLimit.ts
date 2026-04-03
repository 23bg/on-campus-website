import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitResult = {
    ok: boolean;
    retryAfter: number;
};

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = upstashUrl && upstashToken
    ? new Redis({ url: upstashUrl, token: upstashToken })
    : null;

const limiterCache = new Map<string, Ratelimit>();

const getLimiter = (limit: number, windowMs: number): Ratelimit => {
    const key = `${limit}:${windowMs}`;
    const existing = limiterCache.get(key);
    if (existing) {
        return existing;
    }

    if (!redis) {
        throw new Error("Missing Upstash Redis configuration for rate limiting.");
    }

    const seconds = Math.max(1, Math.ceil(windowMs / 1000));
    const limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${seconds} s`),
        analytics: true,
        prefix: "rl",
    });

    limiterCache.set(key, limiter);
    return limiter;
};

export async function enforceRateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    if (process.env.NODE_ENV === "test") {
        return { ok: true, retryAfter: 0 };
    }

    const limiter = getLimiter(limit, windowMs);
    const result = await limiter.limit(key);

    return {
        ok: result.success,
        retryAfter: result.success ? 0 : Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)),
    };
}

