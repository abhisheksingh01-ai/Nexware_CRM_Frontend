import React from "react";

const ProfileField = ({ label, value, icon: Icon, disabled, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Icon size={18} />
        </span>

        <input
          type="text"
          value={value}        
          readOnly={disabled}  
          onChange={onChange}   
          className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          `}
        />
      </div>
    </div>
  );
};

export default ProfileField;
