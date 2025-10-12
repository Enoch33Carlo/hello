import React, { useEffect, useState } from "react";
import "../styles/layout2.css";

export default function RegisteredEvents() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/registrations")
      .then((res) => res.json())
      .then((data) => {
        setRegistrations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching registrations:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Loading registered events...</p>;

  // Filter registrations based on search text and status
  const filtered = registrations.filter((reg) => {
    const matchesText =
      reg.eventTitle.toLowerCase().includes(filterText.toLowerCase()) ||
      reg.fullName.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || reg.status === statusFilter;
    return matchesText && matchesStatus;
  });

  return (
    <div className="registered-page">
      {/* Header and Filters */}
      <div className="header-section">
        <h2>Registered Events</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by event or name..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Finished">Finished</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="card-container">
        {filtered.length === 0 ? (
          <p className="no-data">No matching registrations found.</p>
        ) : (
          filtered.map((reg) => (
            <div key={reg.id} className="event-card">
              <div className="event-image-wrapper">
                <img
                  src={reg.image || "/default-event.jpg"}
                  alt={reg.eventTitle}
                  className="event-image"
                />
                <span
                  className={`status-tag ${
                    reg.status === "Ongoing"
                      ? "ongoing"
                      : reg.status === "Finished"
                      ? "finished"
                      : ""
                  }`}
                >
                  {reg.status}
                </span>
              </div>
              <div className="event-content">
                <h3 className="event-title">{reg.eventTitle}</h3>
                <p className="event-user"><strong>{reg.fullName}</strong></p>
                <p className="event-email">{reg.email}</p>
                <p className="event-dept">{reg.department}</p>
                {reg.message && <p className="event-message">“{reg.message}”</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
