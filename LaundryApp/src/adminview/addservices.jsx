import React, { useState } from "react";
import { useStore } from "../store/zustand"; // Assuming you have a store setup
import { useNavigate } from "react-router-dom";

// Helper to sanitize keys (no spaces, lowercase, underscores)
const slugify = (str) => str.trim().toLowerCase().replace(/\s+/g, "_");

const AddServiceForm = () => {
  // Service metadata
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Garment state: store { key, display }
  const [garments, setGarments] = useState([]);
  const [newGarment, setNewGarment] = useState("");
  const [prices, setPrices] = useState({});

  // Workflow state sections
  const staticStart = ["pending", "scheduled"];
  const staticEnd = ["ready", "delivered", "completed"];
  const [dynamicStates, setDynamicStates] = useState([]);
  const [newState, setNewState] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const addService = useStore((state) => state.addService);
  const navigate = useNavigate(); 

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

  // Dynamic states handlers (between scheduled and ready)
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
    const service = {
      // Ensure title is slugified to avoid spaces
      title: slugify(title),
      name,
      description,
      categories: garments.map((g) => g.key),
      prices,
      states: [...staticStart, ...dynamicStates, ...staticEnd],
    };

    addService(service); // Add the service to the store
    setSuccessMessage("Service added successfully!"); // Set success message
    setTimeout(() => setSuccessMessage(""), 3000);

    // Reset form fields
    setTitle("");
    setName("");
    setDescription("");
    setGarments([]);
    setPrices({});
    setDynamicStates([]);

    // TODO: send `service` to your API or global store
    console.log("Submitting service:", service);
  };
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="add-service-container">
      <h2 className="title text-2xl font-bold text-center mb-6">Add New Service</h2>

      {/* Success Message */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-6">
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

        {/* Dynamic States between scheduled & ready */}
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

        <div className="flex justify-between items-center mt-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
          >
            Back
          </button>

          {/* Add Service Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Add Service
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceForm;
