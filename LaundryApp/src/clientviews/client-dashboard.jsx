import React, { useEffect } from "react";
import Navbar from "./navbar";
import { useStore } from "../store/zustand";

import { Outlet } from "react-router-dom";

const ClientDashboard = () => {
  const clientInfo = useStore((state) => state.clientInfo);
  const initializeClientInfo = useStore((state) => state.initializeClientInfo);

  useEffect(() => {
    initializeClientInfo(); // Restore clientInfo from localStorage
  }, [initializeClientInfo]);

  if (!clientInfo) {
    return <p>Loading...</p>; // Show a loading message while restoring state
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <div className="bg-blue-500 text-white">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
export default ClientDashboard;
