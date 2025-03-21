import React, { useState, useEffect } from "react";
import OTPInput, { ResendOTP } from "otp-input-react";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import PinInput from "react-pin-input";
import API_BASE_URL from "../constants/constants";
const EmailOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [storedOtp, setStoredOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve OTP from localStorage
    const savedOtp = localStorage.getItem("otp");
    if (savedOtp) {
      setStoredOtp(savedOtp);
    }
  }, []);

  const handleOtpChange = (otpValue) => {
    setOtp(otpValue);
    setError(""); // Clear error on input change
  };

  const handleResendOtp = () => {
    console.log("Resend OTP clicked");
    // Simulate OTP resend logic
    alert("OTP resent successfully!");
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP.");
        return;
    }
    console.log("OTP received:", otp);
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const deviceId = localStorage.getItem("device_id") || crypto.randomUUID(); // Ensure device ID persistence

    try {
        const response = await fetch(`${API_BASE_URL}/v1/superadmin/cms_users/validate_otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "bb-access-token": localStorage.getItem("EmailToken1"),
            },
            body: JSON.stringify({
                login_otp: otp,
                login_request_from: "email",
                login_request_mode: "verifyemailotp",
                device_id: deviceId,
                login_role: "customer",
            }),
        });

        const data = await response.json();
        console.log("email of OTP", data)

        if (data) {
            
            localStorage.setItem("Emailtoken2", data.token_id); // Then store token
            setSuccessMessage("OTP verified successfully! Click on Next");
            console.log("Navigating to PIN page...");
        } else {
            setError(data.messageText || "OTP verification failed. Please try again.");
        }
        
    } catch (error) {
        console.error("Error verifying OTP:", error);
        setError("An error occurred while verifying the OTP. Please try again.");
    } finally {
        setLoading(false);
    }
};


  // const renderResendButton = (reset) => (
  //   <button
  //     style={{
  //       background: "linear-gradient(45deg, #007bff, #00c6ff)",
  //       padding: "12px",
  //       borderRadius: "8px",
  //       width: "60%",
  //       color: "white",
  //       fontWeight: "bold",
  //       fontSize: "16px",
  //       border: "none",
  //       cursor: "pointer",
  //       marginTop: "15px",
  //     }}
  //     onClick={reset}
  //   >
  //     Resend OTP
  //   </button>
  // );

  const renderCountdown = (remainingTime) => (
    <p style={{ color: "#555", marginTop: "10px" }}>
      Resend available in: {remainingTime}s
    </p>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
       
      }}
    >
      <div
        style={{
        
          textAlign: "center",
        }}
      >
        <h5 style={{ color: "#007bff", fontWeight: "bold", fontSize: "24px" }}>
          OTP Verification
        </h5>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Enter the OTP sent to your registered email.
        </p>
        <PinInput
            length={6}
            initialValue={otp}
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
            onChange={handleOtpChange}
          />
        

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}

        {/* <div style={{ marginTop: "20px" }}>
          <ResendOTP
            maxTime={90}
            renderButton={renderResendButton}
            renderTime={renderCountdown}
            onResendClick={handleResendOtp}
          />
        </div> */}

        <button
          onClick={verifyOtp}
          disabled={otp.length < 6 || loading}
          style={{
            marginTop: "20px",
            padding: "12px",
            width: "100%",
            background: otp.length < 6 ? "#ccc" : "linear-gradient(45deg, #28a745, #40c057)",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: otp.length < 6 || loading ? "not-allowed" : "pointer",
            transition: "0.3s",
          }}
        >
          {loading ? (
            <>
              <OrbitProgress variant="spikes" size={20} color="blue" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailOtpPage;
