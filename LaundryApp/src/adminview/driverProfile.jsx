import React from "react";
import { useStore } from "../store/zustand"; // Zustand store for state management
import { useNavigate } from "react-router-dom"; // For navigation
import { toast } from "react-toastify";

const DriverProfilePage = () => {
  const selectedDriver = useStore((state) => state.selectedDriver); // Zustand store to get selected driver details
  const deleteDriver = useStore((state) => state.deleteDriver); // Zustand action to delete a driver
  const navigate = useNavigate();

  if (!selectedDriver) {
    return <p>Loading driver profile...</p>;
  }

  const handleBackToDashboard = () => {
    navigate("/admin-dashboard"); // Navigate back to the Admin Dashboard
  };

  const handleDeleteDriver = async () => {
    try {
      await deleteDriver(selectedDriver._id); // Call Zustand action to delete the driver
      toast.success("Driver deleted successfully!");
      navigate(-1);
    } catch (error) {
      toast.error("An error occurred while deleting the driver.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Driver Profile</h1>

      {/* Profile Picture Section */}
      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600">Placeholder</span>
        </div>
      </div>

      {/* Driver Details Table */}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Name</td>
            <td className="border border-gray-300 px-4 py-2">{selectedDriver.name}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Email</td>
            <td className="border border-gray-300 px-4 py-2">{selectedDriver.email}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Phone</td>
            <td className="border border-gray-300 px-4 py-2">{selectedDriver.phone}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">License Number</td>
            <td className="border border-gray-300 px-4 py-2">{selectedDriver.licenseNumber}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Vehicle Details</td>
            <td className="border border-gray-300 px-4 py-2">{selectedDriver.vehicleDetails}</td>
          </tr>
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleBackToDashboard}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
        <button
          onClick={handleDeleteDriver}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Driver
        </button>
      </div>
    </div>
  );
};

export default DriverProfilePage;