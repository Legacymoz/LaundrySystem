import React, { useState, useEffect } from "react";
import { useStore } from "../store/zustand"; // Assuming Zustand is used for state management
import { useNavigate } from "react-router-dom"; // For navigation
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

// Helper to sanitize keys (no spaces, lowercase, underscores)
const slugify = (str) => str.trim().toLowerCase().replace(/\s+/g, "_");

const EditServiceForm = ({ serviceToEdit, onClose }) => {
  const selectedService = useStore((state) => state.selectedService); // Zustand state to get the selected service
  const editService = useStore((state) => state.editService); // Zustand action to edit a service
  const navigate = useNavigate(); // React Router's navigation hook

  // Prepopulate fields with the service data
  const [title, setTitle] = useState(selectedService.title || "");
  const [name, setName] = useState(selectedService.name || "");
  const [description, setDescription] = useState(
    selectedService.description || ""
  );
  const [garments, setGarments] = useState(
    selectedService.categories.map((key) => ({
      key,
      display: key.replace(/_/g, " "),
    })) || []
  );
  const [prices, setPrices] = useState(selectedService.prices || {});
  const [dynamicStates, setDynamicStates] = useState(
    selectedService.states.slice(2, -3) || [] // Extract intermediate states
  );

  const staticStart = ["new", "scheduled"];
  const staticEnd = ["ready", "delivery", "completed"];
  const [newGarment, setNewGarment] = useState("");
  const [newState, setNewState] = useState("");

  // Garment handlers
  const handleAddGarment = () => {
    const display = newGarment.trim();
    if (!display) return;
    const key = slugify(display);
    if (garments.some((g) => g.key === key)) return;
    setGarments((prev) => [...prev, { key, display }]);
    setPrices((prev) => ({ ...prev, [key]: "" }));
    setNewGarment("");
  };

  const handleRemoveGarment = (key) => {
    setGarments((prev) => prev.filter((g) => g.key !== key));
    const { [key]: _, ...rest } = prices;
    setPrices(rest);
  };

  const handlePriceChange = (key, value) => {
    setPrices((prev) => ({ ...prev, [key]: value }));
  };

  // Dynamic states handlers
  const handleAddState = () => {
    const step = newState.trim();
    if (!step || dynamicStates.includes(step)) return;
    setDynamicStates((prev) => [...prev, step]);
    setNewState("");
  };

  const handleRemoveState = (step) => {
    setDynamicStates((prev) => prev.filter((s) => s !== step));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !name || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (Object.values(prices).some((price) => price === "" || price < 0)) {
      alert("Please ensure all garment prices are valid.");
      return;
    }

    const updatedService = {
      title: slugify(title), // Ensure title is slugified
      name,
      description,
      categories: garments.map((g) => g.key),
      prices,
      states: [...staticStart, ...dynamicStates, ...staticEnd],
    };

    editService(selectedService.title, updatedService); // Call Zustand's editService function
    
    console.log("Service updated:", updatedService);

    if (onClose) onClose(); // Close the form if a callback is provided
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      {/* Toastify Container */}
      <h2 className="text-xl font-bold">Edit Service</h2>
      {/* Service Info */}
      <div>
        <label htmlFor="title" className="block font-medium mb-1">
          Title (underscores instead of spaces)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>
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
        <label htmlFor="description" className="block font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>
      {/* Garment entry */}
      <div className="space-y-2">
        <label htmlFor="newGarment" className="block font-medium mb-1">
          Add Garment
        </label>
        <div className="flex space-x-2">
          <input
            id="newGarment"
            type="text"
            placeholder="e.g. Leather Shoe"
            value={newGarment}
            onChange={(e) => setNewGarment(e.target.value)}
            className="flex-1 border rounded p-2"
          />
          <button
            type="button"
            onClick={handleAddGarment}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            +
          </button>
        </div>
      </div>
      {garments.length > 0 && (
        <div className="space-y-4">
          <span className="block font-medium mb-2">Garments & Prices</span>
          <div className="space-y-3">
            {garments.map(({ key, display }) => (
              <div key={key} className="flex items-center space-x-3">
                <span className="w-32">{display}</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={prices[key]}
                  onChange={(e) => handlePriceChange(key, e.target.value)}
                  required
                  className="border rounded p-1 flex-1"
                />
                <span>KSH</span>
                <button
                  type="button"
                  onClick={() => handleRemoveGarment(key)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Dynamic States */}
      <div className="space-y-2">
        <span className="block font-medium mb-1">Intermediate States</span>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="e.g. washing"
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            className="flex-1 border rounded p-2"
          />
          <button
            type="button"
            onClick={handleAddState}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            +
          </button>
        </div>
      </div>
      {dynamicStates.length > 0 && (
        <div className="space-y-4">
          <span className="block font-medium mb-2">
            Your Intermediate Workflow Steps
          </span>
          <div className="space-y-3">
            {dynamicStates.map((step) => (
              <div key={step} className="flex items-center space-x-3">
                <span className="w-32 capitalize">{step}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveState(step)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Back and Submit Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin-dashboard/services")} // Navigate back to ServiceList
          className="bg-gray-600 text-white rounded px-4 py-2 hover:bg-gray-700"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditServiceForm;


// import React, { useState } from "react";
// import { useStore } from "../store/zustand";
// import { useNavigate } from "react-router-dom"; // For navigation

// const slugify = (str) => str.trim().toLowerCase().replace(/\s+/g, "_");

// const EditServiceForm = () => {
//   const selectedService = useStore((state) => state.selectedService); // Zustand state to get the selected service
//   const editService = useStore((state) => state.editService); // Zustand action to edit a service
//   const navigate = useNavigate(); // React Router's navigation hook

//   // Prepopulate fields with the service data
//   const [title, setTitle] = useState(selectedService.title || "");
//   const [name, setName] = useState(selectedService.name || "");
//   const [description, setDescription] = useState(selectedService.description || "");
//   const [garments, setGarments] = useState(
//     selectedService.categories.map((key) => ({ key, display: key.replace(/_/g, " ") })) || []
//   );
//   const [prices, setPrices] = useState(selectedService.prices || {});
//   const [dynamicStates, setDynamicStates] = useState(
//     selectedService.states.slice(2, -3) || [] // Extract intermediate states
//   );

//   const staticStart = ["pending", "scheduled"];
//   const staticEnd = ["ready", "delivered", "completed"];
//   const [newGarment, setNewGarment] = useState("");
//   const [newState, setNewState] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!title || !name || !description) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     if (Object.values(prices).some((price) => price === "" || price < 0)) {
//       alert("Please ensure all garment prices are valid.");
//       return;
//     }

//     const updatedService = {
//       title: slugify(title), // Ensure title is slugified
//       name,
//       description,
//       categories: garments.map((g) => g.key),
//       prices,
//       states: [...staticStart, ...dynamicStates, ...staticEnd],
//     };

//     editService(selectedService.title, updatedService); // Call Zustand's editService function
//     console.log("Service updated:", updatedService);

//     navigate("/services"); // Navigate back to the ServiceList page
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-6">
//       <h2 className="text-xl font-bold">Edit Service</h2>

//       {/* Service Info */}
//       <div>
//         <label htmlFor="title" className="block font-medium mb-1">
//           Title
//         </label>
//         <input
//           id="title"
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           className="w-full border rounded p-2"
//         />
//       </div>
//       <div>
//         <label htmlFor="name" className="block font-medium mb-1">
//           Name
//         </label>
//         <input
//           id="name"
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           className="w-full border rounded p-2"
//         />
//       </div>
//       <div>
//         <label htmlFor="description" className="block font-medium mb-1">
//           Description
//         </label>
//         <textarea
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//           className="w-full border rounded p-2"
//         />
//       </div>
      

//       {/* Back and Submit Buttons */}
//       <div className="flex justify-between">
//         <button
//           type="button"
//           onClick={() => navigate("/services")} // Navigate back to ServiceList
//           className="bg-gray-600 text-white rounded px-4 py-2 hover:bg-gray-700"
//         >
//           Back
//         </button>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
//         >
//           Save Changes
//         </button>
//       </div>
//     </form>
//   );
// };

// export default EditServiceForm;