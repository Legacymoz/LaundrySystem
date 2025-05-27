// import React from "react";
// import { useStore } from "../store/zustand";
// import { useEffect,useState } from "react";

// const Overview = () => {
//   const orders = useStore((state) => state.allOrders);
//   const loadAllOrders = useStore((state) => state.loadAllOrders);

//   const [pendingOrders, setPendingOrders] = useState(0);
//   const [progressOrders, setProgressOrders] = useState(0);
//   const [completedOrders, setCompletedOrders] = useState(0);
//   const [deliveryOrders, setDeliveryOrders] = useState(0);

//   useEffect(() => {
//     if (orders.length === 0) {
//       loadAllOrders();
//     }
//   }, [loadAllOrders]);

//   useEffect(() => {
//     // Count orders based on their status
//     setPendingOrders(
//       orders.filter((order) => order.status === "pending").length
//     );
//     setCompletedOrders(
//       orders.filter((order) => order.status === "completed").length
//     );
//     setDeliveryOrders(
//       orders.filter((order) => order.status === "ready").length
//     );
//     setProgressOrders(
//       orders.filter(
//         (order) =>
//           order.status !== "pending" &&
//           order.status !== "scheduled" &&
//           order.status !== "completed" &&
//           order.status !== "ready" &&
//           order.status !== "delivered"
//       ).length
//     );
//   }, [orders]);

// console.log(
//   "In Progress Orders:",
//   orders.filter(
//     (order) =>
//       order.status !== "pending" &&
//       order.status !== "scheduled" &&
//       order.status !== "completed" &&
//       order.status !== "ready" &&
//       order.status !== "delivered"
//   )
// ); // Log the in-progress orders count

//   return (
//     <div className="overview-container">
//       <div className="overview-Title">
//         <h1 className="text-3xl font-bold text-center">Admin Overview</h1>
//       </div>
//       <div className="overview-content">
//         <div className="overview-cards">
//           <div className="ov-card">
//             <h2>Pending Orders</h2>
//             <p>{pendingOrders}</p>
//           </div>
//           <div className="ov-card">
//             <h2>In Progress Orders</h2>
//             <p>{progressOrders}</p>
//           </div>
//           <div className="ov-card">
//             <h2>Completed Orders</h2>
//             <p>{completedOrders}</p>
//           </div>
//           <div className="ov-card">
//             <h2>Ready for Delivery</h2>
//             <p>{deliveryOrders}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Overview;

import React from "react";
import { useStore } from "../store/zustand";
import { useEffect, useState } from "react";
import "../adminviewcss/overview.css"; // Import the CSS file for styling
import newAlertIcon from "../images/new-alert.png";
import completedIcon from "../images/completed.png";
import deliveryicon from "../images/delivery.png";
import inProgressIcon from "../images/in-progress.png";

const Overview = () => {
  const orders = useStore((state) => state.allOrders);
  const loadAllOrders = useStore((state) => state.loadAllOrders);

  const [pendingOrders, setPendingOrders] = useState(0);
  const [progressOrders, setProgressOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [deliveryOrders, setDeliveryOrders] = useState(0);

  const [todayCompletedOrders, setTodayCompletedOrders] = useState(0);

  useEffect(() => {
    if (orders.length === 0) {
      loadAllOrders();
    }
  }, [loadAllOrders]);

  useEffect(() => {
    // Filter completed orders for today
    const today = new Date().toDateString();
    const completedToday = orders.filter((order) => {
      const orderDate = new Date(order.createdAt).toDateString();
      return order.status === "completed" && orderDate === today;
    });
    setTodayCompletedOrders(completedToday.length);
  }, [orders]);

  useEffect(() => {
    // Count orders based on their status
    setPendingOrders(
      orders.filter((order) => order.status === "new").length
    );
    setCompletedOrders(
      orders.filter((order) => order.status === "completed").length
    );
    setDeliveryOrders(
      orders.filter((order) => order.status === "ready").length
    );
    setProgressOrders(
      orders.filter(
        (order) =>
          order.status !== "new" &&
          order.status !== "scheduled" &&
          order.status !== "completed" &&
          order.status !== "ready" &&
          order.status !== "delivery"
      ).length
    );
  }, [orders]);

  return (
    <div className="overview-container">
      <div className="overview-title">
        <h1>Admin Overview</h1>
      </div>
      <div className="overview-content">
        <div className="overview-cards">
          <div className="ov-card">
            <div className="icon-placeholder">
              <img src={newAlertIcon} alt="new" />
            </div>
            <div className="card-text">
              <h2>Pending</h2>
              <p>{pendingOrders}</p>
            </div>
          </div>
          <div className="ov-card">
            <div className="icon-placeholder">
              <img src={inProgressIcon} alt="In-progress" />
            </div>
            <div className="card-text">
              <h2>In Progress</h2>
              <p>{progressOrders}</p>
            </div>
          </div>

          <div className="ov-card">
            <div className="icon-placeholder">
              <img src={completedIcon} alt="completed" />
            </div>
            <div className="card-text">
              <h2>Completed</h2>
              <p>{todayCompletedOrders}</p>
            </div>
          </div>
          <div className="ov-card">
            <div className="icon-placeholder">
              <img src={deliveryicon} alt="delivery" />
            </div>
            <div className="card-text">
              <h2>Delivery</h2>
              <p>{deliveryOrders}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
