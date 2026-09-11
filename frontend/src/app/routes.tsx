import AppLayout from "@/components/layout/seller/AppLayout";
import BuyerLayout from "@/components/layout/buyer/BuyerLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const LandingPage = lazy(() => import("@/pages/buyer/LandingPage"));
const ProductsPage = lazy(() => import("@/pages/buyer/ProductsPage"));
const DashboardPage = lazy(() => import("@/pages/seller/DashboardPage"));
const ProductsSellerPage = lazy(() => import("@/pages/seller/ProductsPage"));
const AddProductPage = lazy(() => import("@/pages/seller/AddProductPage"));
const EditProductPage = lazy(() => import("@/pages/seller/EditProductPage"));
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
          <Route path="/shop/:id" element={<div>Product Details Page</div>} />
          <Route path="/cart" element={<div>Cart Page</div>} />

          {/*Buyer: protected routes*/}
          <Route
            element={<ProtectedRoute allowedRoles={["BUYER", "SELLER"]} />}
          >
            <Route path="/checkout" element={<div>Checkout Page</div>} />
          </Route>
        </Route>

        {/*Seller: protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["SELLER"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/seller" element={<DashboardPage />} />
            <Route path="/seller/products" element={<ProductsSellerPage />} />

            <Route path="/seller/products/add" element={<AddProductPage />} />
            <Route
              path="/seller/products/edit/:id"
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
