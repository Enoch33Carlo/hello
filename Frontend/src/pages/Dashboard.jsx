import React, { useEffect, useState } from "react";
import Topbar from "../components/Faculty_Topbar";
import EventCard from "../components/EventCard";  
import "../styles/F_layout.css";


export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    studentDept: "",
  });

  // ✅ Fetch events from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // ✅ Handle registration submission
  const handleRegister = async () => {
    if (!selectedEvent) return;

    const payload = {
      eventId: selectedEvent.id,
      eventName: selectedEvent.title,
      studentName: formData.studentName,
      studentEmail: formData.studentEmail,
      studentDept: formData.studentDept,
    };

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message || "Registered successfully!");

      setSelectedEvent(null);
      setFormData({ studentName: "", studentEmail: "", studentDept: "" });
    } catch (err) {
      console.error("Error registering:", err);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="faculty-dashboard">
     

      {/* 🔹 Events list */}
      <div className="events-container">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <img
              src={
                event.image.startsWith("http")
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
            </div>

            {/* 📝 Register Button */}
            <button
              className="register-btn"
              onClick={() => setSelectedEvent(event)}
            >
              📝 Register
            </button>
          </div>
        ))}
      </div>

   {/* 🔹 Registration Modal */}
{selectedEvent && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)",
    }}
  >
    <div
      style={{
        background: "white",
        padding: "30px 40px",
        borderRadius: "16px",
        width: "400px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <h3
        style={{
          fontSize: "22px",
          fontWeight: "600",
          color: "#2C3E50",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Register for {selectedEvent.title}
      </h3>

      <label style={{ fontWeight: "500", marginBottom: "6px" }}>Full Name</label>
      <input
        type="text"
        value={formData.studentName}
        onChange={(e) =>
          setFormData({ ...formData, studentName: e.target.value })
        }
        style={{
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
          fontSize: "15px",
          transition: "0.3s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#4CAF50")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label style={{ fontWeight: "500", marginBottom: "6px" }}>Email</label>
      <input
        type="email"
        value={formData.studentEmail}
        onChange={(e) =>
          setFormData({ ...formData, studentEmail: e.target.value })
        }
        style={{
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
          fontSize: "15px",
          transition: "0.3s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#4CAF50")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label style={{ fontWeight: "500", marginBottom: "6px" }}>Department</label>
      <input
        type="text"
        value={formData.studentDept}
        onChange={(e) =>
          setFormData({ ...formData, studentDept: e.target.value })
        }
        style={{
          padding: "10px",
          marginBottom: "25px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
          fontSize: "15px",
          transition: "0.3s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#4CAF50")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <button
          onClick={handleRegister}
          style={{
            flex: 1,
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "12px 0",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#43a047")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          ✅ Submit
        </button>

        <button
          onClick={() => setSelectedEvent(null)}
          style={{
            flex: 1,
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "12px 0",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#e74c3c")}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
