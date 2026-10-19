import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormPasswordInput } from "./FormPasswordInput";
import { useChangePassword } from "../hooks/useProfile";
import { passwordSchema, type PasswordValues } from "../schema";

export function PasswordForm() {
  const { mutate, isPending } = useChangePassword();

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (values: PasswordValues) =>
    mutate(values, { onSuccess: () => form.reset() });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormPasswordInput
          name="newPassword"
          label="New password"
          placeholder="Enter new password"
        />
        <FormPasswordInput
          name="confirmPassword"
          label="Confirm password"
          placeholder="Repeat new password"
        />
        <Button type="submit" disabled={isPending}>
          Update password
        </Button>
      </form>
    </FormProvider>
  );
}
