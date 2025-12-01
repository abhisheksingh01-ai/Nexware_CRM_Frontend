import React, { useState } from "react";
import ProfileImage from "./ProfileImage";
import ProfileField from "./ProfileField";
import ChangePasswordModal from "./ChangePasswordModal";
import { User, Mail, Phone, Briefcase, Activity, Users } from "lucide-react";

const ProfileDetails = ({ user }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Update your photo and personal details here.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
            Save changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left: Profile Image */}
            <div className="md:w-1/4 flex-shrink-0">
              <h3 className="text-sm font-medium text-gray-900 mb-4 md:hidden">
                Profile Picture
              </h3>
              <ProfileImage name={user.name} avatarUrl={user.avatar} />
            </div>

            {/* Right: Profile Fields */}
            <div className="md:w-3/4 flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-6 border-b border-gray-100 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField label="Full Name" value={user.name} icon={User} />
                <ProfileField label="Email Address" value={user.email} icon={Mail} />
                <ProfileField label="Phone Number" value={user.phone} icon={Phone} />
                <ProfileField label="Role" value={user.role} icon={Briefcase} disabled />
                <ProfileField label="Status" value={user.status} icon={Activity} disabled />
                <ProfileField label="Team Head" value={user.teamHeadName} icon={Users} disabled />
              </div>

              {/* Security Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Security</h3>
                  <button
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                    onClick={() => setShowChangePassword(true)}
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Change Password Modal */}
              {showChangePassword && (
                <ChangePasswordModal
                  onClose={() => setShowChangePassword(false)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Reset to default
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
