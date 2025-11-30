import React, { useState, useEffect } from "react";
import {
  Shield,
  Briefcase,
  Headphones,
  Search,
  UserPlus,
  Loader2,
  Users as UsersIcon,
} from "lucide-react";
import StatsCard from "./userManagePage/StatsCard";
import UserCard from "./userManagePage/UserCard";
import AddUserModal from "./userManagePage/AddUserModal";
import api from "../../../api/api";
import { useAuthStore } from "../../../store/authStore";

const UsersPage = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch Users
  const fetchUsers = async () => {
    if (!user.token) return;
    try {
      setLoading(true);
      const res = await fetch(api.User.AdminGetAll, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user.token]);

  // Add User
  const addUser = async (newUser) => {
    if (!user.token) return;
    try {
      const res = await fetch(api.User.AdminCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Filter
  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term))
    );
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen space-y-8 pb-20 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Management</h1>
        <p className="text-gray-500">Manage your admins, team heads, and agents.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Users" count={users.length} icon={UsersIcon} color="indigo" />
        <StatsCard title="Subadmins" count={users.filter((u) => u.role === "subadmin").length} icon={Shield} color="emerald" />
        <StatsCard title="Team Heads" count={users.filter((u) => u.role === "teamhead").length} icon={Briefcase} color="amber" />
        <StatsCard title="Agents" count={users.filter((u) => u.role === "agent").length} icon={Headphones} color="rose" />
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky top-4 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent rounded-xl text-gray-900 placeholder-gray-500 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow hover:shadow-lg transition-all active:scale-95 w-full md:w-auto"
        >
          <UserPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* User Grid */}
      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 animate-pulse">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Loading team data...</p>
          </div>

        ) : filteredUsers.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 overflow-hidden">
            {filteredUsers.map((user) => (
              <div key={user._id || user.id} className="h-full">
                <UserCard user={user} fixOverflow={true} />
              </div>
            ))}
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-semibold text-lg">No members found</h3>
            <p className="text-gray-500 text-sm mt-1">We couldn't find anyone matching "{search}"</p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-indigo-600 font-medium hover:underline text-sm"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <AddUserModal onClose={() => setShowModal(false)} addUser={addUser} />}
    </div>
  );
};

export default UsersPage;
