import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import { useNavigate } from "react-router-dom"; // For navigation
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminUsersList = () => {
  const users = useStore((state) => state.users); // Zustand store to get all users
  const loadUsers = useStore((state) => state.loadUsers); // Zustand action to load users
  const [adminUsers, setAdminUsers] = useState([]); // State to store filtered admin users
  const deleteUser = useStore((state) => state.deleteUser); // Zustand action to delete a user
  
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Load users when the component mounts
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    // Filter users with the role "admin" whenever users are updated
    const filteredAdmins = users.filter((user) => user.roles.includes("admin"));
    setAdminUsers(filteredAdmins);
  }, [users]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const response = await deleteUser(userId);
      if (response.success) {
        toast.success(response.message || "User deleted successfully!");
      } else {
        toast.error(
          response.message || "An error occurred while deleting the user."
        );
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <ToastContainer
              position="top-right"
              autoClose={1000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
      <h1 className="text-2xl font-bold text-center">Admin Users</h1>
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/admin-dashboard/add-user")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          New Admin
        </button>
      </div>
      {adminUsers.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Number</th>
              <th className="border border-gray-300 px-4 py-2">Roles</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((admin) => (
              <tr key={admin._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {admin.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {admin.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {admin.number}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {admin.roles.join(", ")}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No admin users found.</p>
      )}
    </div>
  );
};

export default AdminUsersList;
