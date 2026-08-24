import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "./FormInput";

export const ProductDescriptionCard = () => {
  return (
    <Card className="px-4 py-4 sm:px-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <CardTitle>Products Description</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput
            name="name"
            label="Product Name"
            placeholder="Enter product name"
          />
          <FormInput
            name="category"
            label="Category"
            placeholder="e.g. Laptop, Audio, Phone"
          />
        </div>

        <FormInput
          name="brand"
          label="Brand"
          placeholder="e.g. Apple, Samsung, Dell"
        />
      </CardContent>
    </Card>
  );
};
