import React from "react";
import "../clientviewcss/ServiceDescriptionModal.css"; // Import CSS for modal styling
import { useStore } from "../store/zustand";
import OrderSchedulingForm from "./orderSchedulingForm";


const ServiceDescriptionModal = ({ service, onClose }) => {
  const setIsModalOpen = useStore((state) => state.setIsModalOpen);
  const isModalOpen = useStore((state) => state.isModalOpen);
  const setIsServiceDescModalOpen = useStore((state) => state.setIsServiceDescModalOpen);

  if (!service) return null; // Don't render anything if no service is selected
  console.log("Selected Service:", service);

  const handleOrderClick = () => {
    console.log("Inside handleServeice click");

    // setIsServiceDescModalOpen(false);
    setIsModalOpen(true); // Open modal when a service is selected
    
  };

  const handleCloseModal = () => {
    setIsServiceDescModalOpen(false); // Close modal
  }


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleCloseModal}>
          ✖
        </button>
        <h2>{service.name}</h2>
        <p>{service.description}</p>
        <button className="order-button" onClick={handleOrderClick}>
          Order
        </button>
      </div>
      {isModalOpen && <OrderSchedulingForm />}
    </div>
  );
};

export default ServiceDescriptionModal;
