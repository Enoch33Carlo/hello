import React, { useEffect, useState } from "react";
import Topbar from "../components/Faculty_Topbar";
import EventCard from "../components/F_EventCard";  
import "../styles/F_layout.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch events from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // ✅ Filter events by search query
  const filteredEvents = events.filter((ev) =>
    ev.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faculty-dashboard">

      

      {/* 🔹 Events list */}
      <div className="events-container">
       {events.map((event) => (
              <div className="event-card" key={event.id}>
                <img
              src={event.image.startsWith("http") ? event.image : `http://localhost:5000/uploads/${event.image}`}
                         alt={event.title}
                       className="event-image"
          />

                <div className="event-info2">
                  <h4 >{event.title}</h4>

                  <p>{event.category}</p>
                  <p>{event.date} — {event.time}</p>
                  <p>{event.location}</p>
                </div>
              </div>
            ))}
          </div>
      
      </div>
    
  );
}