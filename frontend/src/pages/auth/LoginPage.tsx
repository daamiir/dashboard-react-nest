import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginFormValues, loginSchema } from "@/modules/auth/schema";
import { LoginForm } from "@/modules/auth/components/LoginForm";
import { useLoginMutation } from "@/modules/auth/hooks/useLoginMutation";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLoginMutation();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className="flex flex-col gap-6">
              <LoginForm />
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

export default LoginPage;
