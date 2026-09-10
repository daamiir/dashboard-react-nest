import AppLayout from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ProductsPage = lazy(() => import("@/pages/e-commerce/ProductsPage"));
const AddProductPage = lazy(() => import("@/pages/e-commerce/AddProductPage"));
const EditProductPage = lazy(
  () => import("@/pages/e-commerce/EditProductPage"),
);
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<div>Access Denied</div>} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/e-commerce/products" element={<ProductsPage />} />

            {/* Protected routes for SELLER */}
            <Route element={<ProtectedRoute allowedRoles={["SELLER"]} />}>
              <Route
                path="/e-commerce/add-product"
                element={<AddProductPage />}
              />
              <Route
                path="/e-commerce/edit-product/:id"
                element={<EditProductPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
