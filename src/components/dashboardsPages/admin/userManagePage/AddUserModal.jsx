import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../../api/api";
import { useAuthStore } from "../../../../store/authStore";

const AddUserModal = ({ onClose, onUserAdded }) => {
  const { user: authUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    status: "active",
    teamHeadId: "", 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teamHeads, setTeamHeads] = useState([]);

  // Fetch all team heads for the dropdown
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
      console.error("Failed to fetch team heads:", err);
    }
  };

  useEffect(() => {
    fetchTeamHeads();
  }, [authUser?.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser?.token) return;

    // Require teamHeadId if role is agent
    if (formData.role === "agent" && !formData.teamHeadId) {
      setError("Please select a Team Head for the agent.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(api.User.AdminCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create user");

      if (onUserAdded) onUserAdded(data.user || data);

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
      <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.25 }}
          className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl p-6 rounded-2xl w-96"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="subadmin">Sub Admin</option>
              <option value="teamhead">Team Head</option>
              <option value="agent">Agent</option>
            </select>

            {/* Show Team Head dropdown only if role is agent */}
            {formData.role === "agent" && (
              <select
                name="teamHeadId"
                value={formData.teamHeadId}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
                required
              >
                <option value="">Select Team Head</option>
                {teamHeads.map((head) => (
                  <option key={head._id} value={head._id}>
                    {head.name}
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add User"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddUserModal;
