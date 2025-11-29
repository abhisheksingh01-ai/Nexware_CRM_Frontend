import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="space-y-4">
        <Link to="/admin" className="block hover:text-yellow-400">
          📊 Dashboard
        </Link>

        <Link to="/admin/users" className="block hover:text-yellow-400">
          👥 Manage Users
        </Link>

        <Link to="/admin/products" className="block hover:text-yellow-400">
          🛒 Products
        </Link>

        <Link to="/admin/reports" className="block hover:text-yellow-400">
          📑 Reports
        </Link>
      </nav>
    </div>
  );
}
