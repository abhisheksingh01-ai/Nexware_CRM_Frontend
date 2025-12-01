// ProfileImage.jsx
import React from "react";
import { Camera, Trash2 } from "lucide-react";

const ProfileImage = ({ name, avatarUrl }) => {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "NP";

  return (
    <div className="flex flex-col items-center md:items-start gap-4">
      <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative group">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold text-indigo-600">{initials}</span>
        )}
      </div>

      <div className="flex gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors">
          <Camera size={14} /> Upload
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          <Trash2 size={14} /> Remove
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center md:text-left max-w-[150px]">
        JPG, GIF or PNG. Max size of 800K
      </p>
    </div>
  );
};

export default ProfileImage;
