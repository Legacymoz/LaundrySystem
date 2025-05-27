import React, { useEffect } from "react";
import { useStore } from "../store/zustand";
import "../adminviewcss/driverList.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
const DriverList = () => {
  const drivers = useStore((state) => state.drivers); // Zustand store for drivers
  const loadDrivers = useStore((state) => state.loadDrivers); // Zustand action to load drivers
  const setSelectedDriver = useStore((state) => state.setSelectedDriver); // Zustand action to set selected driver
  const selectedDriver = useStore((state) => state.selectedDriver); // Zustand store for selected driver
const navigate = useNavigate(); // Hook for navigation
  useEffect(() => {
    // Load drivers when the component mounts
    loadDrivers();
  }, [loadDrivers]);
  const handleAddDriver = () => {
    navigate("add-driver"); // Navigate to the add driver page

  }

  const handleOrders = (driver) => {
        setSelectedDriver(driver); // Set the selected driver in Zustand store
       navigate("driver-orders"); // Navigate to the driver orders page


  }
  const handleProfile = (driver) => {
    setSelectedDriver(driver); // Set the selected driver in Zustand store
    navigate("driver-profile"); // Navigate to the driver profile page

  }

  return (
    <div className="driver-list-container">
      <h2 className="driver-list-title">Driver List</h2>
      <div className="driver-list-actions">
        <button className="driver-list-add-button" onClick={handleAddDriver}>
          Add New Driver
        </button>
      </div>
      {drivers.length > 0 ? (
        <table className="driver-list-table">
          <thead>
            <tr>
              <th className="driver-list-header">Driver Name</th>
              <th className="driver-list-header">Vehicle Details</th>
              <th className="driver-list-header">Pickup Orders</th>
              <th className="driver-list-header">Dropoff Orders</th>
              <th className="driver-list-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id} className="driver-list-row">
                <td className="driver-list-cell">{driver.name}</td>
                <td className="driver-list-cell">{driver.vehicleDetails}</td>
                <td className="driver-list-cell">{driver.pickupOrders.length}</td>
                <td className="driver-list-cell">{driver.dropoffOrders.length}</td>
                <td className="driver-list-cell driver-list-actions-cell">
                  <button
                    className="driver-list-orders-button"
                    onClick={() => handleOrders(driver)}
                  >
                    Orders
                  </button>
                  <button
                    className="driver-list-profile-button"
                    onClick={() => handleProfile(driver)}
                  >
                    Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="driver-list-empty">No drivers found.</p>
      )}
    </div>
  );

 
};

export default DriverList;