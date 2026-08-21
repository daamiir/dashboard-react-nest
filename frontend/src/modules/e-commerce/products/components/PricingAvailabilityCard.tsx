import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockQuantityInput } from "./StockQuantityInput";

type PricingAvailabilityCardProps = {
  price: number;
  onPriceChange: (value: number) => void;
  stock: number;
  onStockChange: (value: number) => void;
};

export const PricingAvailabilityCard = ({
  price,
  onPriceChange,
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
            <Label>Price ($)</Label>
            <Input
              type="number"
              min={0}
              step="1"
              placeholder="0.00"
              value={price}
              onChange={(e) => onPriceChange(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Stock Quantity</Label>
            <StockQuantityInput value={stock} onChange={onStockChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};