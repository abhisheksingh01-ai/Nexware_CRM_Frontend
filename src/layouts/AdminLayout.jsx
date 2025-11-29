import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/dashboards/admin/AdminSidebar";
import AdminNavbar from "../components/dashboards/admin/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">

        {/* Top navbar */}
        <AdminNavbar />

        {/* VERY IMPORTANT — this loads AdminDashboard */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
