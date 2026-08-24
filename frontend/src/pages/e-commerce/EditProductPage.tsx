import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  ProductDescriptionCard,
  PricingAvailabilityCard,
} from "@/modules/e-commerce/products";
import {
  useProduct,
  useUpdateProduct,
} from "@/modules/e-commerce/products/hooks/useProducts";
import {
  productSchema,
  type ProductFormValues,
} from "@/modules/e-commerce/products/schema";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      price: 0,
      stockQuantity: 1,
    },
  });

  useEffect(() => {
    if (!product) return;
    methods.reset({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      stockQuantity: product.stockQuantity,
    });
  }, [product, methods]);

  const onSubmit = (data: ProductFormValues) => {
    if (!id) return;
    updateProduct.mutate(
      { id, payload: data },
      { onSuccess: () => navigate("/e-commerce/products") },
    );
  };

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Loading product…</p>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold mb-4">Edit Product</h1>

          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              <ProductDescriptionCard />
              <PricingAvailabilityCard />
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
                onClick={() => navigate("/e-commerce/products")}
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
