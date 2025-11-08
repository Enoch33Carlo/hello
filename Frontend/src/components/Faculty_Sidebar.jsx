import React, { useState } from "react";
import { Home, Users, BarChart, FileText, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/F_sidebar.css";

export default function Faculty_Sidebar({
  active,
  onSelect,
  isMobileOpen,
  toggleMobile,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const items = [
    {
      id: "f_dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      path: "/faculty/F_dash",
    },
    {
      id: "finance",
      label: "Finance",
      icon: <Users size={20} />,
      path: "/faculty/Finance",
    },
    {
      id: "manage_events",
      label: "Manage Events",
      icon: <BarChart size={20} />,
      path: "/faculty/Manage",
    },
    {
  id: "report_generation",
  label: "Report Generation",
  icon: <FileText size={20} />,
  path: "/report_generation",
  external: true
}

  ];

  const handleClick = (item) => {
    onSelect?.(item.id);
    toggleMobile?.(false);
    navigate(item.path); // ✅ use React Router navigation instead of reloading
  };

  return (
    <>
      
 
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={toggleMobile}></div>
      )}

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
