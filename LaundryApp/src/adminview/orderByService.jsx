import React from "react";
import { useStore } from "../store/zustand";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../adminviewcss/orderByService.css"; // Import your CSS file for styling

const OrderByService = () => {
  const allOrders = useStore((state) => state.allOrders);
  const users = useStore((state) => state.users);
  const loadAllOrders = useStore((state) => state.loadAllOrders);
  const loadUsers = useStore((state) => state.loadUsers);
  const selectedOrder = useStore((state) => state.selectedOrder); // Zustand store to get the selected order
  const setSelectedOrder = useStore((state) => state.setSelectedOrder); // Zustand store to set the selected order
  const selectedCustomer = useStore((state) => state.selectedCustomer); // Zustand store to get the selected customer
  const setSelectedCustomer = useStore((state) => state.setSelectedCustomer); // Zustand store to set the selected customer
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState("all"); // State for selected service type
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const services = useStore((state) => state.services); // Zustand store to get the selected service type
  const loadServices = useStore((state) => state.loadServices); // Zustand store to load services

  const [serviceTypeMapping, setServiceTypeMapping] = useState({
    all: "All Services", // Default key-value pair
  });

  useEffect(() => {
    loadServices(); // Load services when the component mounts
     // Log the loaded services for debugging
  }, [loadServices]);


  useEffect(() => {
    // Dynamically create the serviceTypeMapping based on the services array
    
    if (Array.isArray(services)) {
      
      const mapping = services.reduce(
        (acc, service) => ({
          ...acc,
          [service.title]: service.name,
        }),
        { all: "All Services" } // Include the default key-value pair
      );
      console.log("Service Type Mapping:", mapping);
      setServiceTypeMapping(mapping);
       // Log the mapping for debugging
    } else {
      console.warn("Services is not an array or is undefined:", services);
    }
  }, [services]);

 


  // // Define a mapping for service types to display names
  // const serviceTypeMapping = {
  //   wash_iron: "Wash & Iron",
  //   iron: "Ironing ",
  //   dry_clean: "Dry Cleaning ",
  //   duvet_cleaning: "Duvet Cleaning",
  //   // "Wash & Iron": "Wash & Iron",
  //   all: "All Services",
  //   // Add more mappings as needed
  // };

  useEffect(() => {
    loadAllOrders();
    loadUsers();
  }, [loadAllOrders, loadUsers]);

  const orders = allOrders.map((order) => {
    const user = users.find((user) => user._id === order.customerID); // Match user by customerID

    return {
      ...order,
      orderedBy: user ? user.name : "Unknown User", // Add the user's name or fallback to "Unknown User"
      serviceName: serviceTypeMapping[order.serviceType] || "Unknown Service", // Map serviceType to a display name
      customer:  user , // Add the customer object to the order
    };
  });
  

  // Filter orders based on selected service type
  const filteredOrdersByService =
    selectedService === "all"
      ? orders
      : orders.filter((order) => order.serviceType === selectedService);

  // Further filter orders based on search query
  const filteredOrders = filteredOrdersByService.filter(
    (order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by orderID
      order.orderedBy.toLowerCase().includes(searchQuery.toLowerCase()) // Search by orderedBy
  );

  const handleDetails = (order) => {
    setSelectedOrder(order); // Set the selected order in Zustand
    console.log("Selected order:", order); // Log the selected order for debugging
    setSelectedCustomer(order.customer);
    console.log("Selected order:", order); // Log the selected order for debugging
    console.log("Selected customer:", order.customer); // Log the selected customer for debugging
    navigate("/admin-dashboard/order-details"); // Navigate to the OrderDetailsPage
  };

  useEffect(() => {
    console.log("Selected order:", selectedOrder); // Log the selected order for debugging
    console.log("Selected customer:", selectedCustomer);
  }, [selectedOrder, selectedCustomer]);

  const handleUpdateState = async (orderId) => {
    const { success, message } = await useStore.getState().updateState(orderId);

    if (success) {
      alert(message); // Show success message
    } else {
      alert(message); // Show error message
    }
  };

  return (
    <div className="order-by-service-container">
      <div className="filterandsearch">
        <div className="search-bar">
          <label htmlFor="searchQuery">Search: </label>
          <input
            type="text"
            id="searchQuery"
            placeholder=" Order ID or Ordered By"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-bar">
          <label htmlFor="serviceFilter">Filter by: </label>
          <select
            id="serviceFilter"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="all">All Services</option>
            {Object.entries(serviceTypeMapping)
              .filter(([key]) => key !== "all") // Exclude "all" from the dropdown
              .map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Ordered By</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{"ORD-" + order._id.slice(0, 6).toUpperCase()}</td>
                <td>{order.orderedBy}</td>
                <td>{order.serviceName}</td>
                <td>{order.status}</td>
                <td>
                  <div className="mybuttons">
                    <div className="service-details-button">
                      <button onClick={() => handleDetails(order)}>
                        Details
                      </button>
                    </div>
                    <div className="update-button">
                      <button onClick={() => handleUpdateState(order._id)}>
                        Proceed
                      </button>
                    </div>
                    {/* <div className="delete-button">
                      <button>Delete</button>
                    </div> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-orders-message">
          No orders available for the selected service type.
        </p>
      )}
    </div>
  );
};

export default OrderByService;
