import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/login/LoginForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./components/dashboards/admin/AdminDashboard";
import LeadsPage from "./components/dashboardsPages/admin/LeadsPage";
import UsersPage from "./components/dashboardsPages/admin/UsersPage";
import ProductsPage from "./components/dashboardsPages/admin/ProductsPage";
import OrdersPage from "./components/dashboardsPages/admin/OrdersPage";
import ProfilePage from "./components/dashboardsPages/admin/ProfileSettingPage";

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
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
