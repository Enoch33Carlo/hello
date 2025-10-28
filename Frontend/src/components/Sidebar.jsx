import React, { useState } from "react";
import { Home, Users, Menu, X } from "lucide-react";
import "../styles/sidebar.css";

export default function Sidebar({ active, onSelect, isMobileOpen, toggleMobile }) {
  const [isOpen, setIsOpen] = useState(true);

  const items = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      url: "http://localhost:5173/student",
    },
    {
      id: "registered",
      label: "Registered Events",
      icon: <Users size={20} />,
      url: "http://localhost:5173/student/registered",
    },
  ];

  const handleClick = (item) => {
    onSelect?.(item.id);
    toggleMobile?.(false);
    window.location.href = item.url; // 🔹 Open the page
  };

  return (
    <>
      {isMobileOpen && <div className="sidebar-overlay" onClick={toggleMobile}></div>}

      <aside
        className={`sidebar ${isOpen ? "open" : "collapsed"} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </div>

        <ul className="sidebar-menu">
          {items.map((item) => (
            <li
              key={item.id}
              className={`menu-item ${active === item.id ? "active" : ""}`}
              onClick={() => handleClick(item)}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
