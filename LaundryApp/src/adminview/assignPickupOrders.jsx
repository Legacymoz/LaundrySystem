import React, { useState, useEffect } from "react";
import { useStore } from "../store/zustand"; // Assuming Zustand is used
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignPickupOrders = ({ orderId, onClose }) => {
  const [selectedDriver, setSelectedDriver] = useState("");
  const drivers = useStore((state) => state.drivers);
  const loadDrivers = useStore((state) => state.loadDrivers);
  const assignOrdersToDriver = useStore((state) => state.assignOrdersToDriver);
  const assignDriverToOrder = useStore((state) => state.assignDriverToOrder);

  useEffect(() => {
    loadDrivers(); // Fetch all drivers when the component mounts
  }, [loadDrivers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDriver) {
      toast.error("Please select a driver.");
      return;
    }

    try {
      // Assign the orderId to the driver's pickupOrders array
      await assignOrdersToDriver(selectedDriver, { pickupOrders: [orderId] });

      // Assign the driverId to the order's driver field
      await assignDriverToOrder(orderId, selectedDriver);

      toast.success("Pickup order and driver assigned successfully!");
      onClose(); // Close the modal after successful assignment
    } catch (error) {
      toast.error("An error occurred while assigning the driver.");
    }
  };

  return (
    <div className="assign-orders-container">
      <ToastContainer />

      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        &times;
      </button>
      
      <h2 className="text-2xl font-bold text-center mb-6">
        Assign Pickup Order
      </h2>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-6">
        <div>
          <label htmlFor="driver" className="block font-medium mb-1">
            Select Driver
          </label>
          <select
            id="driver"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select a Driver --</option>
            {drivers
              .filter((driver) => driver.isActive) // Only show active drivers
              .map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.name}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Assign Driver
        </button>
      </form>
    </div>
  );
};

export default AssignPickupOrders;