import { Navigate } from "react-router-dom";
const AdminAuth = ({ children }) => {
  
  const user = JSON.parse(localStorage.getItem("adminInfo")); // or from context

  if (!user?.roles?.includes("admin")) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminAuth;
