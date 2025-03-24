import React, { useEffect } from "react";
import {useStore} from "../store/zustand";

const NotificationList = () => {
  const { notifications, loadNotifications } = useStore();
  const customerID = "CUST1001"; // Replace with logged-in user ID

  useEffect(() => {
    loadNotifications(customerID);
  }, []);

  const my_notifications = notifications.filter((notif)=>(notif.customerID == customerID))
  console.log(my_notifications)
  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {my_notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {my_notifications.map((notif, index) => (
            <li key={notif._id || index} className={notif.read ? "read" : "unread"}>
              {notif.message}
              <span className="timestamp">
                {new Date(notif.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

//   return (
//     <div className="notifications-container">
//       <h2>Notifications</h2>
//       {notifications.length === 0 ? (
//         <p>No notifications</p>
//       ) : (
//         <ul>
//           {notifications.map((notif) => (
//             <li key={notif._id} className={notif.read ? "read" : "unread"}>
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
};

export default NotificationList;
