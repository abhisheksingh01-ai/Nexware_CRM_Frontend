import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import api from "../../../../api/api";
import { useAuthStore } from "../../../../store/authStore";

const ChangePasswordModal = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { id, token } = useAuthStore.getState().user;

  const handleSave = async () => {
    if (!id) {
      alert("User ID is missing!");
      return;
    }

    if (!newPassword) {
      alert("Password cannot be empty!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        api.User.AdminUpdateAnyUserPassword, 
        {
          id: id,          
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Password updated successfully!");
      onClose();
    } catch (error) {
      console.error(
        "Failed to update password:",
        error.response?.data || error
      );
      alert(
        error.response?.data?.message ||
          "Failed to change password. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 pr-12 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
