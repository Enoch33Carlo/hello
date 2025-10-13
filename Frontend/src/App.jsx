import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentLayout from "./layouts/StudentLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import Dashboard from "./pages/Dashboard";
import RegisteredEvents from "./components/RegisteredEvents";
import Faculty_Dashboard from "./pages/Faculty_Dashboard";
import Finance from "./pages/Finance";
import ManageEvents from "./pages/ManageEvents";
import ReportGeneration from "./pages/ReportGeneration";
import "./styles/dashboard.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Student Module */}
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="registered" element={<RegisteredEvents />} />
        </Route>

        {/* Faculty Module */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route path="f_dash" element={<Faculty_Dashboard />} />
          <Route path="finance" element={<Finance />} />
          <Route path="manage" element={<ManageEvents />} />
          <Route path="report" element={<ReportGeneration />} />
        </Route>
      </Routes>
    </Router>
  );
}
