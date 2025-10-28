import React from "react";
import "./forgot.css";
import authImage from "./auth-image.jpg";

const ForgotPassword = () => {
  return (
    <div className="forgot-bg">
      <div className="forgot-card">
        <div className="forgot-left">
          <img src={authImage} alt="Forgot Password Visual" />
        </div>

        <div className="forgot-right">
          <h2>Forgot Password</h2>
          <p>
            Enter your registered email to receive a verification code for password reset.
          </p>

          <form>
            <input type="email" placeholder="Enter your email" required />
            <button className="forgot-btn" type="submit">
              Send Verification Code
            </button>
          </form>

          <div className="forgot-footer">
            <p>
              Remembered your password? <a href="/">Back to Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
