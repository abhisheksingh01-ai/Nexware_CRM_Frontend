// ProfileField.jsx
import React from "react";

const ProfileField = ({ label, value, icon: Icon, disabled = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {Icon && <Icon size={16} />}
        </div>
        <input
          type="text"
          value={value || ""}
          disabled={disabled}
          className={`w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm transition-all ${
            disabled
              ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          }`}
        />
      </div>
    </div>
  );
};

export default ProfileField;
