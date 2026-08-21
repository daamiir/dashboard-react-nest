import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ProductDescriptionCard,
  PricingAvailabilityCard,
} from "@/modules/e-commerce/products";
import {
  useProduct,
  useUpdateProduct,
} from "@/modules/e-commerce/products/hooks/useProducts";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(1);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setCategory(product.category);
    setBrand(product.brand);
    setPrice(product.price);
    setStock(product.stockQuantity);
  }, [product]);

  const handleSave = () => {
    if (!id) return;
    updateProduct.mutate(
      { id, payload: { name, category, brand, price, stockQuantity: stock } },
      { onSuccess: () => navigate("/e-commerce/products") },
    );
  };

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Loading product…</p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Product</h1>

      <div className="space-y-6">
        <div className="flex flex-col gap-6">
          <ProductDescriptionCard
            name={name}
            onNameChange={setName}
            category={category}
            onCategoryChange={setCategory}
            brand={brand}
            onBrandChange={setBrand}
          />
          <PricingAvailabilityCard
            price={price}
            onPriceChange={setPrice}
            stock={stock}
            onStockChange={setStock}
          />
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
            onClick={handleSave}
            disabled={updateProduct.isPending}
          >
            {updateProduct.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;