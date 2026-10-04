import { useNavigate } from "react-router-dom";
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
import { useCreateProduct } from "@/modules/products/hooks/useProducts";
import { useCategories } from "@/modules/categories/hooks/useCategories";
import {
  productSchema,
  pruneColorImages,
  type ProductFormInput,
  type ProductFormValues,
} from "@/modules/products/schema";
import { buildAttributesSchema } from "@/modules/products/config/build-attributes-schema";

const AddProductPage = () => {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const { data: categories = [] } = useCategories();

  const methods = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      brand: "",
      description: "",
      attributes: {},
      variants: [],
      colorImages: [],
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    // attributes are validated separately against the schema built for
    // the currently selected category (required fields/types differ
    // per category, so productSchema keeps `attributes` loose).
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

    createProduct.mutate(payload, {
      onSuccess: () => navigate("/admin/products"),
    });
  };

  const onInvalid = (errors: FieldErrors<ProductFormInput>) => {
    console.error(errors);
    toast.error("Some fields are invalid, check variants and images");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold mb-4">Add Product</h1>
          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              <ProductDescriptionCard />
              <ProductVariantsCard />
              <ProductImagesCard />
            </div>

            {createProduct.isError && (
              <p className="text-sm text-destructive">
                Couldn't save the product. Check the backend is running and try
                again.
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
                disabled={createProduct.isPending}
                type="submit"
              >
                {createProduct.isPending ? "Publishing…" : "Publish Product"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddProductPage;
