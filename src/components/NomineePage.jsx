import React, { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import API_BASE_URL from '../constants/constants';
const identityproof = [
  { value: 'aadhaar', label: 'AADHAAR' },
  { value: 'passport', label: 'PASSPORT' },
  { value: 'pan', label: 'PAN' },
  { value: 'voter_id', label: 'VOTER ID' },
  { value: 'driving_license', label: 'DRIVING LICENSE' },
];

const relationships = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'husband', label: 'Husband' },
  { value: 'wife', label: 'Wife' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'grandfather', label: 'Grandfather' },
  { value: 'grandmother', label: 'Grandmother' },
];

const NomineeDetails = ({ nextStep, prevStep }) => {
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [selectedIdentityProof, setSelectedIdentityProof] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleRelationshipChange = (selectedOption) => {
    setSelectedRelationship(selectedOption);
  };

  const handleIdentityProofChange = (selectedOption) => {
    setSelectedIdentityProof(selectedOption);
    setFile(null); // Reset file when identity proof type changes
    setPreview(null);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a proof file before uploading.");
      return;
    }

    // Ensure the token exists before proceeding
    const emailToken = localStorage.getItem("Emailtoken2");

    if (!emailToken) {
      alert("Token not found. Please log in again.");
      return;
    }

    // Collect nominee details (you can adjust these fields as necessary)
    const nomineeName = document.querySelector("input[name='nomineeName']").value;
    const relationship = selectedRelationship ? selectedRelationship.label : "N/A";
    const identityProof = selectedIdentityProof ? selectedIdentityProof.label : "N/A"; // Added for identity proof

    const formData = new FormData();
    formData.append("id_type", selectedIdentityProof.value); // ID type (e.g., 'aadhaar', 'passport', etc.)
    formData.append("nominee_name", nomineeName);           // Nominee's name
    formData.append("relationship", relationship);           // Relationship to the account holder
    formData.append("identity_proof", identityProof);       // Identity proof
    formData.append("id_information", file);               // Attach the proof file

    setLoading(true); // Start spinner
    setSuccess(""); // Clear previous success message
    setError(""); // Clear any previous errors

    try {
      const response = await axios.put(
        `${API_BASE_URL}/v1/cmsvalidation/cms/nominee/upload`, // Adjust the URL accordingly
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "bb-access-token": emailToken, // Use the token retrieved from localStorage
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Nominee details submitted successfully!");
      } else {
        setError("Failed to submit nominee details. Please try again.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload nominee details. Please try again.");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="container mt-5">
      <h4 className="text-center mb-4">Nominee Information</h4>
      <Form>
        <div className="row">
          {/* Relationship */}
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Relationship</Form.Label>
              <Select
                options={relationships}
                onChange={handleRelationshipChange}
                value={selectedRelationship}
                getOptionLabel={(e) => e.label} // This ensures the label is displayed
              />
            </Form.Group>
            
          </div>

          {/* Name */}
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Nominee Name</Form.Label>
              <Form.Control type="text" maxLength="25" placeholder="Enter Name" name="nomineeName" />
            </Form.Group>
          </div>
        </div>

        {/* Proof of Identity */}
        <div className="row">
          <div className="col-md-12">
            <Form.Group className="mb-3">
              <Form.Label>Proof of Identity</Form.Label>
              <Select options={identityproof} onChange={handleIdentityProofChange} value={selectedIdentityProof} />
            </Form.Group>
          </div>
        </div>

        {/* File Upload Section */}
        {selectedIdentityProof && (
          <div className="row">
            <div className="col-md-12 text-center">
              <Form.Group>
                <Form.Label>Upload {selectedIdentityProof.label} (PNG or JPEG only)</Form.Label>
                <Form.Control type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
              </Form.Group>

              {/* Image Preview */}
              {preview && (
                <div className="mt-3">
                  <img src={preview} alt="Uploaded Proof" className="img-fluid" style={{ maxWidth: "300px" }} />
                </div>
              )}

              {/* Upload Button (Only visible when a file is selected) */}
              {file && (
                <Button className="mt-3" variant="success" onClick={handleSubmit} disabled={loading}>
                  {loading ? <Spinner as="span" animation="border" size="sm" /> : "Upload"}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && <div className="alert alert-success mt-4">{success}</div>}
        {error && <div className="alert alert-danger mt-4">{error}</div>}

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between mt-4">
        
        </div>
      </Form>
    </div>
  );
};

export default NomineeDetails;
