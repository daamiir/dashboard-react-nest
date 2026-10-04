import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ProductDescriptionCard,
  ProductVariantsCard,
  ProductImagesCard,
  VARIANT_SPECS,
  validateSpecs,
} from "@/modules/products";
import {
  useProduct,
  useUpdateProduct,
} from "@/modules/products/hooks/useProducts";
import { useCategories } from "@/modules/categories/hooks/useCategories";
import {
  productSchema,
  pruneColorImages,
  type ProductFormInput,
  type ProductFormValues,
} from "@/modules/products/schema";
import { buildAttributesSchema } from "@/modules/products/config/build-attributes-schema";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct();
  const { data: categories = [] } = useCategories();

  const methods = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      brand: "",
      description: "",
      attributes: {},
      variants: [
        { sku: "", price: 0, stockQuantity: 1, images: [], attributes: {} },
      ],
      colorImages: [],
    },
  });

  useEffect(() => {
    if (!product) return;
    methods.reset({
      name: product.name,
      categoryId: product.categoryId,
      brand: product.brand,
      description: product.description,
      attributes: product.attributes ?? {},
      variants: product.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        price: Number(v.price),
        stockQuantity: v.stockQuantity,
        images: v.ownImages,
        attributes: v.attributes ?? {},
      })),
      colorImages: product.colorImages.map(({ color, images }) => ({
        color,
        images,
      })),
    });
  }, [product, methods]);

  const onSubmit = (data: ProductFormValues) => {
    if (!id) return;

    const category = categories.find((c) => c.id === data.categoryId);
    const attributesResult = buildAttributesSchema(
      category?.slug ?? "",
    ).safeParse(data.attributes);
    if (!attributesResult.success) {
      attributesResult.error.issues.forEach((issue) => {
        methods.setError(`attributes.${issue.path.join(".")}` as any, {
          message: issue.message,
        });
      });
      return;
    }

    // Block submit if any variant has an empty spec
    const specs = VARIANT_SPECS[category?.slug ?? ""] ?? [];
    const incomplete =
      specs.length > 0 &&
      data.variants.some(
        (v) => Object.keys(validateSpecs(v.attributes, specs)).length > 0,
      );
    if (incomplete) {
      toast.error("Fill color, RAM and storage for every variant");
      return;
    }

    const payload = {
      ...data,
      attributes: attributesResult.data,
      colorImages: pruneColorImages(data),
    };

    updateProduct.mutate(
      { id, payload },
      { onSuccess: () => navigate("/admin/products") },
    );
  };

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Loading product…</p>
    );
  }

  const onInvalid = (errors: FieldErrors<ProductFormInput>) => {
    console.error(errors);
    toast.error("Some fields are invalid, check variants and images");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold mb-4">Edit Product</h1>

          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              <ProductDescriptionCard />
              <ProductVariantsCard />
              <ProductImagesCard />
            </div>

            {updateProduct.isError && (
              <p className="text-sm text-destructive">
                Couldn't save changes. Try again.
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                disabled={updateProduct.isPending}
                type="submit"
              >
                {updateProduct.isPending ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditProductPage;
