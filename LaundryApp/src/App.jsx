import React from 'react';
import './App.css'
import Login from './clientviews/login'
import { Routes, Route } from "react-router-dom";

import ClientDashboard from "./clientviews/client-dashboard";
import AdminDashboard from "./adminview/adminDashboard";
import AdminHomePage from "./adminview/adminHomePage";
import OrderByService from "./adminview/orderByService";
import CustomerList from "./adminview/customersList";
import DriverList from "./adminview/driversList";
import AdminUsersList from "./adminview/adminUsersList";
import AdminProfilePage from "./adminview/adminProfile";
import AdminServicesList from "./adminview/adminServicesList";
import OrdersStates from "./adminview/ordersStates";
import AdminAuth from './authorisation/adminAuth';
import EditServiceForm from './adminview/editServices';
import AddServiceForm from './adminview/addservices';
import OrderDetailsPage from './adminview/orderDetails';
import Signup from './clientviews/signup';
import AllOrders from './clientviews/allOrders';
import NotificationList from './clientviews/myNotifications';
import Profile from './clientviews/profile';
import ClientOrderDetails from './clientviews/clientOrderDetails';
import ClientHomePage from './clientviews/clientHomePage';
import ClientOrderReport from './clientviews/clientOrderReport';
import DriverOrders from './adminview/driverOrders';
import AddDrivers from './adminview/addDrivers';
import DriverProfilePage from './adminview/driverProfile';
import EditAdminProfilePage from './adminview/editAdminProfile';
import RegisterUser from './adminview/addUser';
import CustomerDetailsPage from './adminview/customerDetails';
import AdminOrderReports from './adminview/adminOrderReports';
import MpesaPayment from './clientviews/payment';
import ClientPaymentRecord from './clientviews/clientPaymentRecord';
import PaymentReport from './adminview/paymentReport';
import ClientReports from './clientviews/clientReports';


function App() {
 

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/client-dashboard" element={<ClientDashboard />}>
          {/* Default Route for Admin Dashboard */}
          <Route index element={<ClientHomePage />} />

          {/* Nested Routes*/}
          <Route path="orders" element={<AllOrders />} />
          <Route path="notifications" element={<NotificationList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="order-details" element={<ClientOrderDetails />} />
          <Route path="order-reports" element={<ClientOrderReport />} />
          <Route path="payment-reports" element={<ClientPaymentRecord />} />
          <Route path="payment" element={<MpesaPayment />} />
          <Route path="reports" element={<ClientReports />} />
        </Route>

        {/* Admin-Side Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminAuth>
              <AdminDashboard />
            </AdminAuth>
          }
        >
          {/* Default Route for Admin Dashboard */}
          <Route index element={<AdminHomePage />} />

          {/* Nested Routes */}
          <Route path="orders-by-service" element={<OrderByService />} />
          <Route path="orders-states" element={<OrdersStates />} />
          <Route path="services" element={<AdminServicesList />} />
          <Route path="customers" element={<CustomerList />} />
          <Route
            path="customers/customer-details"
            element={<CustomerDetailsPage />}
          />
          <Route path="drivers" element={<DriverList />} />
          <Route path="drivers/add-driver" element={<AddDrivers />} />
          <Route
            path="drivers/driver-profile"
            element={<DriverProfilePage />}
          />
          <Route path="drivers/driver-orders" element={<DriverOrders />} />
          <Route path="admins" element={<AdminUsersList />} />
          <Route path="admin-profile" element={<AdminProfilePage />} />
          <Route
            path="admin-profile/edit-admin-profile"
            element={<EditAdminProfilePage />}
          />

          <Route path="add-user" element={<RegisterUser />} />
          <Route path="services/edit-service" element={<EditServiceForm />} />
          <Route path="services/add-service" element={<AddServiceForm />} />
          <Route path="order-details" element={<OrderDetailsPage />} />
          <Route
            path="/admin-dashboard/order-reports"
            element={<AdminOrderReports />}
          />
          <Route path="payment-reports" element={<PaymentReport />} />
        </Route>
      </Routes>

      {/* <Signup /> */}
      {/* <ServiceList />
      <CurrentOrders /> */}
      {/* <CurrentOrders /> */}
      {/*  */}
    </>
  );
}

export default App
