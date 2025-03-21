import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import API_BASE_URL from "../constants/constants";
const PanCardVerification = () => {
  const [panCardImage, setPanCardImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Please upload a valid image (JPEG or PNG).");
        return;
      }

      setErrorMessage("");
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => setPanCardImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyClick = async () => {
    if (!selectedFile) {
      setErrorMessage("Please upload a PAN card image first.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("id_type", "pan");
      formData.append("attachment_list", selectedFile);

      const response = await fetch(`${API_BASE_URL}/v1/cmsvalidation/cms/verifyid`, {
        method: "PUT",
        headers: {
          "bb-access-token": localStorage.getItem("Emailtoken2"),
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("pan response", data);

        if (data.code === "000") {
          setSuccessMessage("✅ PAN Card Verification Successful! Click on Next");
          setSnackbarOpen(true);
        } else {
          throw new Error(data.message || "Verification failed.");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed.");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
     // Replace with your actual next page route
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h5 style={styles.title}>PAN Card Verification</h5>

        <input type="file" accept="image/*" onChange={handleFileChange} style={styles.input} />

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {panCardImage && (
          <div>
            <h4 style={styles.label}>Uploaded PAN Card:</h4>
            <img src={panCardImage} alt="PAN Card" style={styles.image} />
          </div>
        )}

        <div style={styles.buttonContainer}>
          <button onClick={handleVerifyClick} style={styles.button} disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>

      {/* Snackbar for success message */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="success" variant="filled">
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    
    justifyContent: "center",
    alignItems: "center",
    
  },
  card: {
    
    textAlign: "center",
  },
  title: { fontSize: "24px", color: "#007bff", marginBottom: "20px" },
  input: { padding: "10px", width: "100%", textAlign: "center", cursor: "pointer" },
  error: { color: "red", marginTop: "10px" },
  label: { marginTop: "15px", color: "#555" },
  image: { width: "300px", height: "200px", borderRadius: "8px", marginTop: "10px", objectFit: "contain" },
  buttonContainer: { marginTop: "20px" },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default PanCardVerification;
