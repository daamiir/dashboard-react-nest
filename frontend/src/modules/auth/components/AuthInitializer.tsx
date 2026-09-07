import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";

interface AuthInitializerProps {
  children: ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  const { data, isError, isFetching } = useQuery({
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
      logout();
    }
  }, [isError, logout]);

  if (token && isFetching) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
};
