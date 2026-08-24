import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  ProductDescriptionCard,
  PricingAvailabilityCard,
} from "@/modules/e-commerce/products";
import { useCreateProduct } from "@/modules/e-commerce/products/hooks/useProducts";
import {
  productSchema,
  type ProductFormValues,
} from "@/modules/e-commerce/products/schema";

const AddProductPage = () => {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

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

  const onSubmit = (data: ProductFormValues) => {
    createProduct.mutate(data, {
      onSuccess: () => navigate("/e-commerce/products"),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold mb-4">Add Product</h1>
          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              <ProductDescriptionCard />
              <PricingAvailabilityCard />
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
                onClick={() => navigate("/e-commerce/products")}
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
