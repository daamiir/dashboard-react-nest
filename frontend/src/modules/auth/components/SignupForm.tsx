import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "../components/FormInput";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Link } from "react-router-dom";
import { FormRadioInput } from "./FormRadioInput";

export const SignupForm = () => {
  return (
    <Card className="px-4 py-4 sm:px-6 rounded-2xl bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <FieldGroup>
          <FormInput name="name" label="Name" placeholder="John Doe" />
          <FormInput name="email" label="Email" placeholder="m@example.com" />
          <FormInput name="password" label="Password" />

          <div className="flex justify-between items-center">
            <FormRadioInput name="role" label="Buyer" value={"BUYER"} />
            <FormRadioInput name="role" label="Seller" value={"SELLER"} />
          </div>

          <Field>
            <Button type="submit">Create Account</Button>
            <FieldDescription className="text-center">
              Already have a account? <Link to="/login">Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};
