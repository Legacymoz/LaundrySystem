import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import { useNavigate } from "react-router-dom";
import "../adminviewcss/customerList.css";
const CustomerList = () => {
    const users = useStore((state) => state.users);
    const loadUsers = useStore((state) => state.loadUsers);
 const setSelectedCustomer = useStore((state) => state.setSelectedCustomer); // Zustand action to set the selected customer
 const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Load users when the component mounts
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    // Filter customers with the role "user" whenever users are updated
    const filteredCustomers = users.filter((user) =>
      user.roles.includes("user")
    );
    setCustomers(filteredCustomers);
  }, [users]);

  const handleDetails = (customer) => {
    setSelectedCustomer(customer); // Set the selected customer in Zustand
    navigate("customer-details"); // Navigate to the CustomerDetailsPage
  };

  return (
    <div className="customer-list-container">
      <h2>Customer List</h2>
      <div className="flex justify-end mb-2">
        <button
          onClick={() => navigate("/admin-dashboard/add-user")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          New Admin
        </button>
      </div>
      {customers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.number}</td>
                <td>{customer.email}</td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDetails(customer)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );

  
};

export default CustomerList;
