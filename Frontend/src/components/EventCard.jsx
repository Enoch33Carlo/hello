// import React, { useState, useEffect } from "react";
// import "./eventcard.css"; // correct relative path

// export default function EventCardsRow() {
//   const [eventsData, setEventsData] = useState([]);

//   useEffect(() => {
//     fetch("/events.json")
//       .then((res) => res.json())
//       .then((data) => setEventsData(data.slice(0, 3)))
//       .catch((err) => console.error("Error fetching events:", err));
//   }, []);

//   return (
//     <div className="event-cards-row">
//       {eventsData.map((ev) => (
//         <EventCard key={ev.id} ev={ev} />
//       ))}
//     </div>
//   );
// }

// function EventCard({ ev }) {
//   const [showForm, setShowForm] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);

//   const handleOpenForm = () => setShowForm(true);
//   const handleCloseForm = () => setShowForm(false);
//   const handleOpenDetails = () => setShowDetails(true);
//   const handleCloseDetails = () => setShowDetails(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = {
//       fullName: e.target.fullName.value,
//       email: e.target.email.value,
//       department: e.target.department.value,
//       message: e.target.message.value,
//       eventTitle: ev.title,
//     };

//     try {
//       const res = await fetch("http://localhost:5000/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         alert("✅ Registered successfully!");
//         setShowForm(false);
//       } else {
//         const data = await res.json();
//         alert("❌ Error: " + (data.error || "Registration failed"));
//       }
//     } catch (error) {
//       alert("❌ Could not connect to server.");
//     }
//   };

//   return (
//     <>
//       <div className="event-card2">
//         <div className="event-card-left">
//           <div
//             className="event-thumb"
//             style={{ backgroundImage: `url(${ev.image || ""})` }}
//           />
//         </div>

//         <div className="event-card-body">
//           <h4>{ev.title}</h4>
//           <div className="muted">{ev.category} • {ev.date} • {ev.time}</div>
//           <p className="small">📍 <strong>Venue:</strong> {ev.venue || "N/A"}</p>
//           <p className="small">🌆 <strong>Place:</strong> {ev.location || "N/A"}</p>
//           <p className="small desc">{ev.description}</p>

//           <div className="event-card-actions">
//             <button className="btn-primary" onClick={handleOpenForm}>Register</button>
//             <button className="btn-primary" onClick={handleOpenDetails}>View Details</button>
//           </div>
//         </div>
//       </div>

//       {showForm && (
//         <div className="modal-overlay" onClick={handleCloseForm}>
//           <div className="modal-card" onClick={(e) => e.stopPropagation()}>
//             <h3>{ev.title}</h3>
//             <form className="event-form" onSubmit={handleSubmit}>
//               <label>Full Name<input name="fullName" type="text" required /></label>
//               <label>Email<input name="email" type="email" required /></label>
//               <label>Department<input name="department" type="text" /></label>
//               <label>Additional Info<textarea name="message" /></label>
//               <div className="form-actions">
//                 <button type="submit" className="btn-primary">Submit</button>
//                 <button type="button" className="btn-secondary" onClick={handleCloseForm}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showDetails && (
//         <div className="modal-overlay" onClick={handleCloseDetails}>
//           <div className="modal-card" onClick={(e) => e.stopPropagation()}>
//             <h3>{ev.title}</h3>
//             <p>{ev.category} • {ev.date} • {ev.time}</p>
//             <p><strong>Venue:</strong> {ev.venue}</p>
//             <p><strong>Place:</strong> {ev.location}</p>
//             <p><strong>Description:</strong> {ev.description}</p>
//             <div className="form-actions">
//               <button type="button" className="btn-secondary" onClick={handleCloseDetails}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// 
import React, { useState, useEffect } from "react";
import "./eventcard.css";

export default function EventCardsRow() {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
  let isMounted = true;

  fetch("/events.json", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (isMounted && Array.isArray(data)) {
        const unique = data.filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.id === event.id)
        );
        setEventsData(unique.slice(0, 3));
      }
    })
    .catch((err) => console.error("Error fetching events:", err));

  return () => {
    isMounted = false;
  };
}, []);



  return (
    <div className="event-cards-row">
      {eventsData.map((ev) => (
        <EventCard key={ev.id} ev={ev} />
      ))}
    </div>
  );
}

function EventCard({ ev }) {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      department: e.target.department.value,
      message: e.target.message.value,
      eventTitle: ev.title,
    };

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Registered successfully!");
        setShowForm(false);
      } else {
        const data = await res.json();
        alert("❌ Error: " + (data.error || "Registration failed"));
      }
    } catch (error) {
      alert("❌ Could not connect to server.");
    }
  };

  return (
    <>
      <div className="event-card2">
        <div className="event-card-left">
          <div
            className="event-thumb"
            style={{ backgroundImage: `url(${ev.image || ""})` }}
          />
        </div>

        <div className="event-card-body">
          <h4>{ev.title}</h4>
          <div className="muted">{ev.category} • {ev.date} • {ev.time}</div>
          <p className="small">📍 <strong>Venue:</strong> {ev.venue || "N/A"}</p>
          <p className="small">🌆 <strong>Place:</strong> {ev.location || "N/A"}</p>
          <p className="small desc">{ev.description}</p>

          <div className="event-card-actions">
            <button className="btn-primary" onClick={() => setShowForm(true)}>Register</button>
            <button className="btn-primary" onClick={() => setShowDetails(true)}>View Details</button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{ev.title}</h3>
            <form className="event-form" onSubmit={handleSubmit}>
              <label>Full Name<input name="fullName" type="text" required /></label>
              <label>Email<input name="email" type="email" required /></label>
              <label>Department<input name="department" type="text" /></label>
              <label>Additional Info<textarea name="message" /></label>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Submit</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{ev.title}</h3>
            <p>{ev.category} • {ev.date} • {ev.time}</p>
            <p><strong>Venue:</strong> {ev.venue}</p>
            <p><strong>Place:</strong> {ev.location}</p>
            <p><strong>Description:</strong> {ev.description}</p>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowDetails(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

