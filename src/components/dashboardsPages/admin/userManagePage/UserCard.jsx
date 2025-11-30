import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const roleStyles = {
  admin: "bg-red-100 text-red-700 border-red-300",
  subadmin: "bg-green-100 text-green-700 border-green-300",
  teamhead: "bg-yellow-100 text-yellow-700 border-yellow-300",
  agent: "bg-blue-100 text-blue-700 border-blue-300",
};

const UserCard = ({ user }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className="
        bg-white/70 backdrop-blur-md border border-gray-200
        shadow-lg p-5 rounded-2xl transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1 flex flex-col gap-3
      "
    >
      {/* TOP SECTION */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-gray-800">
            {user.name}
          </p>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <p className="text-gray-500 text-sm">{user.phone}</p>
        </div>

        {/* ROLE + BUTTON */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${roleStyles[user.role]}`}
          >
            {user.role.toUpperCase()}
          </span>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="
              text-sm font-medium text-blue-600 hover:text-blue-800
              hover:underline transition
            "
          >
            {showDetails ? "Hide Details" : "See More"}
          </button>
        </div>
      </div>

      {/* DETAILS SECTION WITH ANIMATION */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-1"
          >
            <p>
              <span className="font-semibold">Password:</span> {user.password}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {user.status}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserCard;
