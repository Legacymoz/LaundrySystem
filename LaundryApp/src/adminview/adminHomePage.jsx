import React from "react";
import Summary from "./summary"; // Import the Summary component
import Overview from "./overview"; // Import the Overview component
import Revenue from "./revenue";

const AdminHomePage = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        Welcome to the Admin Dashboard
      </h1>

      {/* Summary Section */}
      <div className="summary-section">
        <Summary />
      </div>

      {/* Overview Section */}
      <div className="flex">
        <div className="overview-section flex flex-2 justify-start ">
          <Revenue />
        </div>
        <div className="overview-section flex justify-end flex-1">
          <Overview />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;