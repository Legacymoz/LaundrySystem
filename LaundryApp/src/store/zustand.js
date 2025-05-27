import { create } from "zustand";
import api from "../utility/api";
import { toast } from "react-toastify";

export const useStore = create((set, get) => ({
  clientInfo: null,
  isAuthenticated: false,

  setClientInfo: (userData) => {
    console.log("Setting client info:", userData); // Log the user data
    set({
      clientInfo: userData,
      isAuthenticated: true,
    });
    localStorage.setItem("clientInfo", JSON.stringify(userData)); // Save to localStorage
    console.log("Updated state:", get().clientInfo);
  },
  initializeClientInfo: () => {
    const storedClientInfo = localStorage.getItem("clientInfo");
    if (storedClientInfo) {
      set({
        clientInfo: JSON.parse(storedClientInfo),
        isAuthenticated: true,
      });
      console.log(
        "Restored client info from localStorage:",
        JSON.parse(storedClientInfo)
      );
    }
  },

  adminInfo: null,
  isAdminAuthenticated: false,

  setAdminInfo: (adminData) => {
    console.log("Setting admin info:", adminData); // Log the admin data
    set({
      adminInfo: adminData,
      isAdminAuthenticated: true,
    });
    localStorage.setItem("adminInfo", JSON.stringify(adminData)); // Save to localStorage
    console.log("Updated state:", get().adminInfo);
  },

  initializeAdminInfo: () => {
    const storedAdminInfo = localStorage.getItem("adminInfo");
    if (storedAdminInfo) {
      set({
        adminInfo: JSON.parse(storedAdminInfo),
        isAdminAuthenticated: true,
      });
      console.log(
        "Restored admin info from localStorage:",
        JSON.parse(storedAdminInfo)
      );
    }
  },

  clientOrders: [],

  loadOrders: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`); // Use the id parameter in the API endpoint

      set({ clientOrders: response.data });
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  },

  allOrders: [],
  loadAllOrders: async () => {
    try {
      const response = await api.get("/orders"); // Fetch from data folder
      set({ allOrders: response.data });
      console.log("All orders loaded:", response.data); // Log the loaded orders
    } catch (error) {
      console.error("Error loading all orders:", error);
    }
  },

  services: [],

  loadServices: async () => {
    try {
      const response = await api.get("/services"); // Fetch from data folder

      set({ services: response.data });
      console.log("Services loaded:", response.data); // Log the loaded services
    } catch (error) {
      console.error("Error loading services:", error);
    }
  },

  // Add a new service
  addService: async (service) => {
    try {
      const response = await api.post("/services", service);
      set((state) => ({
        services: [...state.services, response.data], // Add the new service to the state
      }));
      console.log("Service added:", response.data);
    } catch (error) {
      console.error("Error adding service:", error);
    }
  },

  // Edit an existing service
  editService: async (title, updatedData) => {
    try {
      const response = await api.patch(`/services/${title}`, updatedData);
      set((state) => ({
        services: state.services.map((service) =>
          service.title === title ? response.data : service
        ), // Update the service in the state
      }));
      console.log("Service updated:", response.data);
      toast.success("Service updated successfully!");
      
    } catch (error) {
      console.error("Error editing service:", error);
      toast.error(
        error.response?.data?.message || "Failed to update service. Please try again."
      );
    }
  },

  // Delete a service
  deleteService: async (title) => {
    try {
      await api.delete(`/services/${title}`);
      set((state) => ({
        services: state.services.filter((service) => service.title !== title), // Remove the service from the state
      }));
      console.log(`Service with title "${title}" deleted.`);
    } catch (error) {
      console.error("Error deleting service:", error);
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
      const response = await api.get(`/notifications/${customerID}`); // Fetch notifications for the customer
      set({ notifications: response.data }); // Update the notifications state
      console.log("Notifications loaded:", response.data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  },
  readNotification: async (notificationID) => {
    try {
      const response = await api.patch(`/notifications/${notificationID}/read`); // Mark the notification as read
      const updatedNotification = response.data.notification;

      // Update the notifications state
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif._id === notificationID ? updatedNotification : notif
        ),
      }));

      console.log("Notification marked as read:", updatedNotification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  users: [],
  loadUsers: async () => {
    try {
      const response = await api.get("/auth/users"); // Fetch from data folder
      set({ users: response.data });
      console.log("Users loaded:", response.data); // Log the loaded users
    } catch (error) {
      console.error("Error loading users:", error);
    }
  },

  selectedOrder: {},
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  clearSelectedOrder: () => set({ selectedOrder: null }),

  selectedCustomer: {},
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  clearSelectedCustomer: () => set({ selectedCustomer: null }),

  // Update the state of an order
  updateState: async (orderId) => {
    try {
      const response = await api.patch(`/orders/${orderId}/state`); // Call the API endpoint
      const updatedOrder = response.data.order;

      // Update the order in the allOrders state
      set((state) => ({
        allOrders: state.allOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        ),
      }));

      console.log("Order state updated:", updatedOrder);
      return { success: true, message: "Order state updated successfully" };
    } catch (error) {
      console.error("Error updating order state:", error);
      return { success: false, message: "Failed to update order state" };
    }
  },

  // Logout function
  logoutClient: () => {
    set({
      clientInfo: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("clientInfo"); // Clear user data from localStorage
    console.log("User logged out");
  },

  logoutAdmin: () => {
    set({
      adminInfo: null,
      isAdminAuthenticated: false,
    });
    localStorage.removeItem("adminInfo"); // Clear user data from localStorage
    console.log("Admin User logged out");
  },

  pickupTimeslots: [],
  dropoffTimeslots: [],
  timeMessage: { pickup: "", dropoff: "" },

  fetchTimeslots: async (date, type) => {
    try {
      const response = await api.get(`/timeslots?date=${date}`);
      const slots = response.data.flatMap((item) => item.slots || []);
      if (slots.length > 0) {
        set({
          [type === "pickup" ? "pickupTimeslots" : "dropoffTimeslots"]: slots,
          timeMessage: {
            ...get().timeMessage,
            [type]: "", // Clear the message if slots are available
          },
        });
      } else {
        set({
          [type === "pickup" ? "pickupTimeslots" : "dropoffTimeslots"]: [],
          timeMessage: {
            ...get().timeMessage,
            [type]:
              response.data.message || "No available times for this date.",
          },
        });
      }
    } catch (error) {
      console.error(`Error fetching ${type} times:`, error);
      set({
        [type === "pickup" ? "pickupTimeslots" : "dropoffTimeslots"]: [],
        timeMessage: {
          ...get().timeMessage,
          [type]:
            error.response?.data?.message ||
            "An error occurred while fetching times.",
        },
      });
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      console.log("User registered successfully:", response.data);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Error registering user:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred during registration.",
      };
    }
  },
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/auth/users/${userId}`);
      console.log("User deleted successfully:", response.data);

      // Update the users list in the Zustand store
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
      }));

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while deleting the user.",
      };
    }
  },

  createOrder: async (order) => {
    try {
      const response = await api.post("/orders", order);
      toast.success("Order created successfully!");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the order."
      );
      return { success: false, error };
    }
  },

  // Update profile function
  updateProfile: async (formDataToSend) => {
    try {
      console.log("Form Data to send:", formDataToSend); // Log the form data
      const response = await api.patch("/auth/profile", formDataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      const user = response.data.user;

      // Check the role and update the appropriate state
      if (user.roles.includes("admin")) {
        get().setAdminInfo(user); // Use setAdminInfo for admin
      } else {
        get().setClientInfo(user); // Use setClientInfo for client
      }

      console.log("Profile updated successfully:", user);
      toast.success("Profile updated successfully!");
      return { success: true, user: user };
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating your profile."
      );
      return { success: false, error };
    }
  },

  drivers: [],

  // Fetch all drivers
  loadDrivers: async () => {
    try {
      const response = await api.get("/drivers");
      set({ drivers: response.data });
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  },

  addDriver: async (driver) => {
    try {
      const response = await api.post("/drivers", driver);
      toast.success("Driver added successfully!");
      return response.data;
    } catch (error) {
      console.error("Error adding driver:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding the driver."
      );
    }
  },

  // Assign an order to a driver's pickupOrders array
  assignOrdersToDriver: async (driverId, orders) => {
    try {
      const response = await api.post(
        `/drivers/${driverId}/assign-orders`,
        orders
      );
      toast.success("Orders assigned successfully!");
      return response.data;
    } catch (error) {
      console.error("Error assigning orders:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while assigning orders."
      );
    }
  },

  // Assign a driver to an order
  assignDriverToOrder: async (orderId, driverId) => {
    try {
      const response = await api.patch(`/orders/${orderId}/assign-driver`, {
        driverId,
      });
      toast.success("Driver assigned successfully!");
      return response.data;
    } catch (error) {
      console.error("Error assigning driver:", error);
      toast.error("An error occurred while assigning the driver.");
    }
  },

  selectedDriver: {},
  setSelectedDriver: (driver) => set({ selectedDriver: driver }),
  clearSelectedDriver: () => set({ selectedDriver: null }),

  deleteDriver: async (driverId) => {
    try {
      await api.delete(`/drivers/${driverId}`); // Correct endpoint
      set((state) => ({
        drivers: state.drivers.filter((driver) => driver._id !== driverId),
      }));
    } catch (error) {
      console.error("Error deleting driver:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  },

  makePayment: async (paymentData, setLoading) => {
    setLoading(true);

    try {
      const response = await api.post("/mpesa/stkpush", paymentData);
      toast.success(
        response.data.message || "STK Push initiated successfully!"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to initiate STK Push. Please try again."
      );
    } finally {
      setLoading(false);
    }
  },

  payments: [], // Holds payments for a specific customer
  allPayments: [], // Holds all payments

  // Function to fetch payments for a specific customer
  loadPayments: async (customerID) => {
    try {
      const response = await api.get(`mpesa/payments/customer/${customerID}`);
      set({ payments: response.data });
      toast.success("Payments loaded successfully!");
    } catch (error) {
      console.error("Error loading payments for customer:", error);
      toast.error(
        error.response?.data?.message || "Failed to load payments for customer."
      );
    }
  },

  // Function to fetch all payments
  loadAllPayments: async () => {
    try {
      const response = await api.get("mpesa/payments");
      set({ allPayments: response.data });
      toast.success("All payments loaded successfully!");
    } catch (error) {
      console.error("Error loading all payments:", error);
      toast.error(
        error.response?.data?.message || "Failed to load all payments."
      );
    }
  },
}));
