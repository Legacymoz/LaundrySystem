import React from "react";
import { useStore } from "../store/zustand";
import { useNavigate } from "react-router-dom";

const ClientOrderDetails = () => {
  const selectedOrder = useStore((state) => state.selectedOrder); // Get the selected order from Zustand
  const navigate = useNavigate();

  console.log("Selected Order:", selectedOrder); // Debugging line to check the selected order

  const handleBack = () => {
    navigate(-1); // Navigate back to the current orders page
  };

  if (!selectedOrder) {
    return (
      <div className="p-6">
        <p className="text-gray-600">No order selected. Please go back.</p>
        <button
          onClick={handleBack}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-4"
        >
          Back
        </button>
      </div>
    );
  }

  const {
    _id,
    garments,
    serviceType,
    totalCost,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    status,
    payment,
  } = selectedOrder;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Order Details</h1>

      <div className="flex justify-end">
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
        >
          Back
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Order ID
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {"ORD-" + _id.slice(0, 6).toUpperCase()}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Service Type
            </td>
            <td className="border border-gray-300 px-4 py-2">{serviceType}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Total Cost
            </td>
            <td className="border border-gray-300 px-4 py-2">{`KSH ${totalCost}`}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Payment Status
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {payment === "PAID" ? "Paid" : "Pending"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Pickup Date & Time
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {pickupDate
                ? `${new Date(pickupDate).toLocaleDateString()} ${pickupTime}`
                : "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Drop-off Date & Time
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {dropoffDate
                ? `${new Date(dropoffDate).toLocaleDateString()} ${dropoffTime}`
                : "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Status
            </td>
            <td className="border border-gray-300 px-4 py-2">{status}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">
              Garments
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {garments && Object.keys(garments).length > 0 ? (
                <ul>
                  {Object.entries(garments).map(([garmentType, quantity]) => (
                    <li key={garmentType}>
                      {garmentType}: {quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                "No garments specified"
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ClientOrderDetails;