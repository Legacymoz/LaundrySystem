// // import React, { useEffect, useState } from "react";
// // import { useStore } from "../store/zustand";

// // const ServiceList = () => {
// //   const services = useStore((state) => state.services); // Zustand store for services
// //   const loadServices = useStore((state) => state.loadServices); // Zustand action to load services

// //   const [serviceList, setServiceList] = useState([]);

// //   useEffect(() => {
// //     // Load services when the component mounts
// //     loadServices();
// //   }, [loadServices]);

// //   useEffect(() => {
// //     // Update the service list whenever services are updated
// //     setServiceList(services);
// //   }, [services]);

// //   return (
// //     <div>
// //       <h2>Service List</h2>
// //       {serviceList.length > 0 ? (
// //         <table>
// //           <thead>
// //             <tr>
// //               <th>Name</th>
// //               <th>Title</th>
// //               <th>Action</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {serviceList.map((service) => (
// //               <tr key={service._id}>
// //                 <td>{service.name}</td>
// //                 <td>{service.title}</td>
// //                 <td>
// //                   <button onClick={() => handleDetails(service._id)}>
// //                     Details
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       ) : (
// //         <p>No services found.</p>
// //       )}
// //     </div>
// //   );

// //   // Handle the "Details" button click
// //   function handleDetails(serviceId) {
// //     console.log("Service ID:", serviceId);
// //     // Add logic to navigate to a details page or display service details
// //   }
// // };

// // export default ServiceList;

// import React, { useEffect, useState } from "react";
// import { useStore } from "../store/zustand";
// import { useNavigate } from "react-router-dom"; // For navigation

// const AdminServiceList = () => {
//   const services = useStore((state) => state.services); // Zustand store for services
//   const loadServices = useStore((state) => state.loadServices); // Zustand action to load services
//   const setSelectedService = useStore((state) => state.setSelectedService); // Zustand action to set selected service
//   const navigate = useNavigate(); // React Router's navigation hook

//   const [serviceList, setServiceList] = useState([]);

//   useEffect(() => {
//     // Load services when the component mounts
//     loadServices();
//   }, [loadServices]);

//   useEffect(() => {
//     // Update the service list whenever services are updated
//     setServiceList(services);
//   }, [services]);

//   const handleEdit = (service) => {
//     setSelectedService(service); // Set the selected service in Zustand
//     navigate("/edit-service"); // Navigate to the EditServiceForm page
//   };

//   return (
//     <div>
//       <h2>Service List</h2>
//       {serviceList.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Title</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {serviceList.map((service) => (
//               <tr key={service._id}>
//                 <td>{service.name}</td>
//                 <td>{service.title}</td>
//                 <td>
//                   <button onClick={() => handleEdit(service)}>Edit</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No services found.</p>
//       )}
//     </div>
//   );
// };

// export default AdminServiceList;

import React, { useEffect, useState } from "react";
import { useStore } from "../store/zustand";
import { useNavigate } from "react-router-dom"; // For navigation
import "../adminviewcss/myServiceList.css"; // Import CSS for styling

const AdminServiceList = () => {
  const services = useStore((state) => state.services); // Zustand store for services
  const loadServices = useStore((state) => state.loadServices); // Zustand action to load services
  const setSelectedService = useStore((state) => state.setSelectedService); // Zustand action to set selected service
  const deleteService = useStore((state) => state.deleteService); // Zustand action to delete a service
  const navigate = useNavigate(); // React Router's navigation hook

  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    // Load services when the component mounts
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    // Update the service list whenever services are updated
    setServiceList(services);
  }, [services]);

  const handleEdit = (service) => {
    setSelectedService(service); // Set the selected service in Zustand
    navigate("edit-service");// Navigate to the EditServiceForm page
  };

  const handleDelete = (title) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteService(title); // Call Zustand's deleteService function
    }
  };

  return (
    <div className="admin-services-container">
      <h2 className="title">Service List</h2>
      <div className="add-button">
        <button onClick={() => navigate("add-service")}>Add Service</button>
      </div>
      {serviceList.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceList.map((service) => (
              <tr key={service._id}>
                <td>{service.name}</td>
                <td>{service.title}</td>
                <td>
                  <div className="my-buttons">
                    <div className="edit-button">
                      <button onClick={() => handleEdit(service)}>Edit</button>
                    </div>
                    <div className="delete-button">
                      <button onClick={() => handleDelete(service.title)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No services found.</p>
      )}
    </div>
  );
};

export default AdminServiceList;
