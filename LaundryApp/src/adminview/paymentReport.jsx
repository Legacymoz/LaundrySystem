// import React, { useEffect } from "react";
// import { useStore } from "../store/zustand";

// const PaymentReport = () => {
//   const loadAllPayments = useStore((state) => state.loadAllPayments); // Fetch all payments
//   const allPayments = useStore((state) => state.allPayments); // Access all payments from Zustand

//   useEffect(() => {
//     loadAllPayments(); // Load all payments when the component mounts
//   }, [loadAllPayments]);
//   console.log(allPayments); // Log all payments for debugging

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6 text-center">Payment Report</h1>
//       <div className="overflow-x-auto">
//         <table className="table-auto w-full border-collapse border border-gray-300">
//           <thead>
//             <tr >
//               <th className="border border-gray-300 px-4 py-2">Invoice</th>
//               <th className="border border-gray-300 px-4 py-2">Mpesa Ref</th>
//               <th className="border border-gray-300 px-4 py-2">Customer ID</th>
//               <th className="border border-gray-300 px-4 py-2">Order ID</th>
//               <th className="border border-gray-300 px-4 py-2">Amount</th>
//               <th className="border border-gray-300 px-4 py-2">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allPayments.length > 0 ? (
//               allPayments.map((payment) => (
//                 <tr key={payment._id} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-4 py-2">
//                     {payment.invoice}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {payment.transactionCode}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {payment.customerID}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {payment.orderID}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     KES {payment.amount.toFixed(2)}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {new Date(payment.createdAt).toISOString().split("T")[0]}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="6"
//                   className="border border-gray-300 px-4 py-2 text-center text-gray-500"
//                 >
//                   No payments found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PaymentReport;

import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";

const PaymentReport = () => {
  const loadAllPayments = useStore((state) => state.loadAllPayments); // Fetch all payments
  const allPayments = useStore((state) => state.allPayments); // Access all payments from Zustand

  const [filteredPayments, setFilteredPayments] = useState([]); // Filtered payments
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [filter, setFilter] = useState("all"); // Filter type: all, today, week, month
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const paymentsPerPage = 10; // Number of payments per page
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadAllPayments(); // Load all payments when the component mounts
  }, [loadAllPayments]);

  useEffect(() => {
    filterPayments(); // Filter payments whenever allPayments, searchTerm, or filter changes
  }, [allPayments, searchTerm, filter, startDate, endDate]);

  const filterPayments = () => {
    let filtered = [...allPayments];

    // // Filter by date
    // const now = new Date();
    // if (filter === "today") {
    //   filtered = filtered.filter((payment) => {
    //     const paymentDate = new Date(payment.createdAt);
    //     return paymentDate.toDateString() === now.toDateString(); // Same day
    //   });
    // } else if (filter === "week") {
    //   const startOfWeek = new Date();
    //   startOfWeek.setDate(now.getDate() - now.getDay());
    //   filtered = filtered.filter((payment) => {
    //     const paymentDate = new Date(payment.createdAt);
    //     return paymentDate >= startOfWeek && paymentDate <= now;
    //   });
    // } else if (filter === "month") {
    //   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    //   filtered = filtered.filter((payment) => {
    //     const paymentDate = new Date(payment.createdAt);
    //     return paymentDate >= startOfMonth && paymentDate <= now;
    //   });
    // }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.transactionCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.customerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.amount.toString().includes(searchTerm)
      );
    }

    // Sort by newest to oldest
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
    <div className="max-w-6xl mx-auto p-6 ">
      <h1 className="text-2xl font-bold mb-6 text-center">Payment Report</h1>

      {/* Search and Filter */}
      <div className="flex justify-between items-center mb-4 ">
        <input
          type="text"
          placeholder="Search by Mpesa Ref, Customer ID, or Amount"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 max-w-2/3"
        />
        <div className="flex gap-4 ">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              Start Date:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">End Date:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </label>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Invoice</th>
              <th className="border border-gray-300 px-4 py-2">Mpesa Ref</th>
              <th className="border border-gray-300 px-4 py-2">Customer ID</th>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {payment.invoice}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {payment.transactionCode}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {payment.customerID}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {payment.orderID}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    KES {payment.amount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total Payments and Amount Section */}
      <div className="flex justify-end mt-4 max-w-1/3">
        <table className="border border-gray-300 bg-gray-50 rounded-lg">
          <tbody>
            <tr>
              <td className="px-4 py-2 font-semibold text-gray-700 border border-gray-300">
                Total Payments:
              </td>
              <td className="px-4 py-2 text-right font-bold text-gray-900 border border-gray-300">
                {filteredPayments.length}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold text-gray-700 border border-gray-300">
                Total Amount:
              </td>
              <td className="px-4 py-2 text-right font-bold text-gray-900 border border-gray-300">
                KES{" "}
                {filteredPayments
                  .reduce((total, payment) => total + payment.amount, 0)
                  .toFixed(2)}
              </td>
            </tr>
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

export default PaymentReport;
