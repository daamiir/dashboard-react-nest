import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "@/modules/auth/hooks/useRegisterMutation";
import { type RegisterFormValues, registerSchema } from "@/modules/auth/schema";
import { SignupForm } from "@/modules/auth/components/SignupForm";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegisterMutation();

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values: RegisterFormValues) => {
    register(values, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className="flex flex-col gap-6">
              <SignupForm />
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignupPage;
