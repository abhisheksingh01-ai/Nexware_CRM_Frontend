import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Target,
} from "lucide-react";

export default function AdminSidebar() {
  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Manage Users", icon: Users },
    { to: "/admin/leads", label: "Leads", icon: Target },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  ];

  return (
    <aside
      className="
        h-screen w-64 flex-shrink-0 hidden md:block 
        border-r border-[#0F2A53] shadow-xl relative
      "
      style={{ background: "#163D7A" }}
    >
      <div className="p-6">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-md">
            <span className="font-bold text-[#163D7A]">CRM</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">ADMIN</div>
            <div className="text-[#BFD3FF] text-xs">Control Panel</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium 
                  transition-all duration-200 relative group

                  ${
                    isActive
                      ? "bg-[#143B68] text-white shadow-md"
                      : "text-[#D6E5FF] hover:bg-[#143B68]/60 hover:text-white"
                  }
                `
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>

              {/* right accent highlight bar */}
              <span
                className={`
                  absolute right-0 top-0 h-full w-1 rounded-l-full 
                  transition-all duration-200 
                  ${location.pathname === to ? "bg-white" : "group-hover:bg-white/40"}
                `}
              />
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
