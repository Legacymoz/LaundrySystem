// import React, { useEffect, useState } from "react";
// import { useStore } from "../store/zustand";
// import { useNavigate } from "react-router-dom";
// import "../adminviewcss/readyOrders.css"; // Import your CSS file for styling

// const ReadyOrders = () => {
//   const allOrders = useStore((state) => state.allOrders);
//   const users = useStore((state) => state.users);
//   const loadAllOrders = useStore((state) => state.loadAllOrders);
//   const loadUsers = useStore((state) => state.loadUsers);

//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState("all"); // State for selected filter
//   const [searchQuery, setSearchQuery] = useState("");

//    const selectedOrder = useStore((state) => state.selectedOrder); // Zustand store to get the selected order
//     const setSelectedOrder = useStore((state) => state.setSelectedOrder); // Zustand store to set the selected order
//     const selectedCustomer = useStore((state) => state.selectedCustomer); // Zustand store to get the selected customer
//     const setSelectedCustomer = useStore((state) => state.setSelectedCustomer); // Zustand store to set the selected customer
//     const navigate = useNavigate();

//   useEffect(() => {
//     // Load orders and users when the component mounts
//     loadAllOrders();
//     loadUsers();
//   }, [loadAllOrders, loadUsers]);

//   useEffect(() => {
//     // Filter orders with states "pending" and "scheduled"
//     const enrichedOrders = allOrders.map((order) => {
//       const user = users.find((user) => user._id === order.customerID); // Match user by customerID
//       return {
//         ...order,
//         orderedBy: user ? user.name : "Unknown User", // Add the user's name or fallback to "Unknown User"
//         customer: { user },
//       };
//     });
//     console.log("Selected Filter:", selectedFilter); // Debugging line

//     //Filter orders based on the selected filter
//     const filteredByStatus = enrichedOrders.filter((order) => {
//       if (selectedFilter === "all")
//         return order.status === "ready" || order.status === "delivered"; // Show all orders
//       return order.status === selectedFilter; // Filter by status
//     });
//     console.log("searchQuery:", searchQuery);
//     // Further filter orders based on the search query
//     const filteredBySearch = filteredByStatus.filter(
//       (order) =>
//         order._id.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by Order ID
//         order.orderedBy.toLowerCase().includes(searchQuery.toLowerCase()) // Search by OrderedBy
//     );

//     setFilteredOrders(filteredBySearch);
//   }, [allOrders, users, selectedFilter, searchQuery]);

//   const handleUpdateState = async (orderId) => {
//         const { success, message } = await useStore.getState().updateState(orderId);

//         if (success) {
//           alert(message); // Show success message
//         } else {
//           alert(message); // Show error message
//         }
//       };

//       const handleDetails = (order) => {
//         setSelectedOrder(order); // Set the selected order in Zustand
//         setSelectedCustomer(order.customer);
//         console.log("Selected order:", order); // Log the selected order for debugging
//         console.log("Selected customer:", order.customer); // Log the selected customer for debugging
//         navigate("/admin-dashboard/order-details"); // Navigate to the OrderDetailsPage
//       };

//   return (
//     <div className="ready-orders-container">
//       <h2>Ready and Completed Orders</h2>

//       <div className="filterandsearch">
//         {/* Search Bar */}
//         <div className="search-bar">
//           <label htmlFor="searchQuery">Search Orders: </label>
//           <input
//             type="text"
//             id="searchQuery"
//             placeholder="Search by Order ID or Ordered By"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         {/* Filter Bar */}
//         <div className="filter-bar">
//           <label htmlFor="statusFilter">Filter by Status: </label>
//           <select
//             id="statusFilter"
//             value={selectedFilter}
//             onChange={(e) => setSelectedFilter(e.target.value)}
//           >
//             <option value="all">All</option>
//             <option value="ready">Ready</option>
//             <option value="delivered">Delivered</option>
//           </select>
//         </div>
//       </div>

//       {filteredOrders.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Ordered By</th>
//               <th>Status</th>
//               <th>Pickup Date</th>
//               <th>Time</th>
//               <th>Location</th>
//               <th>Driver</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order) => (
//               <tr key={order._id}>
//                 <td>{"ORD-" + order._id.slice(0, 6).toUpperCase()}</td>
//                 <td>{order.orderedBy}</td>
//                 <td>{order.status}</td>
//                 {/* Format the pickup date to a more readable format */}
//                 <td>{new Date(order.pickupDate).toLocaleDateString()}</td>
//                 <td>{order.pickupTime}</td>
//                 <td>{order.pickupAddress || "N/A"}</td>
//                 <td>
//                   {order.driver ? (
//                     order.driver
//                   ) : (
//                     <div className="assign-driver-button">
//                       <button>Assign Driver</button>
//                     </div>
//                   )}
//                 </td>
//                 <td>
//                   <div className="my-buttons">
//                     <div className="view-button">
//                       <button onClick={() => handleDetails(order)}>View</button>
//                     </div>
//                     <div className="proceed-button">
//                       <button onClick={() => handleUpdateState(order._id)}>
//                         Proceed
//                       </button>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No  orders available.</p>
//       )}
//     </div>
//   );
// };

// export default ReadyOrders;

import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import "../adminviewcss/readyOrders.css"; // Import your CSS file for styling
import { useNavigate } from "react-router-dom";
import AssignDropoffOrders from "./assignDropoffOrders"; // Import the modal component

const ReadyOrders = () => {
  const allOrders = useStore((state) => state.allOrders);
  const users = useStore((state) => state.users);
  const loadAllOrders = useStore((state) => state.loadAllOrders);
  const loadUsers = useStore((state) => state.loadUsers);

  const selectedOrder = useStore((state) => state.selectedOrder); // Zustand store to get the selected order
  const setSelectedOrder = useStore((state) => state.setSelectedOrder); // Zustand store to set the selected order
  const selectedCustomer = useStore((state) => state.selectedCustomer); // Zustand store to get the selected customer
  const setSelectedCustomer = useStore((state) => state.setSelectedCustomer); // Zustand store to set the selected customer
  const navigate = useNavigate();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all"); // State for selected filter
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [currentOrderId, setCurrentOrderId] = useState(""); // State to store the current order ID

  useEffect(() => {
    // Load orders and users when the component mounts
    loadAllOrders();
    loadUsers();
  }, [loadAllOrders, loadUsers]);

  useEffect(() => {
    // Filter orders with states "ready" and "delivered"
    const enrichedOrders = allOrders.map((order) => {
      const user = users.find((user) => user._id === order.customerID); // Match user by customerID
      return {
        ...order,
        orderedBy: user ? user.name : "Unknown User", // Add the user's name or fallback to "Unknown User"
        customer: { user },
      };
    });

    // Filter orders based on the selected filter
    const filteredByStatus = enrichedOrders.filter((order) => {
      if (selectedFilter === "all")
        return (
          order.status === "ready" ||
          order.status === "delivered" ||
          order.status === "delivery"
        ); // Show all orders
      return order.status === selectedFilter; // Filter by status
    });

    // Further filter orders based on the search query
    const filteredBySearch = filteredByStatus.filter(
      (order) =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by Order ID
        order.orderedBy.toLowerCase().includes(searchQuery.toLowerCase()) // Search by OrderedBy
    );

    setFilteredOrders(filteredBySearch);
  }, [allOrders, users, selectedFilter, searchQuery]);

  const handleDetails = (order) => {
    setSelectedOrder(order); // Set the selected order in Zustand
    setSelectedCustomer(order.customer);
    navigate("/admin-dashboard/order-details"); // Navigate to the OrderDetailsPage
  };

  const handleOpenModal = (orderId) => {
    setCurrentOrderId(orderId); // Set the current order ID
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setCurrentOrderId(""); // Clear the current order ID
  };

  const handleUpdateState = async (orderId) => {
        const { success, message } = await useStore.getState().updateState(orderId);
    
        if (success) {
          alert(message); // Show success message
        } else {
          alert(message); // Show error message
        }
      };

  return (
    <div className="ready-orders-container">
      <h2>Ready and Delivered Orders</h2>
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
          <label htmlFor="statusFilter">Filter by Status: </label>
          <select
            id="statusFilter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
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
              <th>Driver</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{"ORD-" + order._id.slice(0, 6).toUpperCase()}</td>
                <td>{order.orderedBy}</td>
                <td>{order.status}</td>
                {/* Format the pickup date to a more readable format */}
                <td>{new Date(order.pickupDate).toLocaleDateString()}</td>
                <td>{order.pickupTime}</td>
                <td>{order.pickupAddress || "N/A"}</td>
                <td>
                  {order.driver ? (
                    "Assigned"
                  ) : (
                    <div className="assign-driver-button">
                      <button onClick={() => handleOpenModal(order._id)}>
                        Assign Driver
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  <div className="my-buttons">
                    <div className="view-button">
                      <button onClick={() => handleDetails(order)}>View</button>
                    </div>
                    <div className="proceed-button">
                      <button onClick={() => handleUpdateState(order._id)}>
                        Proceed
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No ready or delivered orders available.</p>
      )}

      {/* Modal for AssignDropoffOrders */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AssignDropoffOrders
              orderId={currentOrderId}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyOrders;
