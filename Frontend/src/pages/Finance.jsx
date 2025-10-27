import React, { useState, useEffect } from "react";
import "../styles/f_layout2.css";

export default function Finance() {
  const [financeData, setFinanceData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ cashCollected: "", onlineCollected: "" });

  // Fetch finance data
  useEffect(() => {
    fetch("/financeData.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load financeData.json");
        return res.json();
      })
      .then((data) => setFinanceData(data))
      .catch((err) => console.error("Error loading finance data:", err));
  }, []);

  const totalCash = financeData.reduce((sum, ev) => sum + ev.cashCollected, 0);
  const totalOnline = financeData.reduce(
    (sum, ev) => sum + ev.onlineCollected,
    0
  );
  const grandTotal = totalCash + totalOnline;

  // Handle editing
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm({
      cashCollected: financeData[index].cashCollected,
      onlineCollected: financeData[index].onlineCollected,
    });
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditForm({ cashCollected: "", onlineCollected: "" });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = (index) => {
    const updatedData = [...financeData];
    updatedData[index].cashCollected = parseInt(editForm.cashCollected) || 0;
    updatedData[index].onlineCollected = parseInt(editForm.onlineCollected) || 0;
    setFinanceData(updatedData);
    setEditIndex(null);

    // Optional: Save changes to server or JSON API here
    console.log("Updated Finance Data:", updatedData[index]);
  };

  return (
    <div className="finance-page">
      <h2 className="finance-title">Finance Overview</h2>

      <div className="finance-card-container">
        {financeData.map((ev, index) => (
          <div key={ev.eventId} className="finance-card">
            <h3 className="event-name">{ev.eventName}</h3>

            {editIndex === index ? (
              <div className="edit-section">
                <label>
                  💵 Cash Collected:
                  <input
                    type="number"
                    name="cashCollected"
                    value={editForm.cashCollected}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  💳 Online Collected:
                  <input
                    type="number"
                    name="onlineCollected"
                    value={editForm.onlineCollected}
                    onChange={handleChange}
                  />
                </label>

                <div className="edit-buttons">
                  <button className="btn-save" onClick={() => handleSave(index)}>
                    💾 Save
                  </button>
                  <button className="btn-cancel" onClick={handleCancel}>
                    ❌ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="finance-details">
                <div className="detail-item">
                  <span>💵 Cash Collected:</span>
                  <strong>₹{ev.cashCollected.toLocaleString()}</strong>
                </div>
                <div className="detail-item">
                  <span>💳 Online Collected:</span>
                  <strong>₹{ev.onlineCollected.toLocaleString()}</strong>
                </div>
                <div className="detail-item total">
                  <span>🧾 Total:</span>
                  <strong>
                    ₹{(ev.cashCollected + ev.onlineCollected).toLocaleString()}
                  </strong>
                </div>
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(index)}
                >
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="finance-summary">
        <h3>Overall Totals</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span>💵 Total Cash</span>
            <strong>₹{totalCash.toLocaleString()}</strong>
          </div>
          <div className="summary-item">
            <span>💳 Total Online</span>
            <strong>₹{totalOnline.toLocaleString()}</strong>
          </div>
          <div className="summary-item grand-total">
            <span>🧾 Grand Total</span>
            <strong>₹{grandTotal.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
