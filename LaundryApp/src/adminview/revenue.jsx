import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";

const Revenue = () => {
  const loadAllPayments = useStore((state) => state.loadAllPayments); // Fetch all payments
  const allPayments = useStore((state) => state.allPayments); // Access all payments from Zustand
  const orders = useStore((state) => state.allOrders);

  const [filteredPayments, setFilteredPayments] = useState([]); // Filtered payments
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const paymentsPerPage = 5; // Number of payments per page

  useEffect(() => {
    loadAllPayments(); // Load all payments when the component mounts
  }, [loadAllPayments]);

  useEffect(() => {
    filterPayments(); // Filter payments whenever allPayments or searchTerm changes
  }, [allPayments, searchTerm]);

  const filterPayments = () => {

     // Get today's date
    const today = new Date().toDateString();

    // Filter payments made today
    let todayPayments = allPayments.filter((payment) => {
      const paymentDate = new Date(payment.createdAt).toDateString();
      return paymentDate === today;
    });

    // Sort payments from latest to earliest
    let sortedPayments = [...todayPayments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Filter payments where status is not "completed"
    let filtered = sortedPayments.filter(
      (payment) => payment.status !== "completed"
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.transactionCode
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) || // Search by Mpesa reference
          payment.orderID?.toLowerCase().includes(searchTerm.toLowerCase()) // Search by OrderID
      );
    }

    setFilteredPayments(filtered);
  };

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

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

  return (
    <div className="w-5/6 mx-auto ml-0 p-6  bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Revenue Report</h1>

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Mpesa Ref or Order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 max-w-2/3"
        />
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Mpesa Ref</th>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {payment.transactionCode || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {"ORD-" + payment.orderID.slice(0, 6).toUpperCase()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    KES {payment.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          &lt;
        </button>
        <span className="text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Revenue;