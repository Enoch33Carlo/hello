import React, { useState, useEffect } from "react";
import "../styles/layout.css";

export default function EventCard({ ev }) {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);

  // Fetch event details
  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item.id === ev.id);
        setEventDetails(found);
      })
      .catch((err) => console.error("Error loading event details:", err));
  }, [ev.id]);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleOpenDetails = () => setShowDetails(true);
  const handleCloseDetails = () => setShowDetails(false);

  // 🆕 Registration handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      department: e.target.department.value,
      message: e.target.message.value,
      eventTitle: ev.title,
    };

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Registered successfully!");
        setShowForm(false);
      } else {
        const data = await res.json();
        alert("❌ Error: " + (data.error || "Registration failed"));
      }
    } catch (error) {
      alert("❌ Could not connect to server.");
    }
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
      <div className="event-card">
        <div className="event-card-left">
          <div
            className="event-thumb"
            style={{ backgroundImage: `url(${ev.image || ""})` }}
          />
        </div>

        <div className="event-card-body">
          <h4>{ev.title}</h4>
          <div className="muted">
            {ev.category} • {ev.date} • {ev.time}
          </div>

          <p className="small">
            📍 <strong>Venue:</strong> {ev.venue || eventDetails?.venue || "N/A"}
          </p>
          <p className="small">
            🌆 <strong>Place:</strong> {ev.location || eventDetails?.location || "N/A"}
          </p>

          {eventDetails && eventDetails.totalSeats && (
            <p className="small seats-info">
              🎟️ <strong>Seats Left:</strong> {seatsLeftPercent}% (
              {eventDetails.totalSeats - eventDetails.registrations} of{" "}
              {eventDetails.totalSeats})
            </p>
          )}

          <p className="small desc">{ev.description}</p>

          <div className="event-card-actions">
            <button className="btn-primary" onClick={handleOpenForm}>
              Register
            </button>
            <button className="btn-primary" onClick={handleOpenDetails}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 Registration Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{ev.title}</h3>
            <p className="muted">
              {ev.category} • {ev.date} • {ev.time} • {ev.location}
            </p>

            <form className="event-form" onSubmit={handleSubmit}>
              <label>
                Full Name
                <input name="fullName" type="text" placeholder="Enter your name" required />
              </label>

              <label>
                Email
                <input name="email" type="email" placeholder="Enter your email" required />
              </label>

              <label>
                Department
                <input name="department" type="text" placeholder="Enter your department" />
              </label>

              <label>
                Additional Info
                <textarea name="message" placeholder="Any notes or message..." />
              </label>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔵 Event Details Modal */}
      {showDetails && eventDetails && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
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
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCloseDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
