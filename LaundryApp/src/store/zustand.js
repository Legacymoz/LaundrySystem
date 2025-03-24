import { create } from "zustand";
import axios from "axios";

export const useStore = create((set) => ({
  orders: [],

  loadOrders: async () => {
    try {
      // const response = await fetch("src/data/orders.json"); // Fetch from data folder
      const response = await fetch(
        "https://dummyjson.com/c/8a65-d661-4d3c-982b"
      ); // Fetch from data folder
      const data = await response.json();
      set({ orders: data });
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  },

  services: [],
  // Load services from a local JSON file
  loadServices: async () => {
    try {
      // const response = await fetch("src/data/service.json"); // Fetch from data folder
      const response = await fetch(
        "https://dummyjson.com/c/7ed3-90ed-4a35-b096"
      ); // Fetch from data folder
      const data = await response.json();
      set({ services: data });
    } catch (error) {
      console.error("Error loading services:", error);
    }
  },

  selectedService: {},
  setSelectedService: (service) => set({ selectedService: service }),
  clearSelectedService: () => set({ selectedService: null }),

  isModalOpen: false,
  // Function to toggle modal visibility
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  isServiceDescModalOpen: false, // Properly initialize the state
  setIsServiceDescModalOpen: (isOpen) =>
    set({ isServiceDescModalOpen: isOpen }),

  customer: {
    id: "CUST1001",
    name: "John Doe", // Replace with actual customer name
  },

  notifications: [],

  loadNotifications: async (customerID) => {
    try {
      //   const response = await axios.get(
      //     `/api/notifications?customerID=${customerID}`
      //   );

      // const response = await axios.get("src/data/notifications.json");
      const response = await axios.get(
        "https://dummyjson.com/c/f1d3-9798-441e-9655"
      );
      set({ notifications: response.data });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  },
}));
