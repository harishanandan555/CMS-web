import React, { useState, useEffect } from "react";
import { Button, Typography, Box, CircularProgress, Alert, Snackbar } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const ChequeUpload = () => {
  const [chequeImage, setChequeImage] = useState(null);
  const [file, setFile] = useState(null);
  const [accountNumber, setAccountNumber] = useState("N/A");
  const [bankName, setBankName] = useState("N/A");
  const [ifscCode, setIfscCode] = useState("N/A");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

  useEffect(() => {
    setAccountNumber(localStorage.getItem("accountNumber") || "N/A");
    setBankName(localStorage.getItem("bankName") || "N/A");
    setIfscCode(localStorage.getItem("ifscCode") || "N/A");
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setChequeImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setChequeImage(null);
    setFile(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a cheque image before uploading.");
      return;
    }

    const emailToken = localStorage.getItem("Emailtoken2");
    if (!emailToken) {
      alert("Token not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("id_type", "cheque");
    formData.append("cheque_account_no", accountNumber);
    formData.append("cheque_bank_name", bankName);
    formData.append("cheque_ifsc", ifscCode);
    formData.append("attachment_list", file);

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await axios.put(
        "http://localhost:1337/v1/cmsvalidation/cms/verifyidproof",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "bb-access-token": emailToken,
          },
        }
      );

      console.log("cheque", response.data);
      localStorage.setItem("cheque", response.data.id_information);

      if (response.data.code === 200) {
        setSuccess("Cheque uploaded and verified successfully!");
        setOpenSnackbar(true); // Show Snackbar on success
      } else {
        setError(response.data.messageText);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload and verify cheque. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Upload Bank Cheque Leaf
      </Typography>

      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ marginBottom: 2 }}
      >
        Select Cheque Image
        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
      </Button>

      {chequeImage && (
        <Box sx={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={chequeImage}
            alt="Cheque Preview"
            style={{ width: "100%", maxWidth: "350px", borderRadius: "5px" }}
          />

          <Button color="error" onClick={handleRemoveImage} sx={{ marginTop: 1 }}>
            Remove Image
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ marginTop: 2, width: "200px" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Upload Cheque"}
          </Button>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ marginTop: 10 }}>{error}</Alert>}

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={success}
      />
    </Box>
  );
};

export default ChequeUpload;
