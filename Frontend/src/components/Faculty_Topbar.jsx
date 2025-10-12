import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, UserCircle, Menu } from "lucide-react";
import "../styles/F_navbar.css";

export default function Navbar({ toggleMobile }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <Menu
          size={22}
          className="menu-icon"
          onClick={toggleMobile}
          aria-label="Toggle sidebar"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && toggleMobile()}
        />
        <h2>Dashboard</h2>
      </div>

      {/* Center Section */}
      <div className="navbar-center">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <button className="create-btn" onClick={() => alert("Logging out...")}>
          Logout
        </button>

        {/* Notifications */}
        <div className="dropdown-wrapper" ref={notifRef}>
          <div
            className="nav-icon-wrapper"
            role="button"
            tabIndex={0}
            onClick={() => setShowNotifications(!showNotifications)}
            onKeyDown={(e) =>
              e.key === "Enter" && setShowNotifications(!showNotifications)
            }
            aria-label="Notifications"
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

        {/* Profile */}
        <div className="dropdown-wrapper" ref={profileRef}>
          <UserCircle
            size={28}
            className="nav-avatar"
            role="button"
            tabIndex={0}
            onClick={() => setShowProfile(!showProfile)}
            onKeyDown={(e) =>
              e.key === "Enter" && setShowProfile(!showProfile)
            }
            aria-label="User Profile"
          />
          {showProfile && (
            <div className="dropdown profile-dropdown">
              <p>
                <strong>Enoch Carlo</strong>
              </p>
              <p className="muted">Project Manager</p>
              <hr />
              <ul>
                <li tabIndex={0}>My Profile</li>
                <li tabIndex={0}>Settings</li>
                <li tabIndex={0}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
