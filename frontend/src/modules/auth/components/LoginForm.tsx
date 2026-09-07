import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { FormInput } from "./FormInput";

export const LoginForm = () => {
  return (
    <Card className="px-4 py-4 sm:px-6 rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login with Google account</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <FieldGroup>
          <FormInput name="email" label="Email" />
          <FormInput name="password" label="Password" />

          <Field>
            <Button type="submit">Login</Button>
            <FieldDescription className="text-center">
              Don&apos;t have an account? <a href="#">Sign up</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};
