import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import { useNavigate } from "react-router-dom";
import "../adminviewcss/inProgressOrders.css"; // Import your CSS file for styling

const InProgressOrders = () => {
  const allOrders = useStore((state) => state.allOrders);
  const users = useStore((state) => state.users);
  const loadAllOrders = useStore((state) => state.loadAllOrders);
  const loadUsers = useStore((state) => state.loadUsers);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedState, setSelectedState] = useState("all"); // State for filtering by service type
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

   const selectedOrder = useStore((state) => state.selectedOrder); // Zustand store to get the selected order
    const setSelectedOrder = useStore((state) => state.setSelectedOrder); // Zustand store to set the selected order
    const selectedCustomer = useStore((state) => state.selectedCustomer); // Zustand store to get the selected customer
    const setSelectedCustomer = useStore((state) => state.setSelectedCustomer); // Zustand store to set the selected customer
    const navigate = useNavigate();

  useEffect(() => {
    // Load orders and users when the component mounts
    loadAllOrders();
    loadUsers();
  }, [loadAllOrders, loadUsers]);

  useEffect(() => {
    // Enrich orders with user information
    const enrichedOrders = allOrders.map((order) => {
      const user = users.find((user) => user._id === order.customerID); // Match user by customerID
      return {
        ...order,
        orderedBy: user ? user.name : "Unknown User", // Add the user's name or fallback to "Unknown User"
        customer: { user },
      };
    });

    // Filter out orders in the states: pending, scheduled, ready, and completed
    const nonFinalStates = ["new", "scheduled", "ready", "completed", "delivery"];
    const filteredByState = enrichedOrders.filter(
      (order) => !nonFinalStates.includes(order.status)
    );

    // Further filter orders based on the selected service type
    const filteredByService =
      selectedState === "all"
        ? filteredByState
        : filteredByState.filter((order) => order.status === selectedState);

    // Further filter orders based on the search query
    const filteredBySearch = filteredByService.filter(
      (order) =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by Order ID
        order.orderedBy.toLowerCase().includes(searchQuery.toLowerCase()) // Search by Ordered By
    );

    setFilteredOrders(filteredBySearch);
  }, [allOrders, users, selectedState, searchQuery]);

  const handleUpdateState = async (orderId) => {
      const { success, message } = await useStore.getState().updateState(orderId);
  
      if (success) {
        alert(message); // Show success message
      } else {
        alert(message); // Show error message
      }
    };
  
    const handleDetails = (order) => {
      setSelectedOrder(order); // Set the selected order in Zustand
      setSelectedCustomer(order.customer);
      console.log("Selected order:", order); // Log the selected order for debugging
      console.log("Selected customer:", order.customer); // Log the selected customer for debugging
      navigate("/admin-dashboard/order-details"); // Navigate to the OrderDetailsPage
    };

  return (
    <div className="in-progress-orders-container">
      <h2>In-Progress Orders</h2>

      <div className="filterandsearch">
        {/* Search Bar */}
        <div className="search-bar">
          <label htmlFor="searchQuery">Search Orders: </label>
          <input
            type="text"
            id="searchQuery"
            placeholder="Search by Order ID or Ordered By"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <label htmlFor="stateFilter">Filter: </label>
          <select
            id="stateFilter"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="all">All</option>
            <option value="washing">Washing</option>
            <option value="ironing">Ironing</option>
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Ordered By</th>
              <th>Status</th>
              <th>Pickup Date</th>
              <th>Time</th>
              <th>Location</th>
              
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{"ORD-" + order._id.slice(0, 6).toUpperCase()}</td>
                <td>{order.orderedBy}</td>
                <td>{order.status}</td>
                <td>{new Date(order.pickupDate).toLocaleDateString()}</td>
                <td>{order.pickupTime}</td>
                <td>{order.pickupAddress || "N/A"}</td>
                
                <td>
                  <div className="my-buttons">
                    <div className="view-button">
                      <button onClick={() => handleDetails(order)}>View</button>
                    </div>
                    <div className="proceed-button">
                      <button onClick={() => handleUpdateState(order._id)}>Proceed</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No  orders available.</p>
      )}
    </div>
  );
};

export default InProgressOrders;