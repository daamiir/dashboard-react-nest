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
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Add Product</h1>

      <div className="space-y-6">
        <div className="flex flex-col gap-6">
          <ProductDescriptionCard />
          <PricingAvailabilityCard stock={stock} onStockChange={setStock} />
          <ProductImagesCard />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button variant="outline" className="w-full sm:w-auto">
            Draft
          </Button>
          <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
            Publish Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
