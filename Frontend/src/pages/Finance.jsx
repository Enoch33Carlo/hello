import React, { useState, useEffect } from "react";
import "../styles/f_layout2.css";

export default function Finance() {
  const [financeData, setFinanceData] = useState([]);

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

  return (
    <div className="finance-page">
      <h2 className="finance-title">Finance Overview</h2>

      <div className="finance-card-container">
        {financeData.map((ev) => (
          <div key={ev.eventId} className="finance-card">
            <h3 className="event-name">{ev.eventName}</h3>

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
            </div>
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
