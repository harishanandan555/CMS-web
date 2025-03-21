import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBTextArea,
  MDBInput,
} from "mdb-react-ui-kit";
import { Snackbar, Alert } from "@mui/material";
import API_BASE_URL from "../../constants/constants";
function EventRegistrationForm() {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState("");
  const [mode, setMode] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("success");

const onSubmit = (data) => {
  const token = localStorage.getItem("advisor_token");
  if (!token) {
    alert("Token not found. Please log in again."); // Keep alert for token issue
    return;
  }

  const requestBody = {
    title: data.title,
    campaignType: campaignType,
    eventDate: data.eventDate,
    mode: mode,
    description: data.description,
    totalTickets: Number(data.totalTickets),
    ticketType: data.ticketType,
    ticketPrice: data.ticketType === "Paid" ? Number(data.ticketPrice) : undefined,
    commissionRate: Number(data.commissionRate) || 10,
    regStartDate: data.regStartDate,
    regEndDate: data.regEndDate,
    name: data.name,
    email: data.email,
    phone: data.phone,
  };

  if (mode === "Online") {
    requestBody.eventURL = data.eventURL;
  } else if (mode === "Offline") {
    requestBody.eventAddress = data.eventAddress;
  }

  if (data.ticketType === "Free") {
    delete requestBody.ticketPrice;
  } else {
    requestBody.ticketPrice = Number(data.ticketPrice);
  }

  console.log("API Request Body:", requestBody);

  fetch(`${API_BASE_URL}/v1/cms-advisor/create/event`, {
    method: "POST",
    headers: {
      "bb-access-token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
      setSnackbarMessage("Form submitted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    })
    .catch((error) => {
      console.error("Error:", error);
      setSnackbarMessage("Submission failed.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    });
};


  return (
    <MDBContainer fluid className="bg-light py-5 d-flex justify-content-center" style={{ maxWidth: "1600px" }}>
    <MDBRow className="d-flex justify-content-center">
      <MDBCol md="10">
        <MDBCard className="shadow-lg" style={{ borderRadius: "20px" }}>
          <MDBRow className="g-0">
            {/* Left Side - Image */}
            <MDBCol md="5" className="d-flex align-items-center justify-content-center">
              <MDBCardImage
                src="https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg"
                alt="Finance Event"
                className="rounded-start w-100 h-100"
                style={{ objectFit: "cover", minHeight: "100%" }}
              />


            </MDBCol>

            {/* Right Side - Form */}
            <MDBCol md="7">
              <MDBCardBody className="p-5" style={{ padding: "50px 60px" }}>
                <h5 className="mb-4 text-center fw-semibold fw-light" style={{
                  position: "relative",
                  display: "inline-block",
                  paddingBottom: "6px",
                  fontSize: "1.8rem",
                  letterSpacing: "1px",
                  color: "#3A80BA"
                }}>
                  Event Registration
                  <span style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "0",
                    width: "40%",
                    height: "2px",
                    backgroundColor: "#6c757d",
                    transform: "translateX(-50%)"
                  }}></span>
                </h5>

                <form onSubmit={handleSubmit(onSubmit)}>
  {step === 1 && (
    <>
      <div className="mb-3">
        <label className="form-label">Title (Max 20 chars)</label>
        <input {...register("title", { required: true })} maxLength="20" className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Campaign Type</label>
        <select className="form-select" onChange={(e) => setCampaignType(e.target.value)} value={campaignType}>
          <option value="">Select</option>
          <option value="Marketing">Marketing</option>
          <option value="Education">Education</option>
          <option value="Networking">Networking</option>
          <option value="Workshop">Workshop</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Event Date</label>
        <input type="date" {...register("eventDate", { required: true })} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Mode</label>
        <div className="d-flex gap-3">
          <div className="form-check">
            <input className="form-check-input" type="radio" id="online" name="mode" value="Online" checked={mode === "Online"} onChange={() => setMode("Online")} />
            <label className="form-check-label ms-2" htmlFor="online">Online</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" id="offline" name="mode" value="Offline" checked={mode === "Offline"} onChange={() => setMode("Offline")} />
            <label className="form-check-label ms-2" htmlFor="offline">Offline</label>
          </div>
        </div>
      </div>

      {mode === "Offline" && (
        <div className="mb-3">
          <label className="form-label">Event Address</label>
          <input {...register("eventAddress", { required: true })} className="form-control" />
        </div>
      )}
      {mode === "Online" && (
        <div className="mb-3">
          <label className="form-label">Event URL</label>
          <input type="url" {...register("eventURL", { required: true })} className="form-control" />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Description (Max 50 chars)</label>
        <textarea {...register("description", { required: true })} maxLength="50" className="form-control" />
      </div>
    </>
  )}

{step === 2 && (
  <>
    <div className="mb-3">
      <label className="form-label">Total Tickets</label>
      <input type="number" {...register("totalTickets", { required: true })} className="form-control" />
    </div>

    <div className="mb-3">
      <label className="form-label">Ticket Type</label>
      <select className="form-select" {...register("ticketType", { required: true })}>
        <option value="">Select</option>
        <option value="Free">Free</option>
        <option value="Paid">Paid</option>
      </select>
    </div>

    <div className="mb-3">
      <label className="form-label">Ticket Price</label>
      <input type="number" {...register("ticketPrice")} className="form-control" />
    </div>

    <div className="mb-3">
  <label className="form-label">Commission Rate (%)</label>
  <input
    type="number"
    {...register("commissionRate", { required: true, min: 10 })}
    className="form-control"
    defaultValue={10} // Default is 10%
  />
</div>


    <div className="mb-3">
      <label className="form-label">Registration Start Date</label>
      <input type="date" {...register("regStartDate", { required: true })} className="form-control" />
    </div>

    <div className="mb-3">
      <label className="form-label">Registration End Date</label>
      <input type="date" {...register("regEndDate", { required: true })} className="form-control" />
    </div>
  </>
)}


  {step === 3 && (
    <>
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input {...register("name", { required: true })} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" {...register("email", { required: true })} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone Number</label>
        <input type="tel" {...register("phone", { required: true })} className="form-control" />
      </div>
    </>
  )}

  <div className="d-flex justify-content-between mt-4">
    {step > 1 && (
      <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
        Previous
      </button>
    )}
    {step < 3 ? (
      <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
        Next
      </button>
    ) : (
      <button type="submit" className="btn btn-success">
        Submit
      </button>
    )}
  </div>
</form>

              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBCol>
    </MDBRow>
    <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
  </MDBContainer>

  );
}

export default EventRegistrationForm;
