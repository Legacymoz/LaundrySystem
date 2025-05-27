// import React, { useState } from "react";
// import PendingOrders from "./pendingOrders";
// import InProgressOrders from "./inProgressOrders";
// import ReadyOrders from "./readyOrders";

// const OrdersStates = () => {
//   const [activeTab, setActiveTab] = useState("Pending");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "Pending":
//         return <PendingOrders />;
//       case "InProgress":
//         return <InProgressOrders />;
//       case "Ready":
//         return <ReadyOrders />;
//       default:
//         return <PendingOrders />;
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-center mb-4">Orders by State</h1>
//       <div className="flex justify-center space-x-4 mb-6">
//         <button
//           onClick={() => setActiveTab("Pending")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "Pending" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Pending
//         </button>
//         <button
//           onClick={() => setActiveTab("InProgress")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "InProgress"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           In Progress
//         </button>
//         <button
//           onClick={() => setActiveTab("Ready")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "Ready" ? "bg-blue-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           Ready
//         </button>
//       </div>
//       <div>{renderContent()}</div>
//     </div>
//   );
// };

// export default OrdersStates;


import React, { useState } from "react";
import PendingOrders from "./pendingOrders";
import InProgressOrders from "./inProgressOrders";
import ReadyOrders from "./readyOrders";
import "../adminviewcss/orderByStates.css"; // Import the CSS file

const OrdersStates = () => {
  const [activeTab, setActiveTab] = useState("Pending");

  const renderContent = () => {
    switch (activeTab) {
      case "Pending":
        return <PendingOrders />;
      case "InProgress":
        return <InProgressOrders />;
      case "Ready":
        return <ReadyOrders />;
      default:
        return <PendingOrders />;
    }
  };

  return (
    <div className="orders-states-container">
      <h1 className="orders-states-title">Orders by State</h1>
      <div className="orders-states-tabs">
        
        <button
          onClick={() => setActiveTab("Pending")}
          className={`orders-states-tab ${
            activeTab === "Pending" ? "active-tab" : ""
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("InProgress")}
          className={`orders-states-tab ${
            activeTab === "InProgress" ? "active-tab" : ""
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveTab("Ready")}
          className={`orders-states-tab ${
            activeTab === "Ready" ? "active-tab" : ""
          }`}
        >
          Ready
        </button>
      </div>
      <div className="orders-states-content">{renderContent()}</div>
    </div>
  );
};

export default OrdersStates;