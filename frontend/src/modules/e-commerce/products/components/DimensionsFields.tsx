import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const DimensionsFields = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div className="space-y-2">
        <Label>Weight (KG)</Label>
        <Input type="number" placeholder="15" />
      </div>
      <div className="space-y-2">
        <Label>Length (CM)</Label>
        <Input type="number" placeholder="120" />
      </div>
      <div className="space-y-2">
        <Label>Width (CM)</Label>
        <Input type="number" placeholder="23" />
      </div>
    </div>
  );
};
