import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const GuestRoute = () => {
  const { user, token } = useAuthStore();
  const location = useLocation();

  if (token && user) {
    const from = location.state?.from?.pathname;
    const home = user.role === "ADMIN" ? "/admin" : "/";
    return <Navigate to={from ?? home} replace />;
  }

  return <Outlet />;
};
