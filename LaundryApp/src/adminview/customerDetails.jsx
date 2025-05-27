import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import { useNavigate } from "react-router-dom";

const CustomerDetailsPage = () => {
  const selectedCustomer = useStore((state) => state.selectedCustomer); // Zustand store to get the selected customer
  const allOrders = useStore((state) => state.allOrders); // Zustand store to get all orders
  const loadAllOrders = useStore((state) => state.loadAllOrders); // Zustand action to load all orders
  const clearSelectedCustomer = useStore((state) => state.clearSelectedCustomer); // Zustand action to clear the selected customer
  const navigate = useNavigate();

  console.log("Selected customer:", selectedCustomer); // Log the selected customer for debugging

  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    // Load all orders when the component mounts
    loadAllOrders();
  }, [loadAllOrders]);

  useEffect(() => {
    // Calculate the total orders made by the customer
    if (selectedCustomer && allOrders.length > 0) {
      const customerOrders = allOrders.filter(
        (order) => order.customerID === selectedCustomer._id
      );
      setTotalOrders(customerOrders.length);
    }
  }, [selectedCustomer, allOrders]);

  if (!selectedCustomer || Object.keys(selectedCustomer).length === 0) {
    return <p>No customer selected. Please go back and select a customer.</p>;
  }

  const handleBack = () => {
    clearSelectedCustomer(); // Clear the selected customer from Zustand
    navigate(-1); // Navigate back to the CustomerList page
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Customer Details</h1>

      <div>
        <button
          onClick={handleBack}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Name</td>
            <td className="border border-gray-300 px-4 py-2">{selectedCustomer.name}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">ID</td>
            <td className="border border-gray-300 px-4 py-2">{selectedCustomer._id}</td>
            
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Number</td>
            <td className="border border-gray-300 px-4 py-2">{selectedCustomer.number}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Email</td>
            <td className="border border-gray-300 px-4 py-2">{selectedCustomer.email}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Role</td>
            <td className="border border-gray-300 px-4 py-2">
              {selectedCustomer.roles}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Total Orders</td>
            <td className="border border-gray-300 px-4 py-2">{totalOrders}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetailsPage;