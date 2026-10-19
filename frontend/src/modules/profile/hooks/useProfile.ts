import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { profileApi } from "../api/profile.api";

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: (user) => {
      setUser(user);
      toast.success("Profile updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => toast.success("Password updated"),
    onError: (err: Error) => toast.error(err.message),
  });
}
