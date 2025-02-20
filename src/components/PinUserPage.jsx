import React, { useState } from "react";
import PinInput from "react-pin-input";
import { useNavigate } from "react-router-dom";

const PinSetupPage = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError("Please enter a valid 4-digit PIN");
      return;
    }

    setLoading(true);
    setError("");

    const deviceId = localStorage.getItem("device_id") || crypto.randomUUID();
    const loginEmail = localStorage.getItem("user_email") || "roopashree_v@bullbox.in";

    try {
      const response = await fetch("http://localhost:1337/v1/superadmin/cms_users/verifyemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "bb-access-token": localStorage.getItem("Emailtoken2"),
        },
        body: JSON.stringify({
          device_id: deviceId,
          is_external_bb_access_token: true,
          login_email: loginEmail,
          login_request_from: "pin",
          login_hint: pin,
          login_request_mode: "verifypin",
          login_role: "customer",
        }),
      });

      const data = await response.json();
      console.log("PIN Verification Response:", data);

      if (data.code === "000") {
        alert("PIN verified successfully!");
        localStorage.setItem("Pintoken", data.token_id)
        // Proceed to next step
      } else {
        setError(data.messageText || "Invalid PIN. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying PIN:", error);
      setError("An error occurred while verifying the PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h5 style={styles.heading}>Verify Your PIN</h5>
        <p style={styles.subHeading}>Enter your 4-digit PIN to continue</p>

        <PinInput
          length={4}
          type="numeric"
          inputMode="number"
          secret
          onChange={(value) => setPin(value)}
          style={styles.pinContainer}
          inputStyle={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? "Verifying..." : "Confirm PIN"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#F4F7FC",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "90%",
    maxWidth: "380px",
    padding: "24px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
  pinContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "12px",
  },
  input: {
    width: "50px",
    height: "50px",
    fontSize: "24px",
    textAlign: "center",
    borderRadius: "6px",
    border: "1px solid #CCC",
    margin: "0 5px",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "8px",
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
    marginTop: "16px",
  },
};

export default PinSetupPage;
