import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

interface AuthInitializerProps {
  children: ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  const { data, error, isError, isFetching } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(token as string),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });

  // Token is valid
  useEffect(() => {
    if (data && token) {
      setAuth(data, token);
    }
  }, [data, token, setAuth]);

  // Token is invalid/expired
  useEffect(() => {
    if (isError) {
      if (!(error instanceof TypeError)) {
        toast.info("Session expired, log in again", {
          id: "session-expired",
        });
      }
      logout();
    }
  }, [isError, error, logout]);

  if (token && !user && isFetching) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
};
