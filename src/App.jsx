import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/login/LoginForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./components/dashboards/admin/AdminDashboard";
import LeadsPage from "./components/adminDashboard/pages/LeadsPage";
import UsersPage from "./components/adminDashboard/pages/UsersPage";
import ProductsPage from "./components/adminDashboard/pages/ProductsPage";
import ReportsPage from "./components/adminDashboard/pages/OrdersPage";
import ProfileSettingPage from "./components/adminDashboard/pages/ProfileSettingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<ReportsPage />} />
            <Route path="profile" element={<ProfileSettingPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
