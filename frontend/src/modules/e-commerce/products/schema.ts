import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(0, "Price must be positive"),
  stockQuantity: z.number().min(0, "Quantity of stock must be positive"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
