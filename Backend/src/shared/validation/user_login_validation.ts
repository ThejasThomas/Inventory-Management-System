import z from "zod";
import { passwordSchema, strongEmailRegex } from "./user_signup_validation";

export const loginSchema =z.object({
    email:strongEmailRegex,
    password:passwordSchema,
})