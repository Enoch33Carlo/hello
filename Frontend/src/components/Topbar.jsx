// import React from "react";
// import { Search, Bell, UserCircle, Menu } from "lucide-react";
// import "../styles/navbar.css";

// export default function Navbar({ toggleMobile }) {
//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <Menu size={22} className="menu-icon" onClick={toggleMobile} />
//         <h2>Dashboard</h2>
//       </div>

//       <div className="navbar-center">
//         <div className="search-bar">
//           <Search size={18} />
//           <input type="text" placeholder="Search anything..." />
//         </div>
//       </div>

//       <div className="navbar-right">
//         <button className="create-btn">Logout</button>
//         <Bell size={20} className="nav-icon" />
//         <UserCircle size={28} className="nav-avatar" />
//       </div>
//     </nav>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, UserCircle, Menu } from "lucide-react";
import "../styles/navbar.css";

export default function Navbar({ toggleMobile }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef();
  const profileRef = useRef();

  // Fetch notifications
  useEffect(() => {
    fetch("http://localhost:5000/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error loading notifications:", err));
  }, []);

  // Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* 🟢 Left Section */}
      <div className="navbar-left">
        <Menu size={22} className="menu-icon" onClick={toggleMobile} />
        <h2>Dashboard</h2>
      </div>

      {/* 🔵 Center Section */}
      <div className="navbar-center">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search anything..." />
        </div>
      </div>

      {/* 🔴 Right Section */}
      <div className="navbar-right">
        <button className="create-btn">Logout</button>

        {/* 🔔 Notification Icon */}
        <div className="dropdown-wrapper" ref={notifRef}>
          <div
            className="nav-icon-wrapper"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <Bell size={20} className="nav-icon" />
            {notifications.length > 0 && (
              <span className="notif-count">{notifications.length}</span>
            )}
          </div>

          {showNotifications && (
            <div className="dropdown notification-dropdown">
              <h4>Notifications</h4>
              {notifications.length === 0 ? (
                <p className="muted">No new notifications</p>
              ) : (
                <ul>
                  {notifications.map((n, i) => (
                    <li key={i}>
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <small>{n.date}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* 👤 User Icon */}
        <div className="dropdown-wrapper" ref={profileRef}>
          <UserCircle
            size={28}
            className="nav-avatar"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          />
          {showProfile && (
            <div className="dropdown profile-dropdown">
              <p><strong>Enoch Carlo</strong></p>
              <p className="muted">Project Manager</p>
              <hr />
              <ul>
                <li>My Profile</li>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
