import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ProductsPage = lazy(() => import("@/pages/e-commerce/ProductsPage"));
const AddProductPage = lazy(() => import("@/pages/e-commerce/AddProductPage"));
const EditProductPage = lazy(() => import("@/pages/e-commerce/EditProductPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/e-commerce/products" element={<ProductsPage />} />
        <Route path="/e-commerce/add-product" element={<AddProductPage />} />
        <Route path="/e-commerce/edit-product/:id" element={<EditProductPage />} />
        <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </Suspense>
  );
}