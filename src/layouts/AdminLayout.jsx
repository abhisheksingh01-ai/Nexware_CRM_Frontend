import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/dashboards/admin/AdminSidebar";
import AdminNavbar from "../components/dashboards/admin/AdminNavbar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* ===== Sidebar (Desktop) ===== */}
      <div className="hidden md:block w-64 fixed left-0 top-0 h-screen bg-white shadow-lg z-50">
        <AdminSidebar />
      </div>

      {/* ===== Sidebar (Mobile Drawer) ===== */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-50 transform duration-300 md:hidden w-64 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar close={() => setOpen(false)} />
      </div>

      {/* ===== Main Section ===== */}
      <div className="flex-1 flex flex-col md:ml-64">

        {/* ===== STICKY NAVBAR ===== */}
        <div className="sticky top-0 z-40 bg-white shadow">
          <AdminNavbar onMenuClick={() => setOpen(true)} />
        </div>

        {/* Scrollable Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
