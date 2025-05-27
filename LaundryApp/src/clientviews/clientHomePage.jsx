import React, { useEffect } from "react";
import Navbar from "./navbar";
import { useStore } from "../store/zustand";
import ServiceList from "./serviceList";
import CurrentOrders from "./currentOrders";

const ClientHomePage = () => {
  const clientInfo = useStore((state) => state.clientInfo);
  const initializeClientInfo = useStore((state) => state.initializeClientInfo);

  useEffect(() => {
    initializeClientInfo(); // Restore clientInfo from localStorage
  }, [initializeClientInfo]);

  console.log("Client Info:", clientInfo); // Log the client info

  if (!clientInfo) {
    return <p>Loading...</p>; // Show a loading message while restoring state
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="pl-5">
        <h1 className="text-4xl font-bold ">Welcome,</h1>
        <h2 className="text-2xl mt-2">{clientInfo.name}</h2>
      </div>
      <ServiceList />
      <CurrentOrders />
    </div>
  );
};

export default ClientHomePage;