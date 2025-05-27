import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utility/api";
import { useStore } from "../store/zustand";
import loginImage from "../images/Laundry_wallpaper.jpg"; // Use the same or a different image
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState(""); // State to store error messages
  const navigate = useNavigate();
  const clientInfo = useStore((state) => state.clientInfo);
  const setClientInfo = useStore((state) => state.setClientInfo); // Zustand action to set client info
  const setAdminInfo = useStore((state) => state.setAdminInfo); // Zustand action to set admin info

  useEffect(() => {
    console.log("This is my client Info", clientInfo);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { user } = response.data;
      console.log("this is my user data", user);

      

      // Show success toast
      toast.success("Login successful!");

      // Delay navigation to allow the toast to display
      setTimeout(() => {
        if (user.roles.includes("admin")) {
          setAdminInfo(user); // Set admin info in Zustand store
          navigate("/admin-dashboard");
        } else {
          setClientInfo(user);
          navigate("/client-dashboard");
        }
      }, 1000); // 1 seconds delay

    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        setError(err.response.data.message);
        toast.error(err.response.data.message); // Use the message from the API
      } else {
        toast.error("An error occurred. Please try again.");
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div
      className="login-page min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      {/* Toast Container */}
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

      {/* Login Form Container */}
      <div
        className="login-container shadow-md rounded-lg p-8 w-full max-w-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="username" className="block font-medium mb-1">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group relative">
            <label htmlFor="password" className="block font-medium mb-1">
              Password:
            </label>
            <input
              type={showPassword ? "text" : "password"} // Toggle input type
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && (
            <p className="text-center mb-4" style={{ color: "red" }}>
              {error}
            </p>
          )}
          <div className="form-group text-center">
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
            <br />
            <a href="/signup" className="text-blue-500 hover:underline">
              Don't have an account?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;