import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { FormInput } from "@/modules/auth/components/FormInput";
import { FormStepper } from "./FormStepper";
import type { ProductFormValues } from "@/modules/products/schema";

export const PricingAvailabilityCard = () => {
  const { control } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const addVariant = () =>
    append({
      sku: "",
      price: 0,
      stockQuantity: 0,
      images: [],
      attributes: {},
    });

  return (
    <Card className="px-6 py-4 sm:px-6 rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pricing &amp; Availability</CardTitle>
        <Button type="button" size="sm" variant="outline" onClick={addVariant}>
          <Plus className="h-4 w-4 mr-1" />
          Add Variant
        </Button>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 border rounded-lg p-4 relative"
          >
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
            <FormInput
              name={`variants.${index}.sku`}
              label="SKU"
              placeholder="e.g. IPH17P-256-BLK"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormInput
                name={`variants.${index}.price`}
                label="Price ($)"
                type="number"
                min={0}
                step="1"
                placeholder="0.00"
              />
              <FormStepper
                name={`variants.${index}.stockQuantity`}
                label="Stock Quantity"
                min={0}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
