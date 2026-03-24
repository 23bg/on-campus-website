import { z } from "zod";

export const verifyOtpRequestSchema = z.object({
    email: z.string().email(),
    otp: z.string().regex(/^\d{5}$/),
});
