import { useFormContext, useWatch, get } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface FormStepperProps {
  name: string;
  label: string;
  min?: number;
}

export function FormStepper({ name, label, min = 0 }: FormStepperProps) {
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const currentValue = useWatch({
    control,
    name,
    defaultValue: min,
  });

  const error = get(errors, name)?.message as string | undefined;

  const handleDecrement = () => {
    if (currentValue > min) {
      setValue(name, currentValue - 1, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleIncrement = () => {
    setValue(name, currentValue + 1, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center border rounded-md overflow-hidden h-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-none border-r h-full px-3"
          onClick={handleDecrement}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="flex items-center justify-center w-full h-full">
          {currentValue}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-none border-l h-full px-3"
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
