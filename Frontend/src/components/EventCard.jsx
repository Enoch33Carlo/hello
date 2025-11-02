
import React, { useState, useEffect } from "react";
import "../styles/F_layout.css";

export default function EventCard({ ev }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  // ✅ Fetch event details when component loads
  useEffect(() => {
    fetch("/events.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load events.json");
        return res.json();
      })
      .then((data) => {
        const found = data.find((e) => e.id === ev.id);
        setEventDetails(found);
      })
      .catch((err) => console.error("Error loading event details:", err));
  }, [ev.id]);

  // ✅ Event modal handlers
  const handleOpenDetails = () => setShowDetails(true);
  const handleCloseDetails = () => setShowDetails(false);

  // ✅ Attendance summary fetch
  const handleOpenAttendance = () => {
    fetch("/attendance.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load attendance.json");
        return res.json();
      })
      .then((data) => {
        const record = data.find((a) => a.eventId === ev.id);
        setAttendance(record);
        setShowAttendance(true);
        setAttendanceDetails(null);
      })
      .catch((err) => console.error("Error loading attendance:", err));
  };

  const handleCloseAttendance = () => setShowAttendance(false);

// ✅ Attendance detail fetch (corrected)
const handleViewAttendanceDetails = () => {
  fetch("/attendanceData.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load attendanceData.json");
      return res.json();
    })
    .then((data) => {
      // Find the attendance details for the current event
      const record = data.find((item) => item.eventId === ev.id);

      if (!record) {
        throw new Error(`No attendance details found for event ID: ${ev.id}`);
      }

      setAttendanceDetails(record);
    })
    .catch((err) => {
      console.error("Error loading attendance details:", err);
      setAttendanceDetails({ students: [], teams: [] }); // prevent crash
    });
};

 


  const seatsLeftPercent =
    eventDetails && eventDetails.totalSeats
      ? Math.round(
          ((eventDetails.totalSeats - eventDetails.registrations) /
            eventDetails.totalSeats) *
            100
        )
      : null;

  return (
    <>
      <div className="event-card3">
        {/* ✅ Image Section */}
        {eventDetails?.image && (
          <div
            className="event-thumb"
            style={{
              backgroundImage: `url(${eventDetails.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "90px",
              borderRadius: "10px 10px 0 0",
            }}
          ></div>
        )}
        <div className="event-card-body">
          <h4>{ev.title}</h4>
          <div className="event-card-actions">
            <button className="btn-primary" onClick={handleOpenDetails}>
              View Details
            </button>
            <button className="btn-secondary" onClick={handleOpenAttendance}>
              Attendance
            </button>
            
          </div>
        </div>
      </div>

    {showAttendance && (
  <div className="modal-overlay" onClick={handleCloseAttendance}>
    <div
      className="modal-card frosted"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>{ev.title} - Attendance</h3>

      {/* Fetch attendance summary */}
      {attendance === null && (
        <p className="muted">Loading attendance summary...</p>
      )}

      {attendance && (
        <>
          <p>
            <strong>Total Students:</strong> {attendance.students}
          </p>
          <p>
            <strong>Total Teams:</strong> {attendance.teams}
          </p>

          {!attendanceDetails && (
            <button
              className="btn-primary"
              onClick={handleViewAttendanceDetails}
            >
              View Details
            </button>
          )}
        </>
      )}

      {/* Attendance details */}
      {attendanceDetails && (
        <div className="attendance-details">
          <h4>Students:</h4>
          <ul>
            {attendanceDetails.students.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>

          <h4>Teams:</h4>
          {attendanceDetails.teams.map((team, index) => (
            <div key={index} className="team-block">
              <strong>{team.teamName}:</strong>
              <ul>
                {team.members.map((member, i) => (
                  <li key={i}>{member}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="form-actions">
        <button className="btn-secondary" onClick={handleCloseAttendance}>
          Close
        </button>
      </div>
    </div>
  </div>
)}



      {/* Event Details Modal */}
      {showDetails && eventDetails && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{eventDetails.title}</h3>
            <p className="muted">
              {eventDetails.category} • {eventDetails.date} • {eventDetails.time}
            </p>
            <p><strong>Location:</strong> {eventDetails.location}</p>
            <p><strong>Venue:</strong> {eventDetails.venue}</p>
            <p><strong>Description:</strong> {eventDetails.description}</p>
            <p><strong>Registrations:</strong> {eventDetails.registrations}</p>
            <p><strong>Total Seats:</strong> {eventDetails.totalSeats}</p>
            <p>
              <strong>Seats Left:</strong>{" "}
              {eventDetails.totalSeats - eventDetails.registrations} (
              {seatsLeftPercent}%)
            </p>
            <p><strong>Guests:</strong> {eventDetails.guests}</p>
            <p><strong>Earnings:</strong> ₹{eventDetails.earnings}</p>

            <div className="form-actions">
              <button className="btn-secondary" onClick={handleCloseDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
