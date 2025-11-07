import React, { useState, useEffect } from "react";

export default function ReportGeneration() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

 useEffect(() => {
  fetch("/api/events")
    .then((res) => res.json())
    .then((data) => setEvents(data))
    .catch((err) => console.error("Error fetching events:", err));
}, []);

const handleGeneratePDF = async () => {
  if (!selectedEvent) {
    alert("Please select an event");
    return;
  }
  try {
    const res = await fetch("/api/reports/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: Number(selectedEvent) }),
    });
    if (!res.ok) throw new Error("Report generation failed");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EventReport_${selectedEvent}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating report:", error);
    alert("Error generating report");
  }
};
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>📊 AI-Based Event Report Generator</h2>

      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        style={{
          padding: "10px",
          margin: "10px",
          width: "250px",
          borderRadius: "5px",
        }}
      >
        <option value="">Select an Event</option>
        {events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.title}
          </option>
        ))}
      </select>

      <br />
      <button
        onClick={handleGeneratePDF}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Generate Report
      </button>
    </div>
  );
}
