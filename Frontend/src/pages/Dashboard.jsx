// // ----------------------------
// import React, { useEffect, useMemo, useState } from 'react';
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
// import EventCard from '../components/EventCard';


// export default function Dashboard(){
//   const [events, setEvents] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [search, setSearch] = useState('');
//   const [category, setCategory] = useState('all');
//   const [dateFilter, setDateFilter] = useState('');

//   useEffect(() => {
//     fetch('/events.json')
//       .then(r => r.json())
//       .then(data => setEvents(data || []))
//       .catch(e => console.error(e));

//     fetch('/notifications.json')
//       .then(r => r.json())
//       .then(data => setNotifications(data || []))
//       .catch(e => console.warn('no notifications.json'));
//   }, []);

//   const filtered = useMemo(() => {
//     return events.filter(ev => {
//       if (category !== 'all' && ev.category !== category) return false;
//       if (dateFilter && ev.date !== dateFilter) return false;
//       if (search && !(ev.title + ev.description + ev.location).toLowerCase().includes(search.toLowerCase())) return false;
//       return true;
//     });
//   }, [events, category, dateFilter, search]);

//   // Chart data
//   const guestsData = useMemo(() => events.map(e => ({ name: e.title.slice(0,12), guests: e.guests || Math.floor(Math.random()*120) })), [events]);
//   const earningsData = useMemo(() => events.map(e => ({ name: e.title.slice(0,12), earnings: e.earnings || Math.floor(Math.random()*200) })), [events]);

//   const registerToggle = (id) => {
//     setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, isRegistered: !ev.isRegistered } : ev));
//   };

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-grid">
//         <div className="left-col">
//           <div className="cards-row">
//             <div className="stat-card">
//               <div className="stat-title">All Time Events</div>
//               <div className="stat-value">{events.length}</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-title">Active Events</div>
//               <div className="stat-value">{events.filter(e => new Date(e.date) >= new Date()).length}</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-title">Total Registrations</div>
//               <div className="stat-value">{events.reduce((s,e)=> s + (e.registrations||0),0)}</div>
//             </div>
           
//           </div>

//           <div className="filters-card">
//             <div className="filters-row">
//               <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
//               <select value={category} onChange={e=>setCategory(e.target.value)}>
//                 <option value="all">All</option>
//                 <option value="academic">Academic</option>
//                 <option value="cultural">Cultural</option>
//                 <option value="sports">Sports</option>
//               </select>
//               <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} />
//             </div>
//           </div>

         

          
//         </div>

//         <div className="center-col">
//           <section className="upcoming-list">
//             <div className="list-header">
//               <h3>Upcoming Auto Form</h3>
//               <div className="muted small">{filtered.length} events</div>
//             </div>

//             <div className="events-list">
//               {filtered.map(ev => (
//                 <EventCard key={ev.id} ev={ev} onRegister={registerToggle} />
//               ))}
//               {filtered.length === 0 && <div className="muted">No events match your filters.</div>}
//             </div>
//           </section>
//         </div>

//         <div className="right-col">
          
         
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import EventCard from "../components/EventCard";
import "../styles/layout.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch events from events.json
  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error loading events:", err));
  }, []);

  // Filter events by search query
  const filteredEvents = events.filter((ev) =>
    ev.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* 🔹 Topbar with search */}
      <header className="topbar">
        <div className="search">
          <input
            placeholder="Search for events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* <div className="top-actions">
          <div className="profile">
            <div className="avatar">EN</div>
            <div className="profile-name">Enoch Carlo</div>
          </div>
        </div> */}
      </header>

      {/* 🔹 Events list below search bar */}
      <div className="events-container">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((ev) => <EventCard key={ev.id} ev={ev} />)
        ) : (
          <p className="no-results">No events found.</p>
        )}
      </div>
    </div>
  );
}

