import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Snackbar, Alert } from "@mui/material";

const AddUserScreen = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleLoginClick = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    let device_id = localStorage.getItem("device_id");
    if (!device_id) {
      device_id = uuidv4();
      localStorage.setItem("device_id", device_id);
    }

    const getDeviceInfo = () => navigator.userAgent;

    const config = {
      device_id,
      device_information: getDeviceInfo(),
      login_email: "",
      login_hint: "",
      login_mobile_number: mobileNumber,
      login_request_from: "mobile",
      login_role: "customer",
      screen_name: "signin",
    };

    try {
      const response = await fetch("http://localhost:1337/v1/superadmin/cms_users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        localStorage.setItem("otptoken", data.token_id);
        localStorage.setItem("navigateScreen", data.navigateScreen);
        
        setSnackbarMessage("OTP has been sent to your mobile number. Click on next.");
        setSnackbarOpen(true); // Show Snackbar
      } else {
        setError(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div>
        <h5 style={styles.heading}>Register</h5>
        <p style={styles.subHeading}>Enter your mobile number to receive OTP</p>

        <input
          type="text"
          value={mobileNumber}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="Enter Mobile Number"
          maxLength="10"
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handleLoginClick}>
          Get OTP
        </button>
      </div>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Close after 3 seconds
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "22px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: "8px",
    marginTop: "2px",
  },
  subHeading: {
    fontSize: "14px",
    textAlign: "center",
    color: "#666",
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #CCC",
    outline: "none",
    marginBottom: "12px",
    transition: "border-color 0.3s",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginBottom: "12px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007BFF",
    color: "#FFFFFF",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default AddUserScreen;
