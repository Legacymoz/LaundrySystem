import React, { useEffect } from "react";
import { useStore } from "../store/zustand"; // Zustand store for state management
import { useNavigate } from "react-router-dom"; // For navigation

const AdminProfilePage = () => {
  const adminInfo = useStore((state) => state.adminInfo); // Zustand store to get admin details
  const initializeAdminInfo = useStore((state) => state.initializeAdminInfo); // Function to initialize admin info
  const navigate = useNavigate();

  useEffect(() => {
    initializeAdminInfo(); // Initialize admin info when the component mounts
  }, [initializeAdminInfo]);



  if (!adminInfo) {
    
    return <p>Loading admin profile...</p>;
  }

  const handleBackToDashboard = () => {
    navigate("/admin-dashboard"); // Navigate back to the Admin Dashboard
  };

  console.log("Admin Info:", adminInfo); // Log admin info for debugging

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Admin Profile</h1>

      {/* Profile Picture Section */}
      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600">Placeholder</span>
        </div>
      </div>

      {/* Admin Details Table */}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Name
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {adminInfo.name}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Email
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {adminInfo.email}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Number
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {adminInfo.number}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Role
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {adminInfo.roles}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Back to Dashboard Button */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleBackToDashboard}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate("edit-admin-profile")}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default AdminProfilePage;