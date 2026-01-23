import { z } from "zod";

export const addCustomerSchema = z.object({
  customerName: z.string().trim().min(3, "Customer name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number"),
  productName: z.string().min(1, "Please select a product"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
//   createdAt: z.string().optional(),
});

export type AddCustomerForm = z.infer<typeof addCustomerSchema>;
