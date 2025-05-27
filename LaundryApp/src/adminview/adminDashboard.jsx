import React from "react";
import LeftNavBar from "./adminNavbar.jsx"; // Import the LeftNavBar component
import { Outlet } from "react-router-dom"; // For nested routing if needed

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Left Navigation Bar */}
      <LeftNavBar />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        
        {/* Content will go here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;