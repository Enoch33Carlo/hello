import React, { useEffect, useState } from "react";
import Topbar from "../components/Faculty_Topbar";
import "../styles/F_layout.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const [financeList, setFinanceList] = useState([]);
  const [editingFinance, setEditingFinance] = useState(null);
  const [editData, setEditData] = useState({ cashCollected: "", onlineCollected: "" });
  const [selectedFinance, setSelectedFinance] = useState(null);

  // ✅ Fetch events
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // ✅ Fetch finance
  const fetchFinance = () => {
    fetch("http://localhost:5000/api/finance")
      .then((res) => res.json())
      .then((data) => setFinanceList(data))
      .catch((err) => console.error("Error fetching finance:", err));
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  // ✅ Filter search
  const filteredEvents = events.filter((ev) =>
    ev.title?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Add to finance
  const handleAddToFinance = async (event) => {
    setLoadingId(event.id);
    try {
      const res = await fetch("http://localhost:5000/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          eventName: event.title,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
        fetchFinance();
      } else if (res.status === 409) {
        alert("⚠️ Event already exists in finance.");
      } else {
        alert("❌ Failed to add event to finance.");
      }
    } catch (err) {
      console.error("Error adding to finance:", err);
      alert("❌ Server error.");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ Edit finance
  const handleEditFinance = (finance) => {
    setEditingFinance(finance.id);
    setEditData({
      cashCollected: finance.cashCollected || "",
      onlineCollected: finance.onlineCollected || "",
    });
  };

  // ✅ Save finance
  const handleSaveFinance = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/finance/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        alert("✅ Finance updated successfully!");
        setEditingFinance(null);
        fetchFinance();
      } else {
        alert("❌ Update failed.");
      }
    } catch (err) {
      console.error("Error updating finance:", err);
      alert("❌ Server error.");
    }
  };

  // ✅ Find finance entry for an event
  const getFinanceForEvent = (eventId) =>
    financeList.find((f) => f.eventId === eventId);

  return (
    <div className="faculty-dashboard">
      <Topbar />

      {/* 🔍 Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🗓 Events Section */}
      <h2 className="section-title">Events</h2>
      <div className="events-container">
        {filteredEvents.map((event) => {
          const finance = getFinanceForEvent(event.id);

          return (
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
                <p>{event.date} — {event.time}</p>
                <p>{event.location}</p>

                {/* 🎯 Conditional Buttons */}
                {finance ? (
                  <>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedFinance(finance)}
                    >
                      👁 View Finance
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditFinance(finance)}
                    >
                      ✏️ Edit Finance
                    </button>
                  </>
                ) : (
                  <button
                    className="finance-btn"
                    onClick={() => handleAddToFinance(event)}
                    disabled={loadingId === event.id}
                  >
                    {loadingId === event.id ? "⏳ Adding..." : "💰 Add to Finance"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 💰 Finance Edit Modal */}
      {editingFinance && (
        <div className="finance-modal">
          <div className="modal-content">
            <h3>Edit Finance Details</h3>
            <label>Cash Collected</label>
            <input
              type="number"
              value={editData.cashCollected}
              onChange={(e) =>
                setEditData({ ...editData, cashCollected: e.target.value })
              }
            />
            <label>Online Collected</label>
            <input
              type="number"
              value={editData.onlineCollected}
              onChange={(e) =>
                setEditData({ ...editData, onlineCollected: e.target.value })
              }
            />
            <div className="modal-actions">
              <button className="save-btn" onClick={() => handleSaveFinance(editingFinance)}>
                💾 Save
              </button>
              <button className="cancel-btn" onClick={() => setEditingFinance(null)}>
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👁 Finance View Modal */}
      {selectedFinance && (
        <div className="finance-modal">
          <div className="modal-content">
            <h3>Finance Details</h3>
            <p><b>Event Name:</b> {selectedFinance.eventName}</p>
            <p><b>Cash Collected:</b> ₹{selectedFinance.cashCollected}</p>
            <p><b>Online Collected:</b> ₹{selectedFinance.onlineCollected}</p>
            <p><b>Total:</b> ₹{Number(selectedFinance.cashCollected || 0) + Number(selectedFinance.onlineCollected || 0)}</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setSelectedFinance(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
