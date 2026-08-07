import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AddProductPage = lazy(() => import("@/pages/e-commerce/AddProductPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/e-commerce/add-product" element={<AddProductPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
