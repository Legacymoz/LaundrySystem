import React, { useState } from "react";
import ClientOrderReport from "./clientOrderReport";
import ClientPaymentRecord from "./clientPaymentRecord";
import "../clientviewcss/clientReports.css"; // Import the CSS file for styling

const ClientReports = () => {
  const [activeTab, setActiveTab] = useState("Orders");

  const renderContent = () => {
    switch (activeTab) {
      case "Orders":
        return <ClientOrderReport />;
      case "Payments":
        return <ClientPaymentRecord />;
      default:
        return <ClientOrderReport />;
    }
  };

  return (
    <div className="client-reports-container">
      <h1 className="client-reports-title">Client Reports</h1>
      <div className="client-reports-tabs">
        <button
          onClick={() => setActiveTab("Orders")}
          className={`client-reports-tab ${
            activeTab === "Orders" ? "active-tab" : ""
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("Payments")}
          className={`client-reports-tab ${
            activeTab === "Payments" ? "active-tab" : ""
          }`}
        >
          Payments
        </button>
      </div>
      <div className="client-reports-content">{renderContent()}</div>
    </div>
  );
};

export default ClientReports;