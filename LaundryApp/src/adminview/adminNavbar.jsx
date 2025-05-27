// import React, { useState } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { useStore } from "../store/zustand";

// const LeftNavBar = () => {
//   const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false); // State for toggling Orders dropdown
//   const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false); // State for toggling Users dropdown
//   const location = useLocation(); // Get the current route
//   const logout = useStore((state) => state.logoutAdmin); // Zustand logout function
//   const navigate = useNavigate();

//   const toggleOrdersDropdown = () => {
//     setIsOrdersDropdownOpen(!isOrdersDropdownOpen);
//   };

//   const toggleUsersDropdown = () => {
//     setIsUsersDropdownOpen(!isUsersDropdownOpen);
//   };

//   const handleLogout = () => {
//     logout(); // Call the Zustand logout function
//     navigate("/"); // Redirect to the login page
//   };

//   // Check if the current route matches any of the "Orders" dropdown routes
//   const isOrdersActive =
//     location.pathname.includes("orders-by-service") ||
//     location.pathname.includes("orders-states");

//   // Check if the current route matches any of the "Users" dropdown routes
//   const isUsersActive =
//     location.pathname.includes("customers") ||
//     location.pathname.includes("drivers") ||
//     location.pathname.includes("admins");

//   return (
//     <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
//       <h2 className="text-2xl font-bold text-center py-4">Laundry Admin</h2>
//       <nav className="flex flex-col space-y-2 px-4">
//         {/* Home */}
//         <NavLink
//           to="/admin-dashboard"
//           end
//           className={({ isActive }) =>
//             `py-2 px-4 rounded hover:bg-gray-700 ${
//               isActive ? "bg-gray-700" : ""
//             }`
//           }
//         >
//           Home
//         </NavLink>

//         {/* Orders */}
//         <div className="bg-gray-800">
//           <button
//             onClick={toggleOrdersDropdown}
//             className={`w-full text-left py-2 px-4 rounded flex items-center justify-between hover:bg-gray-700 ${
//               isOrdersActive ? "bg-gray-800" : ""
//             }`}
//           >
//             Orders
//             <span>{isOrdersDropdownOpen ? "▲" : "▼"}</span>
//           </button>
//           {isOrdersDropdownOpen && (
//             <div className="ml-4 mt-2 space-y-1 bg-gray-800 rounded px-2 py-2">
//               <NavLink
//                 to="orders-by-service"
//                 className={({ isActive }) =>
//                   `block py-2 px-4 rounded hover:bg-gray-600 ${
//                     isActive ? "bg-gray-600" : ""
//                   }`
//                 }
//               >
//                 Services
//               </NavLink>
//               <hr className="border-gray-700 my-2" />
//               <NavLink
//                 to="orders-states"
//                 className={({ isActive }) =>
//                   `block py-2 px-4 rounded hover:bg-gray-600 ${
//                     isActive ? "bg-gray-600" : ""
//                   }`
//                 }
//               >
//                 States
//               </NavLink>
//             </div>
//           )}
//         </div>

//         {/* Services */}
//         <NavLink
//           to="services"
//           className={({ isActive }) =>
//             `py-2 px-4 rounded hover:bg-gray-700 ${
//               isActive ? "bg-gray-700" : ""
//             }`
//           }
//         >
//           Services
//         </NavLink>

//         {/* Users */}
//         <div className="bg-gray-800">
//           <button
//             onClick={toggleUsersDropdown}
//             className={`w-full text-left py-2 px-4 rounded flex items-center justify-between hover:bg-gray-700 ${
//               isUsersActive ? "bg-gray-800" : ""
//             }`}
//           >
//             Users
//             <span>{isUsersDropdownOpen ? "▲" : "▼"}</span>
//           </button>
//           {isUsersDropdownOpen && (
//             <div className="ml-4 mt-2 space-y-1 bg-gray-800 rounded px-2 py-2">
//               <NavLink
//                 to="customers"
//                 className={({ isActive }) =>
//                   `block py-2 px-4 rounded hover:bg-gray-600 ${
//                     isActive ? "bg-gray-600" : ""
//                   }`
//                 }
//               >
//                 Customers
//               </NavLink>
//               <hr className="border-gray-700 my-2" />
//               <NavLink
//                 to="drivers"
//                 className={({ isActive }) =>
//                   `block py-2 px-4 rounded hover:bg-gray-600 ${
//                     isActive ? "bg-gray-600" : ""
//                   }`
//                 }
//               >
//                 Drivers
//               </NavLink>
//               <hr className="border-gray-700 my-2" />
//               <NavLink
//                 to="admins"
//                 className={({ isActive }) =>
//                   `block py-2 px-4 rounded hover:bg-gray-600 ${
//                     isActive ? "bg-gray-600" : ""
//                   }`
//                 }
//               >
//                 Admins
//               </NavLink>
//             </div>
//           )}
//         </div>

//         <NavLink
//           to="/admin-dashboard/order-reports"
//           className={({ isActive }) =>
//             `py-2 px-4 rounded hover:bg-gray-700 ${
//               isActive ? "bg-gray-700" : ""
//             }`
//           }
//         >
//           Order Reports
//         </NavLink>

//         {/* Profile */}
//         <NavLink
//           to="admin-profile"
//           className={({ isActive }) =>
//             `py-2 px-4 rounded hover:bg-gray-700 ${
//               isActive ? "bg-gray-700" : ""
//             }`
//           }
//         >
//           Profile
//         </NavLink>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           className="w-full text-left py-2 px-4 rounded flex items-center justify-between"
//         >
//           Logout
//         </button>
//       </nav>
//     </div>
//   );
// };

// export default LeftNavBar;

import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store/zustand";

const LeftNavBar = () => {
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false); // State for toggling Orders dropdown
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false); // State for toggling Users dropdown
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false); // State for toggling Reports dropdown
  const location = useLocation(); // Get the current route
  const logout = useStore((state) => state.logoutAdmin); // Zustand logout function
  const navigate = useNavigate();

  const toggleOrdersDropdown = () => {
    setIsOrdersDropdownOpen(!isOrdersDropdownOpen);
  };

  const toggleUsersDropdown = () => {
    setIsUsersDropdownOpen(!isUsersDropdownOpen);
  };

  const toggleReportsDropdown = () => {
    setIsReportsDropdownOpen(!isReportsDropdownOpen);
  };

  const handleLogout = () => {
    logout(); // Call the Zustand logout function
    navigate("/"); // Redirect to the login page
  };

  // Check if the current route matches any of the "Orders" dropdown routes
  const isOrdersActive =
    location.pathname.includes("orders-by-service") ||
    location.pathname.includes("orders-states");

  // Check if the current route matches any of the "Users" dropdown routes
  const isUsersActive =
    location.pathname.includes("customers") ||
    location.pathname.includes("drivers") ||
    location.pathname.includes("admins");

  // Check if the current route matches any of the "Reports" dropdown routes
  const isReportsActive = location.pathname.includes("order-reports");

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <h2 className="text-2xl font-bold text-center py-4">Laundry Admin</h2>
      <nav className="flex flex-col space-y-2 px-4">
        {/* Home */}
        <NavLink
          to="/admin-dashboard"
          end
          className={({ isActive }) =>
            `py-2 px-4 rounded hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          Home
        </NavLink>

        {/* Orders */}
        <div className="bg-gray-800">
          <button
            onClick={toggleOrdersDropdown}
            className={`w-full text-left py-2 px-4 rounded flex items-center justify-between hover:bg-gray-700 ${
              isOrdersActive ? "bg-gray-800" : ""
            }`}
          >
            Orders
            <span>{isOrdersDropdownOpen ? "▲" : "▼"}</span>
          </button>
          {isOrdersDropdownOpen && (
            <div className="ml-4 mt-2 space-y-1 bg-gray-800 rounded px-2 py-2">
              <NavLink
                to="orders-by-service"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded hover:bg-gray-600 ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                Services
              </NavLink>
              <hr className="border-gray-700 my-2" />
              <NavLink
                to="orders-states"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded hover:bg-gray-600 ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                States
              </NavLink>
            </div>
          )}
        </div>

        {/* Services */}
        <NavLink
          to="services"
          className={({ isActive }) =>
            `py-2 px-4 rounded hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          Services
        </NavLink>

        {/* Users */}
        <div className="bg-gray-800">
          <button
            onClick={toggleUsersDropdown}
            className={`w-full text-left py-2 px-4 rounded flex items-center justify-between hover:bg-gray-700 ${
              isUsersActive ? "bg-gray-800" : ""
            }`}
          >
            Users
            <span>{isUsersDropdownOpen ? "▲" : "▼"}</span>
          </button>
          {isUsersDropdownOpen && (
            <div className="ml-4 mt-2 space-y-1 bg-gray-800 rounded px-2 py-2">
              <NavLink
                to="customers"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded hover:bg-gray-600 ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                Customers
              </NavLink>
              <hr className="border-gray-700 my-2" />
              <NavLink
                to="drivers"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded hover:bg-gray-600 ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                Drivers
              </NavLink>
              <hr className="border-gray-700 my-2" />
              <NavLink
                to="admins"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded hover:bg-gray-600 ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                Admins
              </NavLink>
            </div>
          )}
        </div>

        {/* Reports */}
        <div className="bg-gray-800">
          <button
            onClick={toggleReportsDropdown}
            className={`w-full text-left py-2 px-4 rounded flex items-center justify-between hover:bg-gray-700 ${
              isReportsActive ? "bg-gray-800" : ""
            }`}
          >
            Reports
            <span>{isReportsDropdownOpen ? "▲" : "▼"}</span>
          </button>
          {isReportsDropdownOpen && (
            <div className="ml-4 mt-2 space-y-1 bg-gray-800 rounded px-2 py-2">
              <NavLink
                to="/admin-dashboard/order-reports"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded hover:bg-gray-600 ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                Orders
              </NavLink>
              <NavLink
                to="/admin-dashboard/payment-reports"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded hover:bg-gray-600 ${
                    isActive ? "bg-gray-600" : ""
                  }`
                }
              >
                Payments
              </NavLink>
            </div>
          )}
        </div>

        {/* Profile */}
        <NavLink
          to="admin-profile"
          className={({ isActive }) =>
            `py-2 px-4 rounded hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          Profile
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full text-left py-2 px-4 rounded flex items-center justify-between"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default LeftNavBar;
