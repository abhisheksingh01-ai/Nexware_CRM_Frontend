// src/store/authStore.js
import { create } from "zustand";
import Cookies from "js-cookie";

export const useAuthStore = create((set) => ({
  user: {
    id: Cookies.get("id") || null,
    name: Cookies.get("name") || "",
    email: Cookies.get("email") || "",
    role: Cookies.get("role") || "",
    token: Cookies.get("token") || "",
  },

  // Login → save cookies
  login: (userData) => {
    Cookies.set("id", userData.id, { expires: 7 });
    Cookies.set("name", userData.name, { expires: 7 });
    Cookies.set("email", userData.email, { expires: 7 });
    Cookies.set("role", userData.role, { expires: 7 });
    Cookies.set("token", userData.token, { expires: 7 });

    set({ user: userData });
  },

  // Logout → remove cookies
  logout: () => {
    Cookies.remove("id");
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("role");
    Cookies.remove("token");

    set({
      user: { id: null, name: "", email: "", role: "", token: "" }
    });
  },
}));
