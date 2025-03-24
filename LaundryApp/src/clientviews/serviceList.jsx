import React, { useEffect } from "react";
import { useStore } from "../store/zustand";
import OrderSchedulingForm from "./orderSchedulingForm";
import "../clientviewcss/serviceList.css";
import ServiceDescriptionModal from "./ServiceDescriptionModal";


const ServiceList = () => {
  const services = useStore((state) => state.services);
  const loadServices = useStore((state) => state.loadServices);
  const selectedService = useStore((state) => state.selectedService);
  const setSelectedService = useStore((state) => state.setSelectedService);
  const clearSelectedService = useStore((state) => state.clearSelectedService);
  const isModalOpen = useStore((state) => state.isModalOpen);
  const isServiceDescModalOpen = useStore((state) => state.isServiceDescModalOpen);
  const setIsServiceDescModalOpen = useStore((state) => state.setIsServiceDescModalOpen);
  

  console.log("isServiceDescModalOpen", isServiceDescModalOpen);
    console.log("isModalOpen", isModalOpen);

  useEffect(() => {
    loadServices(); // Load JSON data on mount
  }, []);

  useEffect(() => {
    console.log("Services:", services);
  }, [services]);

  const handleServiceClick = () => {
    console.log("Inside handleServeice click");
    
    console.log("isServiceDescModalOpen", isServiceDescModalOpen);
    setIsServiceDescModalOpen(true); // Open modal when a service is selected
    
  }
  const handleCloseModal = () => {
    setSelectedService(null); // Close modal
  };


//   return (
//     <div className="allServcies">
//       <div className="serviceCard">
//         <img src="src/images/wash and iron.png" alt="Wash & Iron" />
//         <h2>Wash & Iron</h2>
//         <button>View</button>
//       </div>
//       <div className="serviceCard">
//         <img src="src/images/Iroing.png" alt="Ironing" />
//         <h2>Ironing</h2>
//         <button>View</button>
//       </div>
//       <div className="serviceCard">
//         <img src="src/images/dry cleaning.png" alt="Dry Cleaning" />
//         <h2>Dry cleaning</h2>
//         <button>View</button>
//       </div>
//       <div className="serviceCard">
//         <img src="src/images/duvet.png" alt="Duvet Cleaning" />
//         <h2>Duvet washing</h2>
//         <button>View</button>
//       </div>
//     </div>
//   );
//  return (
//    <div className="allServices">
//      {Object.keys(services).length > 0 ? (
//        Object.keys(services).map((key) => (
//          <div className="serviceCard" key={key}>
//            <img src={`src/images/${key}.png`} alt={services[key].name} />
//            <h2>{services[key].name}</h2>
//            <button onClick={() => setSelectedService(key)}>View</button>

//            {/* Show description only for the selected service */}
//            {selectedService === key && (
//              <div className="serviceDescription">
//                <p>{services[key].description}</p>
//                <br />
//                <button onClick={handleServiceClick}>Order</button>
//                <br />
//                <button onClick={clearSelectedService}>Close</button>
//                <br />
//                <br />
//                <br />
//              </div>
//            )}
//          </div>
//        ))
//      ) : (
//        <p>Loading services...</p>
//      )}
return (
  <div className="serviceContainer">
    <h1>Laundry Services</h1>
    <div className="allServices">
      {services.length > 0 ? (
        services.map((service, index) => (
          <div className="serviceCard" key={service.title || index}>
            <img src={`src/images/${service.title}.png`} alt={service.name} />
            <h2>{service.name}</h2>
            <button
              onClick={() => {
                setSelectedService(service);
                handleServiceClick();
              }}
            >
              View
            </button>
          </div>
        ))
      ) : (
        <p>Loading services...</p>
      )}

      {/* Render the modal if a service is selected */}
      {isServiceDescModalOpen && (
        <ServiceDescriptionModal
          service={selectedService}
          onClose={handleCloseModal}
        />
      )}
    </div>
  </div>
);

};
export default ServiceList;
