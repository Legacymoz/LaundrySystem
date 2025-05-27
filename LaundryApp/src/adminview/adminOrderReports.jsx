// import React, { useEffect, useState } from "react";
// import { useStore } from "../store/zustand";
// import { useNavigate } from "react-router-dom";

// const AdminOrderReports = () => {
//   const allOrders = useStore((state) => state.allOrders); // Zustand store to get all orders
//   const users = useStore((state) => state.users); // Zustand store to get all users
//   const loadAllOrders = useStore((state) => state.loadAllOrders); // Zustand action to load all orders
//   const loadUsers = useStore((state) => state.loadUsers); // Zustand action to load all users
//   const setSelectedOrder = useStore((state) => state.setSelectedOrder); // Zustand action to set selected order

//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]); // Store the processed orders
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all"); // all, today, week, month

//   useEffect(() => {
//     // Load all orders and users when the component mounts
//     loadAllOrders();
//     loadUsers();
//   }, [loadAllOrders, loadUsers]);

//   useEffect(() => {
//     // Process orders to include "orderedBy" field
//     const processedOrders = allOrders.map((order) => {
//       const user = users.find((user) => user._id === order.customerID); // Match user by customerID
//       return {
//         ...order,
//         orderedBy: user ? user.name : "Unknown User", // Add the user's name or fallback to "Unknown User"
//         customer: user || null, // Add the customer object to the order
//       };
//     });
//     setOrders(processedOrders); // Update the orders state
//   }, [allOrders, users]);

//   useEffect(() => {
//     filterOrders(); // Filter orders whenever orders, searchTerm, or filter changes
//   }, [orders, searchTerm, filter]);

//   const filterOrders = () => {
//     let filtered = [...orders];

//     // Filter by date
//     const now = new Date();
//     if (filter === "today") {
//       filtered = filtered.filter((order) => {
//         const orderDate = new Date(order.createdAt);
//         return orderDate.toDateString() === now.toDateString(); // Same day
//       });
//     } else if (filter === "week") {
//       const startOfWeek = new Date();
//       startOfWeek.setDate(now.getDate() - now.getDay());
//       filtered = filtered.filter((order) => {
//         const orderDate = new Date(order.createdAt);
//         return orderDate >= startOfWeek && orderDate <= now;
//       });
//     } else if (filter === "month") {
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       filtered = filtered.filter((order) => {
//         const orderDate = new Date(order.createdAt);
//         return orderDate >= startOfMonth && orderDate <= now;
//       });
//     }

//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (order) =>
//           order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (order.orderedBy &&
//             order.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     // Sort by newest to oldest
//     filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     setFilteredOrders(filtered);
//   };

//   const handleDetails = (order) => {
//     setSelectedOrder(order); // Set the selected order to view details
//     navigate("/admin-dashboard/order-details"); // Navigate to the order details page
//   };

//   return (
//     <div className="admin-order-report">
//       <h2 className="report-heading">Admin Order Reports</h2>

//       {/* Search and Filter */}
//       <div className="filter-container">
//         <input
//           type="text"
//           placeholder="Search by Order ID, Service Type, or Ordered By"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-bar"
//         />
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="filter-dropdown"
//         >
//           <option value="all">All Orders</option>
//           <option value="today">Today</option>
//           <option value="week">This Week</option>
//           <option value="month">This Month</option>
//         </select>
//       </div>

//       {/* Orders Table */}
//       <table className="orders-table">
//         <thead>
//           <tr>
//             <th>Order ID</th>
//             <th>Service Type</th>
//             <th>Total Cost</th>
//             <th>Ordered By</th>
//             <th>Created At</th>
//             <th>Details</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredOrders.length > 0 ? (
//             filteredOrders.map((order) => (
//               <tr key={order._id}>
//                 <td>{"ORD-" + order._id.slice(0, 6).toUpperCase()}</td>
//                 <td>{order.serviceType}</td>
//                 <td>Ksh {order.totalCost}</td>
//                 <td>{order.orderedBy}</td>
//                 <td>{new Date(order.createdAt).toLocaleString()}</td>
//                 <td>
//                   <button
//                     className="details-button"
//                     onClick={() => handleDetails(order)}
//                   >
//                     Details
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="no-orders">
//                 No orders found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminOrderReports;



import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import { useNavigate } from "react-router-dom";

const AdminOrderReports = () => {
  const allOrders = useStore((state) => state.allOrders); // Zustand store to get all orders
  const users = useStore((state) => state.users); // Zustand store to get all users
  const loadAllOrders = useStore((state) => state.loadAllOrders); // Zustand action to load all orders
  const loadUsers = useStore((state) => state.loadUsers); // Zustand action to load all users
  const setSelectedOrder = useStore((state) => state.setSelectedOrder); // Zustand action to set selected order

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]); // Store the processed orders
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, today, week, month
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const ordersPerPage = 10; // Number of orders per page
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); 

  useEffect(() => {
    // Load all orders and users when the component mounts
    loadAllOrders();
    loadUsers();
  }, [loadAllOrders, loadUsers]);

  useEffect(() => {
    // Process orders to include "orderedBy" field
    const processedOrders = allOrders.map((order) => {
      const user = users.find((user) => user._id === order.customerID); // Match user by customerID
      return {
        ...order,
        orderedBy: user ? user.name : "Unknown User", // Add the user's name or fallback to "Unknown User"
        customer: user || null, // Add the customer object to the order
      };
    });
    setOrders(processedOrders); // Update the orders state
  }, [allOrders, users]);

  useEffect(() => {
    filterOrders(); // Filter orders whenever orders, searchTerm, or filter changes
  }, [orders, searchTerm, filter, startDate, endDate]);

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by exact date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }

    console.log("Filtered Orders:", filtered);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.orderedBy &&
            order.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort by newest to oldest
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredOrders(filtered);
  };

  const handleDetails = (order) => {
    setSelectedOrder(order); // Set the selected order to view details
    navigate("/admin-dashboard/order-details"); // Navigate to the order details page
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
 

  return (
    <div className="admin-order-report">
      <h2 className="text-2xl font-bold text-center mb-4">
        Admin Order Reports
      </h2>

      {/* Search and Filter */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Order ID, Service Type, or Ordered By"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2  max-w-1/2"
        />
        <div className="flex gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              Start Date:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">End Date:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </label>
        </div>
      </div>

      {/* Orders Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className>
            <th className="border border-gray-300 px-4 py-2">Order ID</th>
            <th className="border border-gray-300 px-4 py-2">Service Type</th>
            <th className="border border-gray-300 px-4 py-2">Total Cost</th>
            <th className="border border-gray-300 px-4 py-2">Ordered By</th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
            <th className="border border-gray-300 px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {"ORD-" + order._id.slice(0, 6).toUpperCase()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.serviceType}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Ksh {order.totalCost}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.orderedBy}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleDetails(order)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Total Orders and Amount Section */}
      <div className="flex justify-end mt-4 max-w-1/3">
        <table className="border border-gray-300 bg-gray-50 rounded-lg">
          <tbody>
            <tr>
              <td className="px-4 py-2 font-semibold text-gray-700 border border-gray-300">
                Total Orders:
              </td>
              <td className="px-4 py-2 text-right font-bold text-gray-900 border border-gray-300">
                {filteredOrders.length}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold text-gray-700 border border-gray-300">
                Total Amount:
              </td>
              <td className="px-4 py-2 text-right font-bold text-gray-900 border border-gray-300">
                Ksh{" "}
                {filteredOrders
                  .reduce((total, order) => total + order.totalCost, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          &lt;
        </button>
        <span className="text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default AdminOrderReports;