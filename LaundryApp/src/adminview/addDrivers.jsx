import React, { useState } from "react";
import { useStore } from "../store/zustand"; // Assuming you have a Zustand store setup
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDrivers = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");

  const addDriver = useStore((state) => state.addDriver); // Zustand function to add a driver
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !licenseNumber || !vehicleDetails) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const driver = {
      name,
      email,
      phone,
      licenseNumber,
      vehicleDetails,
    };

    try {
      await addDriver(driver); // Add the driver to the store
      
      // Reset form fields
      setName("");
      setEmail("");
      setPhone("");
      setLicenseNumber("");
      setVehicleDetails("");
    } catch (error) {
      toast.error("An error occurred while adding the driver.");
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="add-driver-container">
      <ToastContainer />
      <h2 className="title text-2xl font-bold text-center mb-6">Add New Driver</h2>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-6">
        {/* Driver Info */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-medium mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="licenseNumber" className="block font-medium mb-1">
            License Number
          </label>
          <input
            id="licenseNumber"
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="vehicleDetails" className="block font-medium mb-1">
            Vehicle Details
          </label>
          <input
            id="vehicleDetails"
            type="text"
            value={vehicleDetails}
            onChange={(e) => setVehicleDetails(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
          >
            Back
          </button>

          {/* Add Driver Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Add Driver
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDrivers;