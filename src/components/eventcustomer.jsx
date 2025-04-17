import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, Button, Container, Row, Col, Modal, Table } from "react-bootstrap";
import { FaHeart, FaStar} from "react-icons/fa";
import moment from "moment";
import API_BASE_URL from "../constants/constants";
const EventListPage = () => {
  const location = useLocation();
  const { events = [] } = location.state || {}; // Get event list
  console.log("Events from location.state:", events);
   
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState({});

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
      customer.address.state,
      customer.address.country,
      moment(customer.address.created_date).format("DD-MM-YYYY HH:mm")
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

  return (
    <Container className="mt-3">
      <h5 className="text-primary fw-bold mb-3">Event List</h5>
      <Row>
        {events.map((event) => (
          <Col key={event.id} xs={12} md={6} lg={6} className="mb-3">
            <Card className="shadow-sm position-relative">
              {/* Favorite Heart Icon */}
              <FaStar
                className="position-absolute"
                onClick={() => setFavorites((prev) => ({ ...prev, [event.id]: !prev[event.id] }))}
                style={{
                  top: "8px",
                  right: "12px",
                  fontSize: "20px",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.7)",
                  borderRadius: "50%",
                  padding: "4px",
                  color: favorites[event.id] ? "red" : "gray",
                }}
              />

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
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* Month in Black */}
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#000" }}>
                  {moment(event.eventDate).format("MMM")}
                </span>
                {/* Date Number in Orange */}
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "orange" }}>
                  {moment(event.eventDate).format("DD")}
                </span>
              </div>

              {/* Event Tickets Display on the Right Side of Location */}



              {/* Event Image */}
              <Card.Img
                variant="top"
                src={`/assets/images/event${(events.indexOf(event) % 4) + 1}.jpg`}
                alt={event.title}
                style={{ height: "150px", objectFit: "cover" }}
              />

              <Card.Body className="p-2">
                <h6 className="fw-bold text-truncate">{event.title || "No Title"}</h6>
                <p className="text-muted mb-1" style={{ fontSize: "14px" }}>
                  📅 {moment(event.eventDate).format("DD MMM YYYY, hh:mm A") || "No Date"}
                </p>
                <p className="mb-1" style={{ fontSize: "12px" }}>
                  📍 {event.address || "N/A"}
                  <span className="text-muted mx-3">|</span>
                  <span className="fw-bold text-success">${event.tickets || "Free"}</span>
                </p>

                <p className="mb-2" style={{ fontSize: "12px" }}>
                  📝 {event.campaign_type || "N/A"}
                </p>

                <p className="mb-2" style={{ fontSize: "12px" }}>
                💱 {event.commissionRate || "N/A"}%
                </p>

                {/* People Joined Section - Clickable */}
                {/* <div
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
                  {/* <div style={{ display: "flex", alignItems: "center" }}>
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
                  {/* <span
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
                </div>  */}
              </Card.Body>




            </Card>
          </Col>
        ))}
      </Row>

      {/* Customer List Modal */}
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
    </Container>
  );
};

export default EventListPage;
