import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import "../adminviewcss/driverPickupOrders.css"; // Import CSS for styling

const DriverPickupOrders = () => {
  const selectedDriver = useStore((state) => state.selectedDriver); // Zustand store for selected driver
  const users = useStore((state) => state.users); // Zustand store for all users
  const loadUsers = useStore((state) => state.loadUsers); // Zustand action to load users
  const allOrders = useStore((state) => state.allOrders); // Zustand store for all orders
  const loadAllOrders = useStore((state) => state.loadAllOrders); // Zustand action to load all orders
  const [pickupOrders, setPickupOrders] = useState([]);

  useEffect(() => {
    // Load orders and users when the component mounts
    loadAllOrders();
    loadUsers();
  }, [loadAllOrders, loadUsers]);

  useEffect(() => {
    if (selectedDriver && selectedDriver.pickupOrders.length > 0) {
      // Filter orders that match the IDs in selectedDriver.pickupOrders
      const driverOrders = allOrders.filter((order) =>
        selectedDriver.pickupOrders.includes(order._id)
      );

      // Enrich orders with customer details
      const enrichedOrders = driverOrders.map((order) => {
        const customer = users.find((user) => user._id === order.customerID);
        return {
          ...order,
          customerName: customer ? customer.name : "Unknown",
          customerPhone: customer ? customer.number : "Unknown",
        };
      });

      setPickupOrders(enrichedOrders);
    }
  }, [selectedDriver, allOrders, users]);

  return (
    <div className="pickup-orders-container">
      <h2 className="pickup-orders-title">Driver's Pickup Orders</h2>
      {pickupOrders.length > 0 ? (
        <table className="pickup-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Pickup Date</th>
              <th>Pickup Time</th>
              <th>Pickup Location</th>
              <th>Customer Name</th>
              <th>Customer Phone</th>
            </tr>
          </thead>
          <tbody>
            {pickupOrders.map((order) => (
              <tr key={order._id}>
                <td>{`ORD-${order._id.slice(0, 6).toUpperCase()}`}</td>
                <td>{new Date(order.pickupDate).toLocaleDateString()}</td>
                <td>{order.pickupTime}</td>
                <td>{order.pickupAddress}</td>
                <td>{order.customerName}</td>
                <td>{order.customerPhone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="pickup-orders-empty">
          No pickup orders found for this driver.
        </p>
      )}
    </div>
  );
};

export default DriverPickupOrders;
