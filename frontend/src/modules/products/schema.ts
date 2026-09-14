import * as z from "zod";

export const CATEGORIES = [
  "SMARTPHONE",
  "LAPTOP",
  "TABLET",
  "HEADPHONES",
] as const;

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.enum(CATEGORIES),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(0, "Price must be positive"),
  stockQuantity: z.number().min(0, "Quantity of stock must be positive"),
  description: z.string().min(1, "Description is required"),

  attributes: z.record(z.string(), z.unknown()),
});

export type ProductFormValues = z.infer<typeof productSchema>;
