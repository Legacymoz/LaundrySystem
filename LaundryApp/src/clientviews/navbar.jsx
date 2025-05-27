import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../clientviewcss/navbar.css";
import { useStore } from "../store/zustand"; // Zustand store for state management

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function
  const logout = useStore((state) => state.logoutClient); // Zustand logout function

  const handleLogout = () => {
    logout(); // Call the logout function from Zustand
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="logo-container">
        <h2 className="logo">CleanFlow</h2>
      </div>

      <div className="links-container">
        <ul className="navbar-links">
          <li>
            <button onClick={() => navigate("/client-dashboard")}>Home</button>
          </li>
          <li>
            <button onClick={() => navigate("orders")}>Orders</button>
          </li>
          <li>
            <button onClick={() => navigate("notifications")}>
              Notifications
            </button>
          </li>
          <li
            className="dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)} // Show dropdown on hover
            onMouseLeave={() => setIsDropdownOpen(false)} // Hide dropdown when not hovering
          >
            <button className="dropdown-button">
              Profile <span className="dropdown-arrow">▼</span>
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <button onClick={() => navigate("profile")}>Profile</button>
                </li>
                <li>
                  <button onClick={() => navigate("reports")}>
                    Reports
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
