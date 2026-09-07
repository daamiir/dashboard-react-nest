import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import type { Role } from "@/modules/auth/types";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { user, token } = useAuthStore();
  const location = useLocation();

  // Not authenticated -> Redirect to login
  if (!token || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Role check failed -> Redirect to unauthorized route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
