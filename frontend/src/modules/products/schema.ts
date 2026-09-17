import * as z from "zod";

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be positive"),
  stockQuantity: z.number().min(0, "Quantity of stock must be positive"),
  images: z.array(z.string()),
  attributes: z.record(z.string(), z.unknown()),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().uuid("Category is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
  attributes: z.record(z.string(), z.unknown()),

  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export type VariantFormValues = z.infer<typeof variantSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
