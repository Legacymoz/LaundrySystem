import React from "react";
import { useNavigate } from "react-router-dom";
import DriverPickupOrders from "./driverPickupOrders"; // Import the DriverPickupOrders component
import DriverDropoffOrders from "./driverDropoffOrders"; // Import the DriverDropoffOrders component

const DriverOrders = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-4"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">Driver's Orders</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Pickup Orders</h3>
        <div className="bg-white shadow-md rounded-lg p-4">
          <DriverPickupOrders /> {/* Render the DriverPickupOrders component */}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Dropoff Orders</h3>
        <div className="bg-white shadow-md rounded-lg p-4">
          <DriverDropoffOrders /> {/* Render the DriverDropoffOrders component */}
        </div>
      </div>
    </div>
  );
};

export default DriverOrders;