import React from 'react';
import './App.css'
import Login from './clientviews/login'
import Signup from './clientviews/signup';
import CurrentOrders from './clientviews/currentOrders';
import ServiceList from './clientviews/serviceList';
import NotificationList from './clientviews/myNotifications';

function App() {
 

  return (
    <>
      <p className="text-4xl font-bold underline">Hello world!</p>
      <br /><br />
      {/* <Login />
      <Signup /> */}
      <ServiceList />
      <CurrentOrders />
      {/* <CurrentOrders /> */}
      {/* <NotificationList /> */}

    </>
  );
}

export default App
