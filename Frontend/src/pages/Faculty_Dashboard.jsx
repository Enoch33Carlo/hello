
import React, { useEffect, useState } from "react";
import Topbar from "../components/Faculty_Topbar";
import EventCard from "../components/F_EventCard";
import "../styles/F_layout.css";

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
