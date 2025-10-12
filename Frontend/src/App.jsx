// ----------------------------
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import MyEvents from './pages/MyEvents';
import Notifications from './pages/Notifications';
import Feedback from './pages/Feedback';
import './styles/dashboard.css';
import RegisteredEvents from './components/RegisteredEvents';
import Faculty_Dashboard from './pages/Faculty_Dashboard';
import Finance from './pages/Finance';
import ManageEvents from './pages/ManageEvents';
import ReportGeneration from './pages/ReportGeneration';


export default function App(){
  return (
    <Router>
      <div className="app-shell">
        <Sidebar />
        <div className="main-area">
          <Topbar />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
                <Route path="/registered" element={<RegisteredEvents />} />
              <Route path="/F_dash" element={<Faculty_Dashboard />} />
              <Route path="/Finance" element={<Finance />} />
              <Route path="/ME" element={<ManageEvents />} />
              <Route path="/RG" element={<ReportGeneration />} />
             
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
