import { useEffect, useState } from "react";
import api from "../../../api/api";
import { useAuthStore } from "../../../store/authStore";
import ProfileDetails from "./Profile/ProfileDetails";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user: authUser } = useAuthStore(); // Get logged-in user token
  const [user, setUser] = useState(null);
  const [teamHeadName, setTeamHeadName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser?.token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        // 🔹 Fetch own profile
        const res = await fetch(api.User.GetOwnProfile, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const profileData = await res.json();
        setUser(profileData.data); // ← Use .data because API returns { success, data }

        // 🔹 Fetch Team Head details if exists
        if (profileData.data?.teamHeadId) {
          const headRes = await fetch(
            `${api.User.AdminGetAll}/${profileData.data.teamHeadId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authUser.token}`,
              },
            }
          );

          if (!headRes.ok) throw new Error("Failed to fetch team head");

          const headData = await headRes.json();
          setTeamHeadName(headData.data?.name || "Unknown");
        } else {
          setTeamHeadName("No Team Head");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?.token]);

  // 🔹 Loading state
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="ml-4 text-gray-500">Loading profile...</p>
      </div>
    );

  // 🔹 Error state
  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  // 🔹 Render Profile Details
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center p-4">
      <ProfileDetails user={{ ...user, teamHeadName }} />
    </div>
  );
}
