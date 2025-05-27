// import React, { useEffect } from "react";
// import {useStore} from "../store/zustand";
// import "../clientviewcss/myNotifications.css"; // Import your CSS file for styling

// const NotificationList = () => {
//   const { notifications, loadNotifications } = useStore();
//   const customerID = "CUST1001"; // Replace with logged-in user ID
// const initialiseClientInfo = useStore((state) => state.initialiseClientInfo);
// const clientInfo = useStore((state) => state.clientInfo);

// useEffect(() => {
//     loadNotifications(customerID);
//   }, []);

//   const my_notifications = notifications.filter((notif)=>(notif.customerID == customerID))
//   console.log(my_notifications)
//   return (
//     <div className="notifications-container">
//       <h2>Notifications</h2>
//       {my_notifications.length === 0 ? (
//         <p>No notifications</p>
//       ) : (
//         <ul>
//           {my_notifications.map((notif, index) => (
//             <li key={notif._id || index} className={notif.read ? "read" : "unread"}>
//               {notif.message}
//               <span className="timestamp">
//                 {new Date(notif.timestamp).toLocaleString()}
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );

// };

// export default NotificationList;


import React, { useEffect } from "react";
import { useStore } from "../store/zustand";
import "../clientviewcss/myNotifications.css"; // Import your CSS file for styling

const NotificationList = () => {
  const notifications = useStore((state) => state.notifications); // Get notifications from Zustand
  const loadNotifications = useStore((state) => state.loadNotifications); // Load notifications function
  const readNotification = useStore((state) => state.readNotification); // Mark notification as read function
  const clientInfo = useStore((state) => state.clientInfo); // Get client info

  useEffect(() => {
    if (clientInfo?.id) {
      loadNotifications(clientInfo.id); // Load notifications for the logged-in customer
    }
  }, [clientInfo, loadNotifications]);

  const handleMarkAsRead = (notificationID) => {
    readNotification(notificationID); // Mark the notification as read
  };

  return (
    <div className="notifications-container">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`notification-item ${
                notif.read ? "read" : "unread"
              } flex justify-between items-center p-4 border rounded shadow`}
              onClick={() => handleMarkAsRead(notif._id)}
            >
              <div>
                <p className="font-medium">{notif.message}</p>
                <span className="timestamp text-sm text-gray-500">
                  {new Date(notif.timestamp).toLocaleString()}
                </span>
              </div>
              {!notif.read && (
                <span className="text-blue-500 font-bold">Mark as Read</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
