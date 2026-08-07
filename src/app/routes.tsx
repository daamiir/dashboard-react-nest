import { Routes, Route, Navigate } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";
import DashboardPage from "@/pages/DashboardPage";
import AddProductPage from "@/pages/e-commerce/AddProductPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/e-commerce/add-product" element={<AddProductPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
