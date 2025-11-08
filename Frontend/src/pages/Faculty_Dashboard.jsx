import React, { useEffect, useState } from "react";
import Topbar from "../components/Faculty_Topbar";
import "../styles/F_layout.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch events
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // Filter events by search
  const filteredEvents = events.filter((ev) =>
    ev.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch attendance data
  const handleViewAttendance = async (eventId, title) => {
    try {
      const res = await fetch(`http://localhost:5000/api/registrations/event/${eventId}`);
      const data = await res.json();
      setAttendance(data);
      setSelectedEvent(title);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  return (
    <div className="faculty-dashboard">
    

      <div className="events-container">
        {filteredEvents.map((event) => (
          <div className="event-card" key={event.id}>
            <img
              src={
                event.image?.startsWith("http")
                  ? event.image
                  : `http://localhost:5000/uploads/${event.image}`
              }
              alt={event.title}
              className="event-image"
            />
            <div className="event-info2">
              <h4>{event.title}</h4>
              <p>{event.category}</p>
              <p>
                {event.date} — {event.time}
              </p>
              <p>{event.location}</p>

              <button
                className="view-btn"
                onClick={() => handleViewAttendance(event.id, event.title)}
              >
                📋 View Attendance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Modal for Attendance */}
      {showModal && (
        <div className="attendance-modal" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent background click closing
          >
            <h2>Attendance — {selectedEvent}</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No students registered yet
                    </td>
                  </tr>
                ) : (
                  attendance.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.studentName}</td>
                      <td>{s.studentEmail}</td>
                      <td>{s.studentDept || "-"}</td>
                      <td>{new Date(s.regDate).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
