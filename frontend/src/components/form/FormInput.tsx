import { useFormContext, get } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ComponentPropsWithoutRef } from "react";

interface FormInputProps extends ComponentPropsWithoutRef<"input"> {
  name: string;
  label: string;
}

export function FormInput({
  name,
  label,
  type = "text",
  className,
  ...props
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        className={className}
        {...register(name, {
          valueAsNumber: type === "number",
        })}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
