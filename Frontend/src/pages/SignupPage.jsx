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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing users
    const key = role === "student" ? "students" : "faculty";
    const existingUsers = JSON.parse(localStorage.getItem(key)) || [];

    // Check for duplicate email
    if (existingUsers.some((u) => u.email === formData.email)) {
      alert("User with this email already exists!");
      return;
    }

    // Save new user
    existingUsers.push(formData);
    localStorage.setItem(key, JSON.stringify(existingUsers));

    alert(`Signup successful as ${role}! You can now login.`);
    window.location.href = "/login";
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
