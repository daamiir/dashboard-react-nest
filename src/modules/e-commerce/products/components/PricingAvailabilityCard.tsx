import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockQuantityInput } from "./StockQuantityInput";

type PricingAvailabilityCardProps = {
  stock: number;
  onStockChange: (value: number) => void;
};

export const PricingAvailabilityCard = ({
  stock,
  onStockChange,
}: PricingAvailabilityCardProps) => {
  return (
    <Card className="px-6 py-4 sm:px-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <CardTitle>Pricing &amp; Availability</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label>Stock Quantity</Label>
            <StockQuantityInput value={stock} onChange={onStockChange} />
          </div>
          <div className="space-y-2">
            <Label>Availability Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
