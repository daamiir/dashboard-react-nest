import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "./FormInput";
import { FormStepper } from "./FormStepper";

export const PricingAvailabilityCard = () => {
  return (
    <Card className="px-6 py-4 sm:px-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <CardTitle>Pricing &amp; Availability</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormInput
            name="price"
            label="Price ($)"
            type="number"
            min={0}
            step="1"
            placeholder="0.00"
          />
          <FormStepper name="stockQuantity" label="Stock Quantity" min={0} />
        </div>
      </CardContent>
    </Card>
  );
};
