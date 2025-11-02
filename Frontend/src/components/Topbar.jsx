import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, UserCircle, Menu } from "lucide-react";
import "../styles/navbar.css";

export default function Navbar({ toggleMobile }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  const notifRef = useRef();
  const profileRef = useRef();

  // 🟢 Load logged-in user from localStorage
  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userData = JSON.parse(storedUser);

    // Fetch latest user details from backend
    fetch(`http://localhost:5000/api/user/${userData.email}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user details:", err));
  }
}, []);


  // 🔔 Fetch notifications
  useEffect(() => {
    fetch("http://localhost:5000/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error loading notifications:", err));
  }, []);

  // ❌ Close dropdowns when clicking outside
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

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

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
        <button className="create-btn" onClick={handleLogout}>
          Logout
        </button>

        {/* 🔔 Notification Dropdown */}
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

        {/* 👤 User Profile Dropdown */}
        <div className="dropdown-wrapper" ref={profileRef}>
          <UserCircle
            size={28}
            className="nav-avatar"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          />

          {showProfile && user && (
  <div className="dropdown profile-dropdown">
    <p><strong>{user.name}</strong></p>
    <p className="muted">{user.role}</p>
    <p className="muted">{user.email}</p>
    <hr />
    <ul>
      <li>My Profile</li>
      <li>Settings</li>
      <li onClick={handleLogout}>Logout</li>
    </ul>
  </div>
)}
        </div>
      </div>
    </nav>
  );
}