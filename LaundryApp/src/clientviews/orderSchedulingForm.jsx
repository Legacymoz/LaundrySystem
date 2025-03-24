import React, { useState } from "react";
import { useStore } from "../store/zustand";
import axios from "axios"; // Import Axios
import "../clientviewcss/orderSchedulingForm.css";
const OrderSchedulingForm = () => {
  const { selectedService, services, isModalOpen, setIsModalOpen,setIsServiceDescModalOpen } = useStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    garments: {},
    pickupDate: "",
    dropoffDate: "",
    pickupTime: "",
    dropoffTime: "",
    pickupAddress: "",
    dropoffAddress: "",
    sameAddress: false,
  });

  if (!isModalOpen || !selectedService) return null;

  const serviceData = services.find(
    (service) => service.title === selectedService.title
  );
  console.log("My services", services);
  console.log("My service data", serviceData);

  // Handle form updates
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Move to next/previous steps
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Handle form submission using Axios
  const handleConfirmOrder = () => {
    const order = {
      service: selectedService,
      garments: formData.garments,
      pickup: {
        date: formData.pickupDate,
        time: formData.pickupTime,
        address: formData.pickupAddress,
      },
      dropoff: {
        date: formData.dropoffDate,
        time: formData.dropoffTime,
        address: formData.sameAddress
          ? formData.pickupAddress
          : formData.dropoffAddress,
      },
    };

    console.log("Order Confirmed:", order);

    // // Send order to backend using Axios
    // axios
    //   .post("https://dummyjson.com/c/8a65-d661-4d3c-982b", order)
    //   .then((response) => {
    //     console.log("Order saved:", response.data);
    //     setIsModalOpen(false); // Close modal after successful order submission
    //   })
    //   .catch((error) => {
    //     console.error("Error saving order:", error);
    //   });

    // Retrieve existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    // Add new order to the array
    existingOrders.push(order);

    // Save updated orders back to localStorage
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    console.log("Order saved to localStorage");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button
          className="close-button"
          onClick={() => {
            setIsModalOpen(false);
            setIsServiceDescModalOpen(false);
          }}
        >
          ✖
        </button>

        <h2>
          {serviceData.name} - Step {step}/4
        </h2>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Step 1: Select Garments */}
          {step === 1 && (
            <div>
              <h3>Select Garments & Quantity</h3>
              {serviceData.categories.map((category) => (
                <div key={category}>
                  <label>{category}</label>
                  <input
                    type="number"
                    name={category}
                    min="0"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        garments: {
                          ...prev.garments,
                          [category]: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              ))}
              <button type="button" onClick={nextStep}>
                Next
              </button>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div>
              <h3>Select Pickup & Drop-off Date & Time</h3>
              <label>Pickup Date:</label>
              <input
                type="date"
                name="pickupDate"
                onChange={handleChange}
                required
              />

              <label>Pickup Time:</label>
              <input
                type="time"
                name="pickupTime"
                onChange={handleChange}
                required
              />

              <label>Drop-off Date:</label>
              <input
                type="date"
                name="dropoffDate"
                onChange={handleChange}
                required
              />

              <label>Drop-off Time:</label>
              <input
                type="time"
                name="dropoffTime"
                onChange={handleChange}
                required
              />

              <button type="button" onClick={prevStep}>
                Back
              </button>
              <button type="button" onClick={nextStep}>
                Next
              </button>
            </div>
          )}

          {/* Step 3: Select Address */}
          {step === 3 && (
            <div>
              <h3>Select Address</h3>
              <label>Pickup Address:</label>
              <input
                type="text"
                name="pickupAddress"
                onChange={handleChange}
                required
              />

              <label>
                <input
                  type="checkbox"
                  name="sameAddress"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sameAddress: e.target.checked,
                      dropoffAddress: e.target.checked
                        ? prev.pickupAddress
                        : "",
                    }))
                  }
                />
                Same as pickup
              </label>

              {!formData.sameAddress && (
                <>
                  <label>Drop-off Address:</label>
                  <input
                    type="text"
                    name="dropoffAddress"
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              <button type="button" onClick={prevStep}>
                Back
              </button>
              <button type="button" onClick={nextStep}>
                Next
              </button>
            </div>
          )}

          {/* Step 4: Confirm Order */}
          {step === 4 && (
            <div>
              <h3>Confirm Order</h3>
              <p>
                <strong>Garments:</strong> {JSON.stringify(formData.garments)}
              </p>
              <p>
                <strong>Pickup Date & Time:</strong> {formData.pickupDate} at{" "}
                {formData.pickupTime}
              </p>
              <p>
                <strong>Drop-off Date & Time:</strong> {formData.dropoffDate} at{" "}
                {formData.dropoffTime}
              </p>
              <p>
                <strong>Pickup Address:</strong> {formData.pickupAddress}
              </p>
              <p>
                <strong>Drop-off Address:</strong>{" "}
                {formData.sameAddress
                  ? "Same as Pickup"
                  : formData.dropoffAddress}
              </p>

              <button type="button" onClick={prevStep}>
                Back
              </button>
              <button type="submit" onClick={handleConfirmOrder}>
                Confirm Order
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrderSchedulingForm;
