import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { profileApi } from "../api/profile.api";
import { getErrorMessage } from "@/lib/errors";

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: (user) => {
      setUser(user);
      toast.success("Profile updated");
    },
    onError: (err: Error) =>
      toast.error(
        getErrorMessage(err, "Couldn't update your profile. Try again."),
      ),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => toast.success("Password updated"),
    onError: (err: Error) =>
      toast.error(
        getErrorMessage(err, "Couldn't change your password. Try again."),
      ),
  });
}
