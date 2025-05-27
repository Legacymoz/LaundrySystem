import React from "react";
import { useStore } from "../store/zustand";
import { useNavigate } from "react-router-dom";


const OrderDetailsPage = () => {
  const selectedOrder = useStore((state) => state.selectedOrder); // Zustand store to get the selected order
  const selectedCustomer = useStore((state) => state.selectedCustomer); // Zustand store to get the selected customer
  const clearSelectedOrder = useStore((state) => state.clearSelectedOrder); // Zustand store to clear the selected order
  const clearSelectedCustomer = useStore((state) => state.clearSelectedCustomer); // Zustand store to clear the selected customer
  const navigate = useNavigate(); // Hook to navigate between routes
  console.log("Selected customer:", selectedCustomer); // Log the selected order for debugging

  if (!selectedOrder || Object.keys(selectedOrder).length === 0) {
    return <p>No order selected. Please go back and select an order.</p>;
  }

  const handleback = () => {
    clearSelectedCustomer();
    clearSelectedOrder();
    navigate(-1); // Navigate back to the order list page
    console.log("Back to order list"); // Log the action for debugging

  }

  console.log("Selected order:", selectedOrder); // Log the selected order for debugging
  console.log("Selected customer:", selectedCustomer); // Log the selected customer for debugging

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Order Details</h1>

      <div className="flex justify-end">
        <button
          onClick={handleback}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
        >
          Back
        </button>
      </div>

      {/* First Table */}
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Order ID
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {"ORD-" + selectedOrder._id.slice(0, 6).toUpperCase()}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Order Status
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.status}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Driver
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.driver || "Unassigned"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Total Quantity
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.totalQuantity || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Total Amount
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.totalCost
                ? `KSH ${selectedOrder.totalCost}`
                : "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Payment Status
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.paymentStatus || "Pending"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Second Table */}
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Name
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.customer.name || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Pickup Address
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.pickupAddress || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Pickup Date
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.pickupDate
                ? `${new Date(selectedOrder.pickupDate).toLocaleDateString()} ${
                    selectedOrder.pickupTime || ""
                  }`
                : "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Drop Off Address
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.dropoffAddress || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Drop Off Date
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedOrder.dropoffDate
                ? `${new Date(
                    selectedOrder.dropoffDate
                  ).toLocaleDateString()} ${selectedOrder.dropoffTime || ""}`
                : "N/A"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailsPage;