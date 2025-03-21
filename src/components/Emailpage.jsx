import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../constants/constants";
const EmailPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    const deviceId = localStorage.getItem("device_id") || crypto.randomUUID();
    localStorage.setItem("device_id", deviceId); // Store device ID

    const requestBody = {
      device_id: deviceId,
      is_external_bb_access_token: true,
      login_email: email,
      login_request_from: "email",
      login_request_mode: "sendotp",
      login_role: "customer",
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/superadmin/cms_users/verifyemail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "bb-access-token": localStorage.getItem("Authn"),
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log("email otp", data);

      if (response.ok) {
        localStorage.setItem("EmailToken1", data.token_id
        );
        localStorage.setItem("userEmail", email);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h5 style={styles.heading}>Email</h5>
        <p style={styles.subHeading}>Enter your email to receive OTP</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Enter Email"
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Get OTP in your email
          </button>
        </form>
      </div>
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
  card: {
    
    textAlign: "center",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
  },
  subHeading: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px",
  },
  input: {
    width: "90%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #CCC",
    outline: "none",
    marginBottom: "12px",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginBottom: "12px",
  },
  button: {
    width: "90%",
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

export default EmailPage;
