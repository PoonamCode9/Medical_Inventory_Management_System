import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminNavbar.css";

function AdminNavbar() {

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);


  useEffect(() => {
    fetchNotifications();
  }, []);


  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.userId;

      const response = await axios.get(
        `http://localhost:8080/user-notifications/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(response.data);

      setNotifications(response.data);

    } catch (error) {
      console.log("Error fetching notifications", error);
    }
  };


  const markAsRead = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/user-notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchNotifications();

    } catch (error) {
      console.log("Error marking notification as read", error);
    }

  };


  return (
    <div className="navbar">

      <h2>Medical Inventory System</h2>


      <div className="navbar-right">


        <div
          className="notification"
          onClick={() => setShowNotifications(!showNotifications)}
        >

          🔔


          {notifications.filter(
            notification => !notification.isRead
          ).length > 0 && (

              <span className="notification-count">

                {
                  notifications.filter(
                    notification => !notification.isRead
                  ).length
                }

              </span>

            )}



          {showNotifications && (

            <div className="notification-box">


              {notifications.length === 0 ? (

                <p>No Notifications</p>

              ) : (


                notifications.map((notification) => (


                  <div
                    key={notification.id}
                    className={
                      notification.isRead
                        ? "read-notification"
                        : "unread-notification"
                    }
                  >


                    <p>
                      {notification.notification.message}
                    </p>


                    <span>
                      {
                        notification.isRead
                          ? "Read"
                          : "Unread"
                      }
                    </span>

                    <button
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                    >
                      {notification.isRead ? "Mark as Unread" : "Mark as Read"}
                    </button>


                  </div>


                ))

              )}


            </div>

          )}


        </div>


        <span>
          Welcome, Admin 👋
        </span>


        <button>
          Logout
        </button>


      </div>


    </div>
  );
}

export default AdminNavbar;