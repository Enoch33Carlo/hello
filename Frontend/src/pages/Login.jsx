
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  const { email, password } = formData;

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(errorText);
      return;
    }

    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data.user));

    if (role === "student") navigate("/student");
    else navigate("/faculty/f_dash");
  } catch (err) {
    console.error("Login failed:", err);
    alert("Error connecting to server");
  }
};


  return (
    <div className="login-bg">
      <div className="login-card">
        {/* Left side image */}
        <div className="login-left">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
            alt="login visual"
          />
        </div>

        {/* Right side form */}
        <div className="login-right">
          <h2>Welcome Back</h2>
          <p>
            Login to your account as <span>{role}</span>
          </p>

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

          {/* ✅ Updated to use handleLogin */}
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account?{" "}
            <a href="/signup" className="link">
              Sign up
            </a>
          </p>

          <p className="forgot-password-text">
            <a href="/forgot-password" className="link">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
