import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),

  price: z
    .number()
    .gt(10, "Price must be greater than 10"),
});

export type AddProductForm = z.infer<typeof addProductSchema>;
