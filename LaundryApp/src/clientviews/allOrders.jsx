// import React, { useEffect, useState } from "react";
// import Navbar from "./navbar";
// import { useStore } from "../store/zustand";

// const AllOrders = () => {
//   const orders = useStore((state) => state.clientOrders);
//   const clientInfo = useStore((state) => state.clientInfo);
//   const loadOrders = useStore((state) => state.loadOrders);
//   const initializeClientInfo = useStore((state) => state.initializeClientInfo);
//   const [isLoading, setIsLoading] = useState(true); // Track loading state

//   console.log("Orders", orders);
//   console.log("Client Info:", clientInfo); // Log the client info

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!clientInfo?.id) {
//         await initializeClientInfo(); // Initialize client info if not already done
//       }

//       if (clientInfo?.id) {
//         console.log("Loading orders for client ID:", clientInfo.id);
//         await loadOrders(clientInfo.id); // Load orders for the client
//       }

//       setIsLoading(false); // Set loading to false after fetching orders
//     };

//     fetchOrders();
//   }, [clientInfo, initializeClientInfo, loadOrders]);

//   if (isLoading) {
//     return <p>Loading...</p>; // Show a loading message while fetching orders
//   }

//   const formatDate = (isoDate) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Intl.DateTimeFormat("en-US", options).format(new Date(isoDate));
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="current-orders-container">
//         <h2>Current Orders</h2>

//         {orders?.length > 0 ? (
//           <ul className="orders-list">
//             {orders.map((order) => {
//               const {
//                 _id,
//                 garments,
//                 serviceType,
//                 totalCost,
//                 pickupDate,
//                 pickupTime,
//                 dropoffDate,
//                 dropoffTime,
//                 status,
//               } = order;

//               return (
//                 <li key={_id} className="order-item">
//                   <h3>Order ID: {_id}</h3>
//                   <p>
//                     <strong>Service:</strong> {serviceType}
//                   </p>
//                   {/* Ensure garment exists before mapping */}
//                   {garments && Object.keys(garments).length > 0 ? (
//                     <>
//                       <p>
//                         <strong>Garments:</strong>
//                       </p>
//                       <ul>
//                         {Object.entries(garments).map(
//                           ([garmentType, quantity]) => (
//                             <li key={garmentType}>
//                               {garmentType}: {quantity}
//                             </li>
//                           )
//                         )}
//                       </ul>
//                     </>
//                   ) : (
//                     <p>
//                       <strong>Garments:</strong> No garments specified
//                     </p>
//                   )}
//                   <p>
//                     <strong>Total Cost:</strong> ${totalCost}
//                   </p>
//                   <p>
//                     <strong>Pickup:</strong> {formatDate(pickupDate)} at{" "}
//                     {pickupTime}
//                   </p>
//                   <p>
//                     <strong>Drop-off:</strong> {formatDate(dropoffDate)} at{" "}
//                     {dropoffTime}
//                   </p>
//                   <p>
//                     <strong>Status:</strong>{" "}
//                     <span
//                       className={`status ${status.toLowerCase()} || "unknown" `}
//                     >
//                       {status}
//                     </span>
//                   </p>
//                 </li>
//               );
//             })}
//           </ul>
//         ) : (
//           <p className="no-orders">No active orders</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllOrders;

import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

const AllOrders = () => {
  const orders = useStore((state) => state.clientOrders); // Get all client orders from Zustand
  const loadOrders = useStore((state) => state.loadOrders); // Load orders function
  const clientInfo = useStore((state) => state.clientInfo); // Get client info
  const setSelectedOrder = useStore((state) => state.setSelectedOrder); // Set selected order function
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const initializeClientInfo = useStore((state) => state.initializeClientInfo); // Function to initialize client info

  useEffect(() => {
      initializeClientInfo(); // Restore clientInfo from localStorage
    }, [initializeClientInfo]);


  useEffect(() => {
    
    if (clientInfo?.id) {
      loadOrders(clientInfo.id); // Load all orders for the logged-in client
    }
  }, [clientInfo, loadOrders]);

  const handleDetails = (order) => {
    setSelectedOrder(order); // Set the selected order to view details
    navigate("/client-dashboard/order-details"); // Navigate to the order details page
  };

 
  const filteredOrders = orders
    ?.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest to oldest

  return (
    <div className="all-orders-container p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID or Status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredOrders?.length > 0 ? (
        <ul className="orders-list space-y-4">
          {filteredOrders.map((order) => {
            const { _id, status } = order;

            return (
              <li
                key={_id}
                className="order-item flex justify-between items-center border p-4 rounded shadow"
              >
                {/* Left Side: Order ID and Status */}
                <div>
                  <h3 className="font-bold text-lg">
                    {"ORD-" + order._id.slice(0, 6).toUpperCase()}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Status:</strong> {status}
                  </p>
                </div>

                {/* Right Side: Details Button */}
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  onClick={() => handleDetails(order)}
                >
                  Details
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-orders text-gray-600">No orders found</p>
      )}
    </div>
  );
};

export default AllOrders;
