import React, { useEffect } from "react";
import { useStore } from "../store/zustand";
import "../clientviewcss/currentOrders.css";
import { useNavigate } from "react-router-dom"; // Import Navigate for redirection

const CurrentOrders = () => {
  const orders = useStore((state) => state.clientOrders); // Get client orders from Zustand
  const loadOrders = useStore((state) => state.loadOrders); // Load orders function
  const clientInfo = useStore((state) => state.clientInfo); // Get client info
  const selectedOrder = useStore((state) => state.selectedOrder); // Get selected order from Zustand
  const setSelectedOrder = useStore((state) => state.setSelectedOrder); // Set selected order function
  const navigate = useNavigate();

  console.log("orders:", orders); // Log the orders for debugging


  useEffect(() => {
    if (clientInfo?.id) {
      console.log("Client ID:", clientInfo); // Log the client ID
      loadOrders(clientInfo.id); // Load orders for the logged-in client
    }
  }, [clientInfo, loadOrders]);

  const handleDetails = (order) => {
    setSelectedOrder(order); // Set the selected order to view details
    navigate("/client-dashboard/order-details"); // Navigate to the order details page
  }

  const handlePayment = (order) => {
    setSelectedOrder(order); // Set the selected order for payment
    navigate("/client-dashboard/payment"); // Navigate to the payment page
  };
  
  const filteredOrders = orders?.filter((order) => {
    return order.status !== "completed" && order.status !== "cancelled"; // Filter out completed and cancelled orders
  })

  return (
    <div className="current-orders-container p-6">
      <h2 className="text-2xl font-bold mb-4">Current Orders</h2>

      {filteredOrders?.length > 0 ? (
        <ul className="orders-list space-y-4">
          {filteredOrders.map((order) => {
            const { _id, status } = order;

            return (
              <li
                key={_id}
                className="order-item flex justify-between items-center border p-4 rounded shadow"
              >
                {/* Left Side: Order ID, Status, and Payment Status */}
                <div>
                  <h3 className="font-bold text-lg">
                    {"ORD-" + order._id.slice(0, 6).toUpperCase()}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Status:</strong> {status}
                  </p>
                  <p className="text-gray-600">
                    <strong>Payment:</strong>{" "}
                    {order.payment === "PAID" ? "Paid" : "Pending"}
                  </p>
                </div>

                {/* Right Side: Details and Payment Buttons */}
                <div className="flex space-x-4">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    onClick={() => handleDetails(order)}
                  >
                    Details
                  </button>
                  {order.payment !== "PAID" && (
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                      onClick={() => handlePayment(order)}
                    >
                      Pay
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-orders text-gray-600">No active orders</p>
      )}
    </div>
  );
};

export default CurrentOrders;
