// src/components/adminDashboard/AdminNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export default function AdminNavbar({ title = "Admin Dashboard", subtitle = "" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full py-4 px-6 md:px-10 bg-transparent shadow-sm relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#1A1A1A" }}>{title}</h1>
          {subtitle && <p className="text-sm" style={{ color: "#6A6A6A" }}>{subtitle}</p>}
        </div>

        {/* Profile Section */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-[#E8F0FF] flex items-center justify-center font-semibold text-lg"
            style={{ color: "#176BFF" }}
          >
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </button>

          {/* Popup Card */}
          {open && (
            <div
              className="absolute right-0 mt-3 w-60 rounded-xl shadow-2xl bg-white border p-4 z-50"
              style={{ borderColor: "#E6E8EE" }}
            >
              {/* User Info */}
              <div className="mb-3 border-b pb-3">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              {/* Options */}
              <button
                onClick={() => {
                  navigate("/admin/profile");
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded text-sm hover:bg-[#E8F0FF] mb-2"
                style={{ color: "#1A1A1A" }}
              >
                Profile Settings
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded text-sm hover:bg-[#E8F0FF]"
                style={{ color: "#E44141" }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
