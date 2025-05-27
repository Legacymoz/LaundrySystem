import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend URL
  withCredentials: true, // Include cookies in requests
});

export default api;