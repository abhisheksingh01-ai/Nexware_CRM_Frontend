import React from "react";

export default function AdminDashboard() {
  console.log("AdminDashboard loaded");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Users Card */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-3">124</p>
        </div>

        {/* Products Card */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="text-3xl font-bold mt-3">48</p>
        </div>

        {/* Reports Card */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold">Reports</h2>
          <p className="text-3xl font-bold mt-3">19</p>
        </div>

      </div>
    </div>
  );
}
