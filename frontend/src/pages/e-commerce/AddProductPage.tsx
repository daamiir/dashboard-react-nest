import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ProductDescriptionCard,
  PricingAvailabilityCard,
} from "@/modules/e-commerce/products";
import { useCreateProduct } from "@/modules/e-commerce/products/hooks/useProducts";

const AddProductPage = () => {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(1);

  const handlePublish = () => {
    if (!name.trim() || !category.trim() || !brand.trim()) return;
    createProduct.mutate(
      { name, category, brand, price, stockQuantity: stock },
      { onSuccess: () => navigate("/e-commerce/products") },
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Add Product</h1>

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
            onClick={handlePublish}
            disabled={createProduct.isPending}
          >
            {createProduct.isPending ? "Publishing…" : "Publish Product"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
