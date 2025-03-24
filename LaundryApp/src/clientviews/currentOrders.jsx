import React, {useEffect} from "react";
import { useStore } from "../store/zustand";
import "../clientviewcss/currentOrders.css";

const CurrentOrders = () => {
    const orders  = useStore((state) => state.orders);
    const customer = useStore((state) => state.customer);
    const loadOrders = useStore((state) => state.loadOrders);
    console.log("Orders:", orders);
    console.log("OrdersIDs:", orders.orderID);
    console.log("Customer", customer);
    
    useEffect(() => {
      loadOrders();
    }, []);

  
   orders.forEach((order) => {
     console.log("Order ID:", order.orderID);
   });

   const filteredOrders = orders.filter(
     (order) => order.customerID === "CUST1001"
   );
   
   

    // return (
    //   <div className="current-orders-container">
    //     <h2>Current Orders</h2>
    //     {orders && orders.length > 0 ? (
    //       <ul>
    //         {orders.map((order) => (
    //           <li key={order.orderID}>

    //             <p>{order.garment}</p>
  
    //           </li>
    //         ))}
    //       </ul>
    //     ) : (
    //       <p>No active orders</p>
    //     )}
    //   </div>
    // );

    return (
      <div className="current-orders-container">
        <h2>Current Orders</h2>

        {filteredOrders?.length > 0 ? (
          <ul className="orders-list">
            {filteredOrders.map((order) => {
              const {
                orderID,
                garments,
                serviceName,
                totalCost,
                pickupDate,
                pickupTime,
                dropoffDate,
                dropoffTime,
                state,
              } = order;

              return (
                <li key={orderID} className="order-item">
                  <h3>Order ID: {orderID}</h3>
                  <p>
                    <strong>Service:</strong> {serviceName}
                  </p>
                  {/* Ensure garment exists before mapping */}
                  {garments && Object.keys(garments).length > 0 ? (
                    <>
                      <p>
                        <strong>Garments:</strong>
                      </p>
                      <ul>
                        {Object.entries(garments).map(
                          ([garmentType, quantity]) => (
                            <li key={garmentType}>
                              {garmentType}: {quantity}
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  ) : (
                    <p>
                      <strong>Garments:</strong> No garments specified
                    </p>
                  )}
                  <p>
                    <strong>Total Cost:</strong> ${totalCost}
                  </p>
                  <p>
                    <strong>Pickup:</strong> {pickupDate} at {pickupTime}
                  </p>
                  <p>
                    <strong>Drop-off:</strong> {dropoffDate} at {dropoffTime}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${state.toLowerCase()}`}>
                      {state}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="no-orders">No active orders</p>
        )}
      </div>
    );
}

export default CurrentOrders;