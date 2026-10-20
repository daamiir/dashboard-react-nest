import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useUpdateProfile } from "../hooks/useProfile";
import { profileSchema, type ProfileValues } from "../schema";

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);
  const { mutate, isPending } = useUpdateProfile();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", email: user?.email ?? "" },
    resetOptions: { keepDirtyValues: true },
  });

  const onSubmit = (values: ProfileValues) => mutate(values);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="name" label="Name" placeholder="Enter your name" />
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          Save changes
        </Button>
      </form>
    </FormProvider>
  );
}
