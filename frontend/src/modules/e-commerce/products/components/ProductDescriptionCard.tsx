import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProductDescriptionCardProps = {
  name: string;
  onNameChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  brand: string;
  onBrandChange: (value: string) => void;
};

export const ProductDescriptionCard = ({
  name,
  onNameChange,
  category,
  onCategoryChange,
  brand,
  onBrandChange,
}: ProductDescriptionCardProps) => {
  return (
    <Card className="px-4 py-4 sm:px-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader>
        <CardTitle>Products Description</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              placeholder="Enter product name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              placeholder="e.g. Laptop, Audio, Phone"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Brand</Label>
          <Input
            placeholder="e.g. Apple, Samsung, Dell"
            value={brand}
            onChange={(e) => onBrandChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
