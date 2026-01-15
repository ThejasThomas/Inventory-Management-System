import z from "zod";
import {  strongEmailRegex } from "./user_signup_validation";
 const passwordSchema = 
    z.string().min(1, "Password is required")

export const loginSchema =z.object({
    email:strongEmailRegex,
    password:passwordSchema,
})

