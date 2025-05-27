import React, { useState, useEffect } from "react";
import { useStore } from "../store/zustand"; // Zustand store for state management
import { useNavigate } from "react-router-dom"; // For navigation
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAdminProfilePage = () => {
  const adminInfo = useStore((state) => state.adminInfo); // Get current admin info
  const updateProfile = useStore((state) => state.updateProfile); // Zustand function to update profile
  const initializeAdminInfo = useStore((state) => state.initializeAdminInfo); // Reinitialize admin info
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
  });

  useEffect(() => {
    if (adminInfo) {
      setFormData({
        name: adminInfo.name || "",
        email: adminInfo.email || "",
        number: adminInfo.number || "",
      });
    }
  }, [adminInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

        console.log("Form Data:", formData); // Log form data for debugging
      await updateProfile(formData); // Update admin profile using Zustand function
      
      initializeAdminInfo(); // Reinitialize admin info after update
      setTimeout(() => {
        navigate(-1); // Redirect to admin profile page
      }, 1000);
      
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    }
  };

  const handleCancel = () => {
    navigate(-1); // Navigate back to the admin profile page
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
      <h1 className="text-2xl font-bold text-center">Edit Admin Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="number" className="block font-medium mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdminProfilePage;