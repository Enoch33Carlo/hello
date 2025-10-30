import React, { useState } from "react";
import "./signup.css";
import authImage from "./auth-image.jpg";

const SignupPage = () => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, role }),
    });

    const text = await response.text();

    if (response.ok) {
      alert("✅ Signup successful! You can now login.");
      window.location.href = "/";
    } else {
      alert(`❌ ${text}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error, please try again later.");
  }
};

  return (
    <div className="signup-bg">
      <div className="signup-card">
        <div className="signup-left">
          <img src={authImage} alt="Signup" />
        </div>
        <div className="signup-right">
          <h2>Create Account</h2>
          <p>
            Already have an account? <a href="/">Login</a>
          </p>

          {/* Role Selection */}
          <div className="role-buttons">
            <button
              type="button"
              className={role === "student" ? "active" : ""}
              onClick={() => setRole("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={role === "faculty" ? "active" : ""}
              onClick={() => setRole("faculty")}
            >
              Faculty
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="signup-btn">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
