import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal, Table } from "react-bootstrap";
import { FaHeart, FaEllipsisV } from "react-icons/fa";
import moment from "moment";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Snackbar, Alert } from "@mui/material";
import API_BASE_URL from "../../constants/constants";


const AdvisorEvent = () => {
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  const handleOpenModal = (eventId) => {
    console.log("Opening modal for event:", eventId); // Debugging log
    setSelectedEventId(eventId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedEventId(null);
  };

  const toggleDropdown = (eventId) => {
    setActiveDropdown(activeDropdown === eventId ? null : eventId);
  };


  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("advisor_token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const fk_login_id = localStorage.getItem("advisor_fk_login_id"); // Get advisor ID

      const config = {
        headers: {
          "bb-access-token": token,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/v1/cms/details`,
        { fk_login_id },
        config
      );

      console.log("Event Details Response:", response.data);

      const eventResults = response.data?.result?.events || [];

      if (!Array.isArray(eventResults) || eventResults.length === 0) {
        alert("No events found.");
        setEventList([]);
        setLoading(false);
        return;
      }

      const formattedEvents = eventResults.map(eventData => {
        const eventDetails = eventData.eventDetails || {};
        const step1 = eventDetails.step1?.[0] || {};
        const step2 = eventDetails.step2?.[0] || {};
        const step3 = eventDetails.step3?.[0] || {};

        return {
          id: eventDetails._id || "N/A",
          campaign_type: step1.campaignType || "N/A",
          title: step1.title || "No Title",
          description: step1.description || "No Description",
          commissionRate: step1.commission || 10, // Default to 10% if missing
          created_by: step1.created_by || "N/A",
          created_date: step1.created_date || "N/A",
          is_active: step1.is_active ?? true, // Default to true if missing

          eventDate: step2.eventDate || "No Date",
          registrationStart: step2.regStartDate || "N/A",
          registrationEnd: step2.regEndDate || "N/A",

          name: step2.formFields?.name || "N/A",
          email: step2.formFields?.email || "N/A",
          phone: step2.formFields?.phone || "N/A",

          tickets: Array.isArray(step2.tickets)
            ? step2.tickets.map(ticket => ({
              totaltickets: ticket.totalTickets || 0,
              amount: ticket.ticketPrice || 0,
              type: ticket.ticketType 
            }))
            : [], // Default to an empty array if tickets are not available

          eventAddress: step3.eventAddress ,
          mode: step3.mode || "N/A",
          customers: eventDetails.customers || [],
          is_cancelled: eventDetails.is_cancelled ?? false,
        };
      });

      console.log("Formatted Event Details:", formattedEvents);

      setEventList(formattedEvents);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError("Failed to fetch event details.");
    }

    setLoading(false);
  };


  const downloadCSV = (event) => {
    if (!event || !event.customers || event.customers.length === 0) {
      alert("No customer data available for download.");
      return;
    }

    const headers = ["Name", "Mobile", "Email", "Tickets Booked", "State", "Country", "Registered On"];
    const csvRows = event.customers.map(customer => [
      customer.name,
      customer.phoneNumber,
      customer.email,
      customer.numberOfTickets,
      customer.state,
      customer.country,
      customer.registeredOn,
    ]);
    

    const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.title}_customers.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventId) return;

    const token = localStorage.getItem("advisor_token");
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/v1/cms/delete/event`, {
        method: "POST",
        headers: {
          "bb-access-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: selectedEventId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage("Event deleted successfully!");
        setSnackbarSeverity("success");
        console.log(`Event ${selectedEventId} deleted.`);
      } else {
        setSnackbarMessage(data.messageText || "Failed to delete event");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Delete event error:", error);
      setSnackbarMessage("Failed to delete event. Please try again.");
      setSnackbarSeverity("error");
    }
  
    setOpenSnackbar(true);
    handleCloseModal(); 

    handleCloseModal(); // Close modal after deletion
  };



  return (
    <Container className="mt-3">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-primary fw-bold">Event List</h5>
        <Button
          variant="primary"
          onClick={() => navigate("/new-event")} // Replace with actual functionality
        >
          Add Event +
        </Button>
      </div>

      {loading ? (
        <div className="alert alert-info text-center">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : eventList.length > 0 ? (
        <Row>
          {eventList.map((event) => (
            <Col key={event.id} xs={12} md={6} lg={6} className="mb-3">
              <Card className="shadow-sm position-relative">
                {/* Favorite Heart Icon */}
                <FaHeart
                  className="position-absolute"
                  onClick={() => setFavorites((prev) => ({ ...prev, [event.id]: !prev[event.id] }))}
                  style={{
                    top: "8px",
                    right: "50px", // Adjusted to prevent overlap
                    fontSize: "20px",
                    cursor: "pointer",
                    background: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "50%",
                    padding: "4px",
                    color: favorites[event.id] ? "red" : "gray",
                  }}
                />

                {/* Three Dots Icon as Dropdown Trigger */}
                <Dropdown className="position-absolute" show={activeDropdown === event.id} onToggle={() => toggleDropdown(event.id)} style={{ top: "8px", right: "10px" }}>
                  <Dropdown.Toggle
                    variant="light"
                    id={`dropdown-${event.id}`}
                    style={{
                      border: "none",
                      background: "transparent",
                      boxShadow: "none",
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        transition: "background 0.3s ease-in-out",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(128, 128, 128, 0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <FaEllipsisV style={{ color: "gray", fontSize: "22px", fontWeight: "bold" }} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/edit-event", { state: { eventData: event } })}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleOpenModal(event.id)}>
                      Delete
                    </Dropdown.Item>

                  </Dropdown.Menu>
                </Dropdown>


                {/* Date Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "8px 12px",
                    borderRadius: "50px",
                    width: "55px",
                    height: "55px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#ff5722" }}>
                    {moment(event.eventDate).format("DD")}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {moment(event.eventDate).format("MMM")}
                  </span>
                </div>

                <Card.Img
                  variant="top"
                  src={`/assets/images/event${(eventList.indexOf(event) % 4) + 1}.jpg`}
                  alt={event.title}
                  style={{ height: "150px", objectFit: "cover" }}
                />

                <Card.Body className="p-2">
                  <h6 className="fw-bold text-truncate">{event.title || "No Title"}</h6>
                  <p className="text-muted mb-1" style={{ fontSize: "14px" }}>
                    📅 {moment(event.eventDate).format("DD MMM YYYY, hh:mm A") || "No Date"}
                  </p>
                  <p className="mb-1" style={{ fontSize: "12px" }}>
                    📍 {event.eventAddress || "Offline"}
                    <span className="text-muted mx-3">|</span>
                    <span className="fw-bold text-success">
                      {event.tickets.length > 0
                        ? event.tickets
                          .map((ticket) =>
                            ticket.amount === 0
                              ? `Free`
                              : ` $${ticket.amount}`
                          )
                          .join(", ")
                        : "Free"}

                    </span>

                  </p>

                  <p className="mb-2" style={{ fontSize: "12px" }}>
                    📝 {event.campaign_type || "N/A"}
                  </p>

                  {/* People Joined Section - Clickable */}
                  <div
                    className="d-flex align-items-center mt-2"
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                      backgroundColor: "#f5f5f5", // Always light gray
                      transition: "background-color 0.2s ease-in-out",
                    }}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowModal(true);
                    }}
                  >
                    {/* Profile Image Stack */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {event.customers.slice(0, 5).map((customer, index) => (
                        <img
                          key={index}
                          src={`https://randomuser.me/api/portraits/thumb/men/${index}.jpg`}
                          alt={customer.name}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: "2px solid white",
                            marginLeft: index === 0 ? "0px" : "-10px",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                            transition: "transform 0.2s ease-in-out",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />
                      ))}
                    </div>

                    {/* Clickable Text with Underline */}
                    <span
                      style={{
                        fontSize: "14px",
                        marginLeft: "8px",
                        color: "#6c757d",
                        textDecoration: "underline",
                        textDecorationColor: "#f57c00",
                        fontWeight: "bold",
                        transition: "color 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#f57c00")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#6c757d")}
                    >
                      <span style={{ color: "#f57c00" }}>{event.customers.length}K</span> People are Joined
                    </span>
                  </div>
                </Card.Body>

              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="alert alert-warning text-center">No events found.</div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Customers for {selectedEvent?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEvent?.customers.length > 0 ? (
              <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>No of tickets</th>
                    <th>State</th>
                    <th>Country</th>
                    <th>Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEvent.customers.map((customer, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{customer?.customer.login_aadhaar_information?.name || "N/A"}</td>
                      <td>{customer?.customer.login_mobile_number || "N/A"}</td>
                      <td>{customer?.customer.login_email || "N/A"}</td>
                      <td>{customer?.numberOfTickets || 0}</td>
                      <td>{customer?.customer.login_aadhaar_information?.address_information?.state || "N/A"}</td>
                      <td>{customer?.customer.login_aadhaar_information?.address_information?.country || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No customers found.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="success" onClick={() => downloadCSV(selectedEvent)}>Download CSV</Button>
          </Modal.Footer>
        </Modal>
      )}
      <div>


        {/* Confirmation Dialog */}
        <Dialog
  open={open}
  onClose={handleCloseModal}
  sx={{
    "& .MuiDialog-paper": {
      borderRadius: "12px",
      padding: "24px",
      width: "400px",
      textAlign: "center",
    },
  }}
>
  <DialogTitle sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <WarningAmberIcon sx={{ fontSize: 50, color: "#d32f2f", marginBottom: 1 }} />
    <span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#d32f2f" }}>Delete Event</span>
  </DialogTitle>

  <DialogContent>
    <p style={{ fontSize: "1rem", color: "#444", marginBottom: "12px" }}>
      Are you sure you want to delete this event?
    </p>
    <p style={{ fontSize: "0.95rem", fontWeight: "500", color: "#b71c1c", background: "#fdecea", padding: "8px", borderRadius: "6px" }}>
      This action cannot be undone.
    </p>
  </DialogContent>

  <DialogActions sx={{ justifyContent: "space-between", marginTop: "12px" }}>
    <Button
      onClick={handleCloseModal}
      variant="outlined"
      sx={{ width: "45%", fontWeight: "500", borderRadius: "8px", borderColor: "#888", color: "#444" }}
    >
      Cancel
    </Button>

    <Button
      onClick={handleDeleteEvent}
      variant="contained"
      color="error"
      sx={{ width: "45%", fontWeight: "500", borderRadius: "8px" }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>
<Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>


      </div>
    </Container>
  );
};

export default AdvisorEvent;
