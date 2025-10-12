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

  // Calculate total cash, online, and grand total
  const totalCash = financeData.reduce((sum, ev) => sum + ev.cashCollected, 0);
  const totalOnline = financeData.reduce(
    (sum, ev) => sum + ev.onlineCollected,
    0
  );
  const grandTotal = totalCash + totalOnline;

  return (
    <div className="finance-page">
      <h2>Finance Overview</h2>

      <table className="finance-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Cash Collected (₹)</th>
            <th>Online Collected (₹)</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          {financeData.map((ev) => (
            <tr key={ev.eventId}>
              <td>{ev.eventName}</td>
              <td>{ev.cashCollected.toLocaleString()}</td>
              <td>{ev.onlineCollected.toLocaleString()}</td>
              <td>{(ev.cashCollected + ev.onlineCollected).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="totals">
            <td><strong>Total</strong></td>
            <td><strong>₹{totalCash.toLocaleString()}</strong></td>
            <td><strong>₹{totalOnline.toLocaleString()}</strong></td>
            <td><strong>₹{grandTotal.toLocaleString()}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
