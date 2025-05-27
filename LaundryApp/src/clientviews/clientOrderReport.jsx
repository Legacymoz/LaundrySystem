// import React, { useEffect, useState } from "react";
// import { useStore } from "../store/zustand";
// import "../clientviewcss/clientOrderReport.css";
// import { useNavigate } from "react-router-dom"; // Import Navigate for redirection

// const ClientOrderReport = () => {
//   const clientInfo = useStore((state) => state.clientInfo);
//   const clientOrders = useStore((state) => state.clientOrders);
//   const loadOrders = useStore((state) => state.loadOrders);
//   const setSelectedOrder = useStore((state) => state.setSelectedOrder);

//   const navigate = useNavigate();
  
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all"); // all, today, week, month

//   useEffect(() => {
//     if (clientInfo?.id) {
//       loadOrders(clientInfo.id);
//     }
//   }, [clientInfo, loadOrders]);

//   useEffect(() => {
//     filterOrders();
//   }, [clientOrders, searchTerm, filter]);

//   const filterOrders = () => {
//     let orders = [...clientOrders];

//     // Filter by date
//     const now = new Date();
//     if (filter === "today") {
//       orders = orders.filter((order) => {
//         const orderDate = new Date(order.createdAt);
//         return (
//           orderDate.toDateString() === now.toDateString() // Same day
//         );
//       });
//     } else if (filter === "week") {
//       const startOfWeek = new Date();
//       startOfWeek.setDate(now.getDate() - now.getDay());
//       orders = orders.filter((order) => {
//         const orderDate = new Date(order.createdAt);
//         return orderDate >= startOfWeek && orderDate <= now;
//       });
//     } else if (filter === "month") {
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       orders = orders.filter((order) => {
//         const orderDate = new Date(order.createdAt);
//         return orderDate >= startOfMonth && orderDate <= now;
//       });
//     }

//     // Filter by search term
//     if (searchTerm) {
//       orders = orders.filter(
//         (order) =>
//           order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Sort by newest to oldest
//     orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     setFilteredOrders(orders);
//   };

//   const handleDetails = (order) => {
//     setSelectedOrder(order); // Set the selected order to view details
//     navigate("/client-dashboard/order-details"); // Navigate to the order details page
//   };

//   return (
//     <div className="client-order-report">
//       <h2 className="report-heading">Client Order Report</h2>

//       {/* Search and Filter */}
//       <div className="filter-container">
//         <input
//           type="text"
//           placeholder="Search by Order ID or Service Type"
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
//               <td colSpan="5" className="no-orders">
//                 No orders found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ClientOrderReport;

import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import "../clientviewcss/clientOrderReport.css";
import { useNavigate } from "react-router-dom";

const ClientOrderReport = () => {
  const clientInfo = useStore((state) => state.clientInfo);
  const clientOrders = useStore((state) => state.clientOrders);
  const loadOrders = useStore((state) => state.loadOrders);
  const setSelectedOrder = useStore((state) => state.setSelectedOrder);

  const navigate = useNavigate();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, today, week, month
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const ordersPerPage = 10; // Number of orders per page
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering

  useEffect(() => {
    if (clientInfo?.id) {
      loadOrders(clientInfo.id);
    }
  }, [clientInfo, loadOrders]);

  useEffect(() => {
    filterOrders();
  }, [clientOrders, searchTerm, filter, startDate, endDate]);

  const filterOrders = () => {
    let orders = [...clientOrders];

    // // Filter by date
    // const now = new Date();
    // if (filter === "today") {
    //   orders = orders.filter((order) => {
    //     const orderDate = new Date(order.createdAt);
    //     return orderDate.toDateString() === now.toDateString(); // Same day
    //   });
    // } else if (filter === "week") {
    //   const startOfWeek = new Date();
    //   startOfWeek.setDate(now.getDate() - now.getDay());
    //   orders = orders.filter((order) => {
    //     const orderDate = new Date(order.createdAt);
    //     return orderDate >= startOfWeek && orderDate <= now;
    //   });
    // } else if (filter === "month") {
    //   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    //   orders = orders.filter((order) => {
    //     const orderDate = new Date(order.createdAt);
    //     return orderDate >= startOfMonth && orderDate <= now;
    //   });
    // }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      orders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Client Orders:", clientOrders);

    // Filter by search term
    if (searchTerm) {
      orders = orders.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      orders = orders.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by newest to oldest
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredOrders(orders);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

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

  const handleDetails = (order) => {
    setSelectedOrder(order); // Set the selected order to view details
    navigate("/client-dashboard/order-details"); // Navigate to the order details page
  };

  return (
    <div className="client-order-report">
      <h2 className="report-heading">Order Report</h2>

      {/* Search and Filter */}
      <div className="filter-container">
        
        <input
          type="text"
          placeholder="Search by Order ID or Service Type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <div className="date-filters">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </label>
        </div>
      </div>

      {/* Orders Table */}
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Service Type</th>
            <th>Total Cost</th>
            <th>Created At</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order._id}>
                <td>{"ORD-" + order._id.slice(0, 6).toUpperCase()}</td>
                <td>{order.serviceType}</td>
                <td>Ksh {order.totalCost}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="details-button"
                    onClick={() => handleDetails(order)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-orders">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

            {/* Total Orders and Cost Section */}
      <div className="totals-container">
        <table className="totals-table">
          <tbody>
            <tr>
              <td className="totals-title">Total Orders:</td>
              <td className="totals-value">{filteredOrders.length}</td>
            </tr>
            <tr>
              <td className="totals-title">Total Cost:</td>
              <td className="totals-value">
                Ksh{" "}
                {filteredOrders.reduce((total, order) => total + order.totalCost, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
        >
          &lt;
        </button>
        <span className="pagination-info">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`pagination-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ClientOrderReport;