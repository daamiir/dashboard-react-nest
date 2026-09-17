import AppLayout from "@/components/layout/admin/AppLayout";
import BuyerLayout from "@/components/layout/buyer/BuyerLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const LandingPage = lazy(() => import("@/pages/buyer/LandingPage"));
const ProductsPage = lazy(() => import("@/pages/buyer/ProductsPage"));
const ProductDetailsPage = lazy(
  () => import("@/pages/buyer/ProductDetailsPage"),
);
const DashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const ProductsAdminPage = lazy(() => import("@/pages/admin/ProductsPage"));
const AddProductPage = lazy(() => import("@/pages/admin/AddProductPage"));
const EditProductPage = lazy(() => import("@/pages/admin/EditProductPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<div>Access Denied</div>} />

        {/* Buyer: public browsing */}
        <Route element={<BuyerLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ProductsPage />} />
          <Route path="/shop/:slug" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<div>Cart Page</div>} />

          {/* Buyer: protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["BUYER", "ADMIN"]} />}>
            <Route path="/checkout" element={<div>Checkout Page</div>} />
          </Route>
        </Route>

        {/* Admin: protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/products" element={<ProductsAdminPage />} />

            <Route path="/admin/products/add" element={<AddProductPage />} />
            <Route
              path="/admin/products/edit/:id"
              element={<EditProductPage />}
            />
          </Route>
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
