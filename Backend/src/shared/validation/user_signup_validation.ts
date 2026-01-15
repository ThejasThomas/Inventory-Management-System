import z from "zod";
export const nameSchema = z
	.string()
	.min(3, { message: "Name must be at least 2 characters long" })
	.regex(/^[a-zA-Z\s]+$/, {
		message: "Name must contain only alphabetic characters and spaces",
	});

    export const passwordSchema = z
	.string()
	.min(8, { message: "Password must be at least 8 characters long" })
	.regex(/[A-Z]/, {
		message: "Password must contain at least one uppercase letter",
	})
	.regex(/[0-9]/, { message: "Password must contain at least one digit" })
	.regex(/[@$!%*?&#]/, {
		message: "Password must contain at least one special character",
	});

    export const phoneNumberSchema = z
	.string()
	.length(10, { message: "Phone number must be exactly 10 digits" })
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10 digit Indian number")
    export const strongEmailRegex =z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
		message: "Invalid email format",
	});
    

export const UserSchemaValidation=z.object({
	// userId:z.string(),
    fullName:nameSchema,
    email:strongEmailRegex,
    phoneNumber:phoneNumberSchema,
    password:passwordSchema,
})