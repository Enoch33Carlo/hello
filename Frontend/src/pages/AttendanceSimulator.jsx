import React, { useEffect, useState } from "react";

export default function AttendanceSimulator() {
  const [students, setStudents] = useState([
    { id: 1, name: "John", attended: false },
    { id: 2, name: "Maria", attended: false },
    { id: 3, name: "Ravi", attended: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStudents((prev) => {
        const updated = [...prev];
        const absent = updated.filter((s) => !s.attended);
        if (absent.length > 0) {
          const random = absent[Math.floor(Math.random() * absent.length)];
          random.attended = true;
        }
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="attendance-sim">
      <h2>🎯 Real-Time Attendance Simulation</h2>
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name} — {s.attended ? "✅ Present" : "❌ Absent"}
          </li>
        ))}
      </ul>
    </div>
  );
}
