// ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../../api/api";
import { useAuthStore } from "../../../store/authStore";
import ProfileDetails from "./Profile/ProfileDetails";

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser?.token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await fetch(api.User.GetOwnProfile, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        const profile = data.data;

        // Fetch Team Head name if exists
        let teamHeadName = "No Team Head";
        if (profile.teamHeadId) {
          const headRes = await fetch(`${api.User.AdminGetAll}/${profile.teamHeadId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authUser.token}`,
            },
          });
          if (headRes.ok) {
            const headData = await headRes.json();
            teamHeadName = headData.data?.name || "Unknown";
          }
        }

        setUser({ ...profile, teamHeadName });
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?.token]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 max-w-sm">
          <div className="text-red-500 font-medium mb-2">Error Loading Profile</div>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <ProfileDetails user={user} />
    </div>
  );
}
