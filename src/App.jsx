import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/login/LoginForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./components/dashboards/admin/AdminDashboard";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
