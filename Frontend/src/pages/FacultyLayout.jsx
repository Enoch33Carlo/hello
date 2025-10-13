// pages/FacultyLayout.jsx
import React, { useState } from "react";
import Faculty_Sidebar from "../components/Faculty_Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function FacultyLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <div className="faculty-layout">
      <Faculty_Sidebar isMobileOpen={isMobileOpen} toggleMobile={toggleMobile} />
      <div className="faculty-main">
        <Navbar toggleMobile={toggleMobile} />
        <div className="faculty-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
