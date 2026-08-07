import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ProductDescriptionCard,
  PricingAvailabilityCard,
  ProductImagesCard,
} from "@/modules/e-commerce/products";

const AddProductPage = () => {
  const [stock, setStock] = useState(1);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Add Product</h1>

      <div className="flex flex-col gap-6">
        <ProductDescriptionCard />
        <PricingAvailabilityCard stock={stock} onStockChange={setStock} />
        <ProductImagesCard />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Draft</Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Publish Product
        </Button>
      </div>
    </div>
  );
};

export default AddProductPage;
