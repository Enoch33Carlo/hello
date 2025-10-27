import React, { useState } from "react";
import "../styles/f_layout3.css";

export default function ManageEvents() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    totalSeats: "",
    registrations: "",
    earnings: "",
    guests: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Data Submitted:", formData);
    // Here you can handle adding event to JSON or API
  };

  return (
    <div className="manage-events-container">
      <form className="add-event-card" onSubmit={handleSubmit}>
        <h3>Add New Event</h3>

        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="number"
          name="totalSeats"
          placeholder="Total Seats"
          value={formData.totalSeats}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="registrations"
          placeholder="Registrations"
          value={formData.registrations}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="earnings"
          placeholder="Earnings"
          value={formData.earnings}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="guests"
          placeholder="Guests"
          value={formData.guests}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}  