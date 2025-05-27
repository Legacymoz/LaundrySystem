import React, { useEffect, useState } from "react";
import "../adminviewcss/summary.css"; // Import your CSS file for styling
import { useStore } from "../store/zustand";

const Summary = () => {
    const orders = useStore((state) => state.allOrders);
    const users = useStore((state) => state.users);
    const income= 0; //rectify this after payment integration
    const loadAllOrders = useStore((state) => state.loadAllOrders);
    const loadUsers = useStore((state) => state.loadUsers);

    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);

    useEffect(() => {
        loadAllOrders();
        loadUsers();
    }, [loadAllOrders, loadUsers]);

    useEffect(() => {
      setTotalOrders(orders.length);
      setTotalUsers(users.length);

      // Calculate total income
      const income = orders
        .filter((order) => order.payment !== "pending") // Filter orders with payment not pending
        .reduce((sum, order) => sum + order.totalCost, 0); // Sum up the totalCost
      setTotalIncome(income);

      
      setPendingOrders(
        orders.filter((order) => order.status === "new").length
      );
    }, [orders, users, income]);

    console.log("Users:", users);

    return (
        <div className="summary-container">
            
            <div className="summary-content">
                <h1>Admin Summary</h1>
                <div className="summary-cards">
                    <div className="card">
                        <h2>Total Orders</h2>
                        <p>{totalOrders}</p>
                    </div>
                    <div className="card">
                        <h2>Total Users</h2>
                        <p>{totalUsers}</p>
                    </div>
                    <div className="card">
                        <h2>Total Income</h2>
                        <p>{totalIncome}</p>
                    </div>
                    <div className="card">
                        <h2>Pending Orders</h2>
                        <p>{pendingOrders}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Summary;