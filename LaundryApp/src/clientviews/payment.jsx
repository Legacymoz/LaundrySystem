import React, { useState, useEffect } from "react";
import { useStore } from "../store/zustand";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MpesaPayment = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);

  const clientInfo = useStore((state) => state.clientInfo);
  const initializeClientInfo = useStore((state) => state.initializeClientInfo);
  const makePayment = useStore((state) => state.makePayment);
  const selectedOrder = useStore((state) => state.selectedOrder);

  // Extract firstName, lastName, and email from clientInfo
  const firstName = clientInfo?.name?.split(" ")[0] || "";
  const lastName = clientInfo?.name?.split(" ")[1] || "";
  const email = clientInfo?.email || "";

  // Extract totalCost from the selected order
  const amount = selectedOrder?.totalCost || 0;

  console.log("selectedOrder", selectedOrder); // Debugging line to check the selected order

  useEffect(() => {
    if (!clientInfo) {
      initializeClientInfo();
    }
  }, [clientInfo, initializeClientInfo]);

  const handlePayment = async () => {
    if (!clientInfo) {
      toast.error("Client information is missing. Please try again.");
      return;
    }

    if (!phoneNumber || !amount) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const paymentData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      amount,
      customerID: selectedOrder.customerID,
      orderID: selectedOrder._id,
    };

    await makePayment(paymentData, setLoading);
  };

  return (
    <div className="mpesa-payment">
      <h2 className="text-xl font-bold mb-4">M-Pesa Payment</h2>
      <div className="mb-4">
        <label className="block mb-2">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
          placeholder="Enter phone number"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Amount</label>
        <div className="border border-gray-300 rounded px-4 py-2 w-full bg-gray-100">
          {amount.toFixed(2)}
        </div>
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Processing..." : "Pay with M-Pesa"}
      </button>
      <ToastContainer />
    </div>
  );
};

export default MpesaPayment;
