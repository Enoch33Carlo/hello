import React from "react";
import "./verify.css";
import authImage from "./auth-image.jpg";

const VerificationCode = () => {
  return (
    <div className="verify-bg">
      <div className="verify-card">
        <div className="verify-left">
          <img src={authImage} alt="Verification Visual" />
        </div>

        <div className="verify-right">
          <h2>Verify Your Email</h2>
          <p>Enter the 6-digit code sent to your email.</p>

          <form>
            <input type="text" placeholder="Enter verification code" required />
            <button className="verify-btn" type="submit">
              Verify
            </button>
          </form>

          <div className="verify-footer">
            <p>
              Didn’t receive the code? <a href="#">Resend Code</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
