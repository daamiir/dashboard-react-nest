import { Label } from "@/components/ui/label";
import type { ComponentPropsWithoutRef } from "react";
import { get, useFormContext } from "react-hook-form";

interface FormRadioInputProps extends ComponentPropsWithoutRef<"input"> {
  name: string;
  label: string;
  value: string;
}

export function FormRadioInput({
  name,
  label,
  value,
  id,
  className,
  ...props
}: FormRadioInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputId = id ?? `${name}-${value}`;
  const error = get(errors, name)?.message as string | undefined;

  return (
    <div className="flex items-center gap-3">
      <input
        type="radio"
        id={inputId}
        value={value}
        className={className}
        {...register(name)}
        {...props}
      />
      <Label htmlFor={inputId}>{label}</Label>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
