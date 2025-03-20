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
import { useLocation } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function EditEvent() {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState("");
  const [mode, setMode] = useState("");
  const location = useLocation();
  const eventData = location.state?.eventData || {};

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  console.log("Received Event Data:", eventData);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value !== undefined ? value : prev[name], // Retain existing value if undefined
    }));
  };
  



  const onSubmit = (data, event) => {
    event?.preventDefault();
    const token = localStorage.getItem("advisor_token");
    if (!token) {
      alert("Token not found. Please log in again."); // Keep alert for token issue
      return;
    }

    const requestBody = {
      eventId: eventData.id,
      campaignType: formData.campaignType,
      title: formData.title,
      description: formData.description,
      commission: Number(formData.commissionRate),
      eventDate: formData.eventDate,
      regStartDate: formData.regStartDate,
      regEndDate: formData.regEndDate,
      tickets: [
        {
          totalTickets: Number(formData.totalTickets),
          ticketType: formData.ticketType,
          ticketPrice: formData.ticketType === "Paid" ? Number(formData.ticketPrice) : 0,
        },
      ],
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      mode: formData.mode,
      ...(formData.mode === "Online" ? { eventURL: formData.eventURL } : {}),
      ...(formData.mode === "Offline" ? { eventAddress: formData.eventAddress } : {}),
    };

    console.log("Updated API Request Body:", requestBody);

    fetch("http://localhost:1337/v1/cms-advisor/edit/event", {
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
        setSnackbarMessage("Event updated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setSnackbarMessage("Failed to update event. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  };
  
  
  const [formData, setFormData] = useState({
    title: eventData.title || "",
    campaignType: eventData.campaign_type || "",
    eventDate: eventData.eventDate ? eventData.eventDate.split("T")[0] : "",
    mode: eventData.mode || "",
    eventAddress: eventData.eventAddress || "",
    eventURL: eventData.url || "",
    description: eventData.description || "",
    totalTickets: eventData.tickets?.[0]?.totaltickets || 0, // Extract total tickets
    ticketType: eventData.ticketType || "", // Default to "General" if not available
    ticketPrice: eventData.tickets?.[0]?.amount || 0, // Extract ticket price
    commissionRate: eventData.commissionRate || 10, // Default 10%
    regStartDate: eventData.registrationStart ? eventData.registrationStart.split("T")[0] : "",
    regEndDate: eventData.registrationEnd ? eventData.registrationEnd.split("T")[0] : "",
    name: eventData.name || "",
    email: eventData.email || "",
    phone: eventData.phone || "",
  });

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
                          <label className="form-label">Title</label>
                          <input name="title" className="form-control" value={formData.title} onChange={onChangeHandler} />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Campaign Type</label>
                          <select className="form-select" name="campaignType" value={formData.campaignType} onChange={onChangeHandler}>
                            <option value="">Select</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Education">Education</option>
                            <option value="Networking">Networking</option>
                            <option value="Workshop">Workshop</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Event Date</label>
                          <input type="date" name="eventDate" className="form-control" value={formData.eventDate} onChange={onChangeHandler} />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Mode</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input className="form-check-input" type="radio" id="online" name="mode" value="Online" checked={formData.mode === "Online"} onChange={onChangeHandler} />
                              <label  className="form-check-label ms-2" htmlFor="online">Online</label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" id="offline" name="mode" value="Offline" checked={formData.mode === "Offline"} onChange={onChangeHandler} />
                              <label  className="form-check-label ms-2" htmlFor="offline" >Offline</label>
                            </div>
                          </div>
                        </div>

                        {formData.mode === "Offline" && (
                          <div className="mb-3">
                            <label className="form-label">Event Address</label>
                            <input name="eventAddress" className="form-control" value={formData.eventAddress} onChange={onChangeHandler} />
                          </div>
                        )}

                        {formData.mode === "Online" && (
                          <div className="mb-3">
                            <label className="form-label">Event URL</label>
                            <input type="url" name="eventURL" className="form-control" value={formData.eventURL} onChange={onChangeHandler} />
                          </div>
                        )}

                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={onChangeHandler} />
                        </div>
                      </>
                    )}



                    {step === 2 && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Total Tickets</label>
                          <input type="number" name="totalTickets" className="form-control" value={formData.totalTickets} onChange={onChangeHandler} />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Ticket Type</label>
                          <select className="form-select" name="ticketType" value={formData.ticketType} onChange={onChangeHandler}>
                            <option value="">Select</option>
                            <option value="Free">Free</option>
                            <option value="Paid">Paid</option>
                          </select>

                        </div>

                        {formData.ticketType === "Paid" && (
                          <div className="mb-3">
                            <label className="form-label">Ticket Price</label>
                            <input type="number" name="ticketPrice" className="form-control" value={formData.ticketPrice} onChange={onChangeHandler} />
                          </div>
                        )}

                        <div className="mb-3">
                          <label className="form-label">Commission Rate (%)</label>
                          <input type="number" name="commissionRate" className="form-control" value={formData.commissionRate} onChange={onChangeHandler} />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Registration Start Date</label>
                          <input type="date" name="regStartDate" className="form-control" value={formData.regStartDate} onChange={onChangeHandler} />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Registration End Date</label>
                          <input type="date" name="regEndDate" className="form-control" value={formData.regEndDate} onChange={onChangeHandler} />
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Full Name</label>
                          <input name="name" className="form-control" value={formData.name} onChange={onChangeHandler} />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input type="email" name="email" className="form-control" value={formData.email} onChange={onChangeHandler} />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={onChangeHandler} />
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

export default EditEvent;
