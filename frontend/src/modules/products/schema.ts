import * as z from "zod";

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  stockQuantity: z.number().min(0, "Quantity of stock must be positive"),
  images: z.array(z.string()),
  attributes: z.record(z.string(), z.unknown()),
});

export const colorImagesSchema = z.object({
  color: z.string(),
  images: z.array(z.string()),
});

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required")
      .regex(
        /^[\p{L}\p{N}\s]+$/u,
        "Name can contain only letters, digits and spaces",
      ),
    customSlug: z.boolean(),
    slug: z.string(),
    categoryId: z.string().uuid("Category is required"),
    brand: z.string().min(1, "Brand is required"),
    description: z.string().min(1, "Description is required"),
    attributes: z.record(z.string(), z.unknown()),
    colorImages: z.array(colorImagesSchema),

    variants: z.array(variantSchema).min(1, "At least one variant is required"),
  })
  .superRefine((data, ctx) => {
    if (!data.customSlug) return;
    if (!data.slug) {
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message: "Slug is required",
      });
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message:
          "Slug must contain only lowercase latin letters, numbers, and hyphens",
      });
    }
  });

export type VariantFormValues = z.infer<typeof variantSchema>;
export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;

export const pruneColorImages = (data: ProductFormValues) => {
  const used = new Set(
    data.variants.map((v) => String(v.attributes?.color ?? "")),
  );
  return data.colorImages.filter((c) => used.has(c.color) && c.images.length);
};
