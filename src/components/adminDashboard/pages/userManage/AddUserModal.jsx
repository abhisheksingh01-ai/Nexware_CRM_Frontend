import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddUserModal = ({ onClose, addUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "agent",
    password: "",
    status: "active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser({ id: Date.now(), ...formData });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.25 }}
          className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl 
                     p-6 rounded-2xl w-96 animate-fadeIn"
        >
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New User
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* Inputs */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            {/* Dropdowns */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="subadmin">Sub Admin</option>
              <option value="teamhead">Team Head</option>
              <option value="agent">Agent</option>
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 bg-white/70 p-3 text-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border text-gray-700 hover:bg-gray-100 
                           transition font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium 
                           hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              >
                Add User
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddUserModal;
