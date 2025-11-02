import React, { useState, useEffect } from "react";
import "../styles/f_layout3.css";

export default function ManageEvents() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    image:"",
    payment: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Add new event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("✅ Event added successfully!");
        setFormData({
          title: "",
          category: "",
          date: "",
          time: "",
          location: "",
          venue: "",
          image:"",
          payment: "",
          description: "",
        });
        setImage(null);
        fetchEvents();
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Failed to upload event");
    }
  };

  // Delete an event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("🗑️ Event deleted successfully!");
        fetchEvents();
      } else {
        const err = await res.json();
        alert("❌ " + err.error);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("❌ Failed to delete event");
    }
  };

  return (
    <div className="manage-events-container">
      {/* Frosted Add Event Section */}
      <div className="frost-card">
        <form className="add-event-card" onSubmit={handleSubmit}>
          <h3>Add New Event</h3>

          <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
          <input type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} required />
          <input type="text" name="payment" placeholder="Payment (Free/Paid)" value={formData.payment} onChange={handleChange} required />
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
          <textarea name="description" placeholder="Description" rows={3} value={formData.description} onChange={handleChange} required></textarea>

          <button type="submit">Add Event</button>
        </form>
      </div>

      {/* Delete Event Section */}
      <div className="delete-event-section frost-card">
        <h3>Delete Event</h3>
        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <div className="event-delete-grid">
            {events.map((event) => (
              <div className="event-card" key={event.id}>
                <img
              src={event.image.startsWith("http") ? event.image : `http://localhost:5000/uploads/${event.image}`}
                         alt={event.title}
                       className="event-image"
          />

                <div className="event-info1">
                  <h4>{event.title}</h4>
                  <p>{event.category}</p>
                  <p>{event.date} — {event.time}</p>
                  <p>{event.location}</p>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(event.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
