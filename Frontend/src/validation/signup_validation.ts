import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .regex(/^[a-zA-Z ]+$/, "Full name can contain only letters"),

  email: z.string()
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email address"),

  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10 digit Indian number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
});

export type SignupForm = z.infer<typeof signupSchema>;
