import React, { useState, useEffect } from "react";
import { useStore } from "../store/zustand";
import "../clientviewcss/orderSchedulingForm.css";
import api from "../utility/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const OrderSchedulingForm = () => {
  const {
    selectedService,
    services,
    isModalOpen,
    setIsModalOpen,
    setIsServiceDescModalOpen,
    clientInfo,
    pickupTimeslots,
    dropoffTimeslots,
    timeMessage,
    fetchTimeslots,
    createOrder,
  } = useStore();

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

  useEffect(() => {
    if (formData.pickupDate) {
      fetchTimeslots(formData.pickupDate, "pickup");
    }
  }, [formData.pickupDate]);

  useEffect(() => {
    if (formData.dropoffDate) {
      fetchTimeslots(formData.dropoffDate, "dropoff");
    }
  }, [formData.dropoffDate]);

  const serviceData = services.find(
    (service) => service.title === selectedService.title
  );
  console.log("Service Data:", serviceData);

  const calculateTotalCost = () => {
    const { garments } = formData;
    const { prices } = selectedService;

    let totalCost = 0;

    for (const garment in garments) {
      const quantity = parseInt(garments[garment], 10) || 0;
      if (quantity > 0) {
        const price = prices[garment] || 0;
        totalCost += quantity * price;
      }
    }

    return totalCost;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleTimeSelection = (type, time) => {
    setFormData((prev) => ({
      ...prev,
      [type]: time,
    }));
  };

    const validateForm = () => {
    const { garments, pickupDate, pickupTime, dropoffDate, dropoffTime, pickupAddress, dropoffAddress } = formData;
  
    // Check if at least one garment is selected
    const hasGarments = Object.values(garments).some((quantity) => quantity > 0);
  
    // Check if all required fields are filled
    if (
      !hasGarments ||
      !pickupDate ||
      !pickupTime ||
      !dropoffDate ||
      !dropoffTime ||
      !pickupAddress ||
      !dropoffAddress
    ) {
      return false;
    }
  
    return true;
  };

  const handleConfirmOrder = async() => {
    const totalCost = calculateTotalCost();

    // Validate the form
    if (!validateForm()) {
      toast.error(
        "Please fill in all required fields "
      );
      return;
    }

    const order = {
      customerID: clientInfo.id,
      serviceType: selectedService.title,
      garments: formData.garments,
      totalCost,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      dropoffDate: formData.dropoffDate,
      dropoffTime: formData.dropoffTime,
      pickupAddress: formData.pickupAddress,
      dropoffAddress: formData.dropoffAddress,
    };

    const result = await createOrder(order);

    if (result.success) {
      setTimeout(() => {
        setIsModalOpen(false);
        setIsServiceDescModalOpen(false);
      }, 1000); // Delay for 1 second to allow the toast to display
    }
  };

  return (
    <div className="modal">
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

        <h2 className="modal-heading">
          {serviceData.name} - Step {step}/4
        </h2>

        <form onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <div className="form-step">
              <h3 className="form-heading">Select Garments & Quantity</h3>
              {serviceData.categories.map((category) => (
                <div key={category} className="form-group">
                  <label>
                    {category} - Ksh {selectedService.prices[category]}
                  </label>
                  <input
                    type="number"
                    name={category}
                    min="0"
                    value={formData.garments[category] || ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10); // Parse the input value as an integer
                      setFormData((prev) => {
                        const updatedGarments = { ...prev.garments };

                        if (value > 0) {
                          // Add or update the garment with the new quantity
                          updatedGarments[category] = value;
                        } else {
                          // Remove the garment if the quantity is 0
                          delete updatedGarments[category];
                        }

                        return {
                          ...prev,
                          garments: updatedGarments,
                        };
                      });
                    }}
                  />
                </div>
              ))}
              {/* Total Price Section */}
              <div className="total-price">
                <h4>Total Price: Ksh {calculateTotalCost()}</h4>
              </div>
              <div className="form-buttons">
                <button
                  type="button"
                  className="btn btn-next"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h3 className="form-heading">
                Select Pickup & Drop-off Date & Time
              </h3>

              <div className="form-group-date-time">
                <label>Pickup Date:</label>
                <input
                  type="date"
                  name="pickupDate"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group-date-time">
                <label>Pickup Time:</label>
                {pickupTimeslots.length > 0 ? (
                  <div className="time-buttons">
                    {pickupTimeslots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`time-button ${
                          formData.pickupTime === slot.time ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleTimeSelection("pickupTime", slot.time)
                        }
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="time-message">{timeMessage.pickup}</p>
                )}
              </div>

              <div className="form-group-date-time">
                <label>Drop-off Date:</label>
                <input
                  type="date"
                  name="dropoffDate"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group-date-time">
                <label>Drop-off Time:</label>
                {dropoffTimeslots.length > 0 ? (
                  <div className="time-buttons">
                    {dropoffTimeslots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`time-button ${
                          formData.dropoffTime === slot.time ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleTimeSelection("dropoffTime", slot.time)
                        }
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="time-message">{timeMessage.dropoff}</p>
                )}
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="btn btn-back"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-next"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h3 className="form-heading">Select Address</h3>
              <label>Pickup Address:</label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pickupAddress: e.target.value,
                    dropoffAddress: prev.sameAddress
                      ? e.target.value
                      : prev.dropoffAddress, // Update dropoffAddress if "Same as Pickup" is checked
                  }))
                }
                required
              />

              <label>
                <input
                  type="checkbox"
                  name="sameAddress"
                  checked={formData.sameAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sameAddress: e.target.checked,
                      dropoffAddress: e.target.checked
                        ? prev.pickupAddress
                        : "", // Copy pickupAddress or clear dropoffAddress
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
                    value={formData.dropoffAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dropoffAddress: e.target.value,
                      }))
                    }
                    required
                  />
                </>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  className="btn btn-back"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-next"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step">
              <h3 className="form-heading">Confirm Order</h3>
              <div className="confirmation-details">
                <table className="confirmation-table">
                  <tbody>
                    <tr>
                      <th>Garments</th>
                      <td>
                        <ul className="garments-list">
                          {Object.entries(formData.garments).map(
                            ([garment, quantity]) => (
                              <li key={garment}>
                                {garment}: {quantity}
                              </li>
                            )
                          )}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <th>Total Cost</th>
                      <td>Ksh {calculateTotalCost()}</td>
                    </tr>
                    <tr>
                      <th>Pickup Date & Time</th>
                      <td>
                        {formData.pickupDate} at {formData.pickupTime}
                      </td>
                    </tr>
                    <tr>
                      <th>Drop-off Date & Time</th>
                      <td>
                        {formData.dropoffDate} at {formData.dropoffTime}
                      </td>
                    </tr>
                    <tr>
                      <th>Pickup Address</th>
                      <td>{formData.pickupAddress}</td>
                    </tr>
                    <tr>
                      <th>Drop-off Address</th>
                      <td>{formData.dropoffAddress}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="btn btn-back"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-confirm"
                  onClick={handleConfirmOrder}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrderSchedulingForm;
