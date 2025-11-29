import React from "react";
import { useAuthStore } from "../../../store/authStore";

export default function AdminNavbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-full bg-white shadow p-4 flex justify-end items-center">
      <span className="mr-4 font-medium">Welcome, {user?.name}</span>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
