import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

type StockQuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export const StockQuantityInput = ({
  value,
  onChange,
}: StockQuantityInputProps) => {
  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="px-3 py-2 hover:bg-muted"
      >
        <Minus className="h-4 w-4" />
      </button>
      <Input
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="border-0 text-center focus-visible:ring-0"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="px-3 py-2 hover:bg-muted"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};
