import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";

export function useRegisterMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success("Registration successful");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Registration failed. Try again."));
    },
  });
}
