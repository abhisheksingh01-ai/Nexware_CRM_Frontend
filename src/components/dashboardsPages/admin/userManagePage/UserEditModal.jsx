// UserEditModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../../api/api";
import { useAuthStore } from "../../../../store/authStore";
const Icons = {
  Close: () => (
    <svg
      className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  User: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Mail: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  Phone: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM7 12h10m0 0l-4-4m4 4l-4 4"
      />
    </svg>
  ),
  Lock: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 11c1.104 0 2 .896 2 2v3a2 2 0 01-4 0v-3c0-1.104.896-2 2-2zm6-2h-1V7a5 5 0 00-10 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V11a2 2 0 00-2-2z"
      />
    </svg>
  ),
  Briefcase: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  Users: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zM21 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
};

// --- Input Field Component ---
const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative group">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 pointer-events-none">
        <Icon />
      </div>
    )}
    <input
      {...props}
      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-400"
    />
  </div>
);

// --- User Edit Modal ---
const UserEditModal = ({ user, onClose, onUserUpdated }) => {
  const { user: authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teamHeads, setTeamHeads] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    password: "",
    role: user.role || "",
    status: user.status || "active",
    teamHeadId: user.teamHeadId || "",
  });

  useEffect(() => {
    const fetchTeamHeads = async () => {
      if (!authUser?.token) return;
      try {
        const res = await fetch(api.User.AdminGetAll, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`,
          },
        });
        const data = await res.json();
        const heads = Array.isArray(data)
          ? data.filter((u) => u.role === "teamhead")
          : (data.users || []).filter((u) => u.role === "teamhead");
        setTeamHeads(heads);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeamHeads();
  }, [authUser?.token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser?.token) return;

    if (formData.role === "agent" && !formData.teamHeadId) {
      setError("Please select a Team Head for the agent.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(api.User.AdminUpdate, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify({ userId: user._id, updates: formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");
      if (onUserUpdated) onUserUpdated(data.data || data.user);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
            <button onClick={onClose}>
              <Icons.Close />
            </button>
          </div>
          {error && <p className="text-red-600 mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              icon={Icons.User}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              icon={Icons.Mail}
              type="email"
              name="email"
              value={formData.email}
              readOnly
            />

            <InputField
              icon={Icons.Phone}
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icons.Lock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Icons.Users /> : <Icons.Users />}
              </button>
            </div>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Icons.Briefcase />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none cursor-pointer"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="subadmin">Sub Admin</option>
                <option value="teamhead">Team Head</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            {formData.role === "agent" && (
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icons.Users />
                </div>
                <select
                  name="teamHeadId"
                  value={formData.teamHeadId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none cursor-pointer"
                  required
                >
                  <option value="">Select Team Head</option>
                  {teamHeads.map((head) => (
                    <option key={head._id} value={head._id}>
                      {head.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserEditModal;
