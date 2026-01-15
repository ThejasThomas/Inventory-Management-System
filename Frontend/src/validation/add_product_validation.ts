import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  quantity: z.number().min(0, "Quantity must be 0 or more"),
  price: z.number().positive("Price must be greater than 0"),
});

export type AddProductForm = z.infer<typeof addProductSchema>;
