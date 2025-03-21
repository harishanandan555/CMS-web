import React, { useState } from "react";
import OTPInput from "otp-input-react";
import PinInput from "react-pin-input";
import API_BASE_URL from "../constants/constants";
const PanOTPPage = () => {
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailOtpChange = (value) => {
    setEmailOtp(value);
    setError("");
  };

  const handleMobileOtpChange = (value) => {
    setMobileOtp(value);
    setError("");
  };

  const verifyOtp = async () => {
    if (emailOtp.length !== 6 || mobileOtp.length !== 6) {
      setError("Please enter valid 6-digit OTPs.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/superadmin/cms_users/validate_otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "bb-access-token": localStorage.getItem("EmailToken1"),
        },
        body: JSON.stringify({
          email_otp: emailOtp,
          mobile_otp: mobileOtp,
          login_request_from: "email",
          login_request_mode: "verifyemailotp",
          device_id: localStorage.getItem("device_id") || crypto.randomUUID(),
          login_role: "customer",
        }),
      });

      const data = await response.json();

      if (data.code === "000") {
        localStorage.setItem("EmailToken2", data.token_id);
        setSuccessMessage("OTP verified successfully!");
      } else {
        setError(data.messageText || "OTP verification failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while verifying the OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "30px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h5 style={{ color: "#007bff", fontWeight: "bold", fontSize: "24px" }}>
          OTP Verification
        </h5>

        {/* Email OTP Input */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#555", marginBottom: "8px" }}>Enter Email OTP</p>
          <PinInput
            length={6}
            initialValue={emailOtp}
            type="numeric"
            inputStyle={{
              width: "45px",
              height: "45px",
              margin: "0 3px",
              border: "1px solid #007bff",
              borderRadius: "6px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333",
              backgroundColor: "#fff",
            }}
            onChange={handleEmailOtpChange}
          />
        </div>

        {/* Mobile OTP Input */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#555", marginBottom: "8px" }}>Enter Mobile OTP</p>
          <PinInput
            length={6}
            initialValue={mobileOtp}
            type="numeric"
            inputStyle={{
              width: "45px",
              height: "45px",
              margin: "0 3px",
              border: "1px solid #007bff",
              borderRadius: "6px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333",
              backgroundColor: "#fff",
            }}
            onChange={handleMobileOtpChange}
          />
        </div>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}

        {/* Verify OTP Button */}
        <button
          onClick={verifyOtp}
          disabled={emailOtp.length < 6 || mobileOtp.length < 6 || loading}
          style={{
            marginTop: "20px",
            padding: "12px",
            width: "100%",
            background: emailOtp.length < 6 || mobileOtp.length < 6 ? "#ccc" : "#28a745",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: emailOtp.length < 6 || mobileOtp.length < 6 ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default PanOTPPage;
