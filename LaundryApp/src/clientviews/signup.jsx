import { useState } from "react";
import signupImage from "../images/Laundry_wallpaper.jpg";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/zustand";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(""); // Add name field
  const [number, setNumber] = useState(""); // Add number field
  const navigate = useNavigate();
  const registerUser = useStore((state) => state.registerUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const userData = {
      username,
      password,
      email,
      name, // Include name
      number, // Include number
      roles: ["user"], // Default role for new users
    };

    const result = await registerUser(userData);

    if (result.success) {
      toast.success(result.message);

      // Delay navigation to allow the toast to display
      setTimeout(() => {
        navigate("/"); // Redirect to login page
      }, 2000); // 3 seconds delay

    } else {
      toast.error(result.message);
    }
  };

  return (
    <div
      className="signup-page min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${signupImage})` }}
    >
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

      <div
        className="signup-container shadow-md rounded-lg p-8 w-full max-w-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="signup-name" className="block font-medium mb-1">
              Full Name:
            </label>
            <input
              type="text"
              id="signup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-number" className="block font-medium mb-1">
              Phone Number:
            </label>
            <input
              type="text"
              id="signup-number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-username" className="block font-medium mb-1">
              Username:
            </label>
            <input
              type="text"
              id="signup-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email" className="block font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password" className="block font-medium mb-1">
              Password:
            </label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="signup-confirm-password"
              className="block font-medium mb-1"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="signup-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group text-center">
            <a href="/" className="text-blue-500 hover:underline">
              Already have an account?
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

export default Signup;