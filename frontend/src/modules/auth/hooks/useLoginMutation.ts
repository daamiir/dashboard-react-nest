import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success("Login successful");
    },
    onError: (err: Error) => {
      toast.error(getErrorMessage(err, "Login failed. Try again."));
    },
  });
}
