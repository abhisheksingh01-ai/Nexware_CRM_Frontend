// src/components/adminDashboard/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Admin Sidebar (Updated UI)
 * - Matches the CRM theme (#163D7A)
 * - Uses NavLink for route highlighting
 */
export default function AdminSidebar() {
  const links = [
    { to: "/admin", label: "Dashboard", icon: "🏠" },
    { to: "/admin/leads", label: "Leads", icon: "🏠" },
    { to: "/admin/products", label: "Products", icon: "📦" },
    { to: "/admin/orders", label: "Orders", icon: "📑" },
    { to: "/admin/users", label: "Manage Users", icon: "👥" },
  ];

  return (
    <aside
      className="h-screen w-60 flex-shrink-0 hidden md:block"
      style={{ background: "#163D7A" }}
    >
      <div className="p-6">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded bg-white flex items-center justify-center">
            <span className="font-semibold text-[#163D7A]">CRM</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">ADMIN</div>
            <div className="text-xs text-[#BFD3FF]">Control Panel</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mb-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm font-medium 
                ${isActive ? "bg-[#143B68] text-white" : "text-[#CFE1FF] hover:bg-[#143B68] hover:text-white"}
              `
              }
            >
              <span className="text-lg">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
