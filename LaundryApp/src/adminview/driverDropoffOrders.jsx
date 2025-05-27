import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import "../adminviewcss/driverDropoffOrders.css"; // Import CSS for styling

const DriverDropoffOrders = () => {
  const selectedDriver = useStore((state) => state.selectedDriver); // Zustand store for selected driver
  const allOrders = useStore((state) => state.allOrders); // Zustand store for all orders
    const loadAllOrders = useStore((state) => state.loadAllOrders); // Zustand action to load all orders
  const users = useStore((state) => state.users); // Zustand store for all users
  const loadUsers = useStore((state) => state.loadUsers); // Zustand action to load users

  const [dropoffOrders, setDropoffOrders] = useState([]);

  useEffect(() => {
    // Load orders and users when the component mounts
    loadAllOrders();
    loadUsers();
  }, [loadAllOrders, loadUsers]);

  useEffect(() => {
    console.log("Selected Driver:", selectedDriver);
    if (selectedDriver && selectedDriver.dropoffOrders.length > 0) {
      // Filter orders that match the IDs in selectedDriver.dropoffOrders
      const driverOrders = allOrders.filter((order) =>
        selectedDriver.dropoffOrders.includes(order._id)
      );

      // Enrich orders with customer details
      const enrichedOrders = driverOrders.map((order) => {
        const customer = users.find((user) => user._id === order.customerID);
        console.log("Customer:", customer);
        return {
          ...order,
          customerName: customer ? customer.name : "Unknown",
          customerPhone: customer ? customer.number : "Unknown",
        };
      });

      setDropoffOrders(enrichedOrders);
    }
  }, [selectedDriver, allOrders, users]);

  return (
    <div className="dropoff-orders-container">
      <h2 className="dropoff-orders-title">Driver's Dropoff Orders</h2>
      {dropoffOrders.length > 0 ? (
        <table className="dropoff-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Dropoff Date</th>
              <th>Dropoff Time</th>
              <th>Dropoff Location</th>
              <th>Customer Name</th>
              <th>Customer Phone</th>
            </tr>
          </thead>
          <tbody>
            {dropoffOrders.map((order) => (
              <tr key={order._id}>
                <td>{`ORD-${order._id.slice(0, 6).toUpperCase()}`}</td>
                <td>{new Date(order.dropoffDate).toLocaleDateString()}</td>
                <td>{order.dropoffTime}</td>
                <td>{order.dropoffAddress}</td>
                <td>{order.customerName}</td>
                <td>{order.customerPhone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="dropoff-orders-empty">No dropoff orders found for this driver.</p>
      )}
    </div>
  );
};

export default DriverDropoffOrders;