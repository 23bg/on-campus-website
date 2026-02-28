import z from "zod";

export const signupFormSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name cannot exceed 80 characters"),
    phoneNumber: z
        .string()
        .trim()
        .refine((value) => /^\d{10,15}$/.test(value.replace(/\D/g, "")), "Phone must be 10 to 15 digits"),
    email: z.string().trim().max(120, "Email cannot exceed 120 characters").email("Enter a valid email"),
});

export type SignupFormData = z.infer<typeof signupFormSchema>;
