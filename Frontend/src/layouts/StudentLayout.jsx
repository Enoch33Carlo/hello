import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <div className="app-shell">
      <Sidebar isMobileOpen={isMobileOpen} toggleMobile={toggleMobile} />
      <div className="main-area">
        <Topbar toggleMobile={toggleMobile} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
