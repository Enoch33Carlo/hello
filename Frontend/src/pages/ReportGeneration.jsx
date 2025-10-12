import React, { useState, useEffect } from "react";
import "../styles/ReportGeneration.css";

export default function ReportGeneration() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [report, setReport] = useState(null);

  // Fetch events
  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // Generate report for selected event
  const handleGenerateReport = () => {
    if (!selectedEvent) return;

    // Simulate fetching attendance and finance
    fetch("/attendanceData.json")
      .then((res) => res.json())
      .then((attendanceData) => {
        const eventAttendance = attendanceData.find(
          (a) => a.eventId === parseInt(selectedEvent)
        );

        const eventDetails = events.find(
          (e) => e.id === parseInt(selectedEvent)
        );

        const reportData = {
          title: eventDetails.title,
          category: eventDetails.category,
          date: eventDetails.date,
          totalSeats: eventDetails.totalSeats,
          registrations: eventDetails.registrations,
          earnings: eventDetails.earnings,
          guests: eventDetails.guests,
          totalStudents: eventAttendance ? eventAttendance.students.length : 0,
          totalTeams: eventAttendance ? eventAttendance.teams.length : 0,
        };

        setReport(reportData);
      })
      .catch((err) => console.error("Error generating report:", err));
  };

  return (
    <div className="report-container">
      <div className="report-card frosted">
        <h3>Generate Event Report</h3>

        <select
          value={selectedEvent || ""}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="" disabled>
            Select Event
          </option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>

        <button onClick={handleGenerateReport} className="btn-primary">
          Generate Report
        </button>

        {report && (
          <div className="report-details">
            <h4>{report.title}</h4>
            <p><strong>Category:</strong> {report.category}</p>
            <p><strong>Date:</strong> {report.date}</p>
            <p><strong>Total Seats:</strong> {report.totalSeats}</p>
            <p><strong>Registrations:</strong> {report.registrations}</p>
            <p><strong>Guests:</strong> {report.guests}</p>
            <p><strong>Earnings:</strong> ₹{report.earnings}</p>
            <p><strong>Total Students Attended:</strong> {report.totalStudents}</p>
            <p><strong>Total Teams:</strong> {report.totalTeams}</p>
          </div>
        )}
      </div>
    </div>
  );
}
