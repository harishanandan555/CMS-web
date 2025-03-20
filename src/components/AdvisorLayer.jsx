import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { FiEye } from "react-icons/fi";
import { AiOutlineQrcode } from 'react-icons/ai';
import { Modal as BootstrapModal, Button } from "react-bootstrap";
// Bootstrap modal

import { ProgressBar } from 'react-loader-spinner';
import ReactCardFlip from 'react-card-flip';
import { useNavigate } from "react-router-dom";
import { Campaign } from '@mui/icons-material';


const AdvisorLayer = () => {
  const [advisorList, setAdvisorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // Set 50 items per page
  const [customerData, setCustomerData] = useState(null);
  const [customerModalIsOpen, setCustomerModalIsOpen] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const loadAdvisorList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        setMessageText('Token not found. Please log in again.');
        setIsRefresh(true);
        setLoading(false);
        return;
      }

      const config = { headers: { 'bb-access-token': token } };
      const res = await axios.get(
        'http://localhost:1337/v1/superadmin/advisor/list',
        config
      );

      console.log('result in advisor', res.data);

      if (res.data && res.data.result) {
        const mappedData = res.data.result.map((advisor) => ({
          id: advisor.id || 'N/A',
          name: advisor.name || 'N/A',
          fk_login_id: advisor.fk_login_id || 'N/A',
          category: advisor.category || 'N/A',
          createdBy: advisor.created_by || 'N/A',
          createdDate: advisor.created_date || 'N/A',
          currency: advisor.currency || 'N/A',
          description: advisor.description || 'N/A',
          isActive: advisor.is_active || false,
          isAdviseAllowed: advisor.is_advise_allowed || false,
          isCancelled: advisor.is_cancelled || false,
          isRegistered: advisor.is_registered || false,
          label: advisor.label || 'N/A',
          loggedDateTime: advisor.logged_date_time || 'N/A',
          modifiedBy: advisor.modified_by || 'N/A',
          modifiedDate: advisor.modified_date || 'N/A',
          price: advisor.price || 0,
          ratings: advisor.ratings || 0,
          type: advisor.type || 'N/A',
          fullAdvisorData: advisor, // Storing full data if needed later
        }));
        

        setAdvisorList(mappedData);
      } else {
        setMessageText('No advisor data found.');
        setIsRefresh(true);
      }
    } catch (err) {
      setMessageText('Failed to load advisor data.');
      setIsRefresh(true);
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomerList = async (login_id) => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const config = {
        headers: {
          'bb-access-token': token,
          'Content-Type': 'application/json',
        }
      };

      const response = await axios.post(
        'http://localhost:1337/v1/superadmin/advisor-customer/list',
        { login_id }, // Send fk_login_id in body
        config
      );

      console.log("Customer List:", response.data);

      if (response.data && response.data.result.length > 0) {
        navigate("/customer-list", { state: { customers: response.data.result } });
        setCustomerData(response.data.result); // Store data in state
        // setCustomerModalIsOpen(true); // Open modal
      } else {
        navigate("/customer-list", { state: { customers: response.data.result } });

      }
    } catch (error) {
      console.error("Error fetching customer list:", error);
      alert("Failed to fetch customer list.");
    }
  };

  const fetchEventList = async (advisorId) => {
    try {
        const token = localStorage.getItem('user_token');
        if (!token) {
            alert("Token not found. Please log in again.");
            return;
        }

        const config = {
            headers: {
                'bb-access-token': token,
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.post(
            'http://localhost:1337/v1/superadmin/event/customer/list',
            { advisorId },
            config
        );

        console.log("Event List Response:", response.data);

        const eventResults = response.data?.result || [];

        if (!Array.isArray(eventResults) || eventResults.length === 0) {
            alert("No events found.");
            return;
        }

        const formattedEvents = eventResults.map(eventData => {
            const eventDetails = eventData.eventDetails || {};
            const step1 = eventDetails.step1?.[0] || {};
            const step2 = eventDetails.step2?.[0] || {};
            const step3 = eventDetails.step3?.[0] || {};

            return {
              id: eventDetails._id || "N/A",
              campaign_type: step1.campaign_type || "N/A",
              title: step1.title || "No Title",
              description: step1.description || "No Description",
              businessName: step1.business_name || "N/A",
              phoneNumber: step1.phone_number || "N/A",
              address: step1.address || "No Address",
              eventType: step2.eventType || "No Type",
              eventDate: step2.eventDate || "No Date",
              registrationStart: step2.registrationStart || "N/A",
              registrationEnd: step2.registrationEnd || "N/A",
              tickets: step2.tickets 
                  ? Array.isArray(step2.tickets) 
                      ? step2.tickets.map(ticket => ticket.amount)  // Case: tickets as an array
                      : Object.values(step2.tickets).map(ticket => ticket.amount)  // Case: tickets as an object
                  : [],
              locationType: step3.locationType || "No Location",
              url: step3.url || "N/A",
              customers: eventDetails.customers || [],
              nooftickets:eventDetails.customers.numberOfTickets

          };
          
          
        });

        console.log("Formatted Events:", formattedEvents);

        navigate('/event-list', { state: { events: formattedEvents } });

    } catch (error) {
        console.error("Error fetching event list:", error);
        alert("Failed to fetch event details.");
    }
};



  const fetchQRList = async (fk_login_id) => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const config = {
        headers: {
          'bb-access-token': token,
          'Content-Type': 'application/json',
        }
      };
      const response = await axios.post(
        'http://localhost:1337/v1/superadmin/event/qr/code',
        { fk_login_id },
        config
      );;
      console.log("QR Code Response:", response.data);

      if (response.data && response.data.result) {
        const data = response.data;
        setQrCode(data.result.qrCodeImage); // Store Base64 QR image
        setShowModal(true); // Show modal
      } else {
        alert("Failed to fetch QR code.");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  };
  const fetchQR = async (qrCode) => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const config = {
        headers: {
          'bb-access-token': token,
          'Content-Type': 'application/json',
        }
      };
      const response = await axios.post(
        'http://localhost:1337/v1/superadmin/scan/qr/code',
        { qrCode },
        config
      );;
      console.log("QR Code ", response.data);

      if (response.data && response.data.result) {
        const data = response.data;
       // Store Base64 QR image
        setShowModal(true); // Show modal
      } else {
        alert("Failed to fetch QR code.");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  };

  useEffect(() => {
    if (qrCode) {
      fetchQR(qrCode);
    }
  }, [qrCode]);


  const openModal = (advisor) => {
    setSelectedAdvisor(advisor);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAdvisor(null);
  };

  useEffect(() => {
    loadAdvisorList();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <ProgressBar
          visible={true}
          height="80"
          width="180"
          color="#4fa94d"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const totalStars = 5;
  
    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <span key={index}>⭐</span>
        ))}
        {halfStar && <span>⭐️</span>}
        {[...Array(totalStars - fullStars - (halfStar ? 1 : 0))].map((_, index) => (
          <span key={index + fullStars}>☆</span>
        ))}
      </>
    );
  };
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdvisors = advisorList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(advisorList.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-primary">Advisors</h4>
        <Link
          to="/add-advisor"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" />
          Add New Advisor
        </Link>
      </div>

      {/* Table Section */}
      <div className="table-responsive-overflow-x-auto scroll-sm">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Category</th>
              {/* <th>Created Date</th> */}
              {/* <th>Currency</th> */}
              <th>Description</th>
              <th>Price</th>
              <th>Ratings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAdvisors.map((advisor, index) => (
              <tr key={index}>
                {/* <td>{advisor.id}</td> */}
                <td>{advisor.name}</td>
                <td>{advisor.category}</td>
                {/* <td>{advisor.createdDate}</td> */}
                {/* <td>{advisor.currency}</td> */}
                <td>{advisor.description}</td>
                <td>{advisor.price}</td>
                <td>{advisor.ratings}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    {/* View Icon */}
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      {/* View Icon */}
                      <button
                        className="btn btn-light rounded-circle"
                        onClick={() => openModal(advisor)}
                        title="View Details"
                        style={{
                          backgroundColor: 'rgba(173, 216, 230, 0.3)', // Light blue background
                          padding: '10px',
                          border: 'none',
                        }}
                      >
                        <FiEye style={{ color: '#4682B4', fontSize: '18px' }} />
                      </button>

                      {/* Customer List Icon */}
                      <button
                        className="btn btn-light rounded-circle"
                        onClick={() => fetchCustomerList(advisor.fk_login_id)}
                        title="Customer List"
                        style={{
                          backgroundColor: 'rgba(255, 223, 186, 0.3)', // Light orange background
                          padding: '10px',
                          border: 'none',
                        }}
                      >
                        <Icon
                          icon="mdi:account-group-outline"
                          style={{ color: '#FF8C00', fontSize: '18px' }}
                        />
                      </button>

                      {/* Event List Icon */}
                      <button
                        className="btn btn-light rounded-circle"
                        onClick={() => fetchEventList(advisor.fk_login_id)}
                        title="View Events"
                        style={{
                          backgroundColor: 'rgba(186, 255, 201, 0.3)', // Light green background
                          padding: '10px',
                          border: 'none',
                        }}
                      >
                        <Icon
                          icon="mdi:calendar-multiple-check"
                          style={{ color: '#008000', fontSize: '18px' }}
                        />
                      </button>

                      {/* QR Code Icon */}
                      {/* <button
                        className="btn btn-light rounded-circle"
                        onClick={() => fetchQRList(advisor.fk_login_id)}
                        title="QR Code"
                        style={{
                          backgroundColor: 'rgba(240, 230, 140, 0.3)', // Light yellow background
                          padding: '10px',
                          border: 'none',
                        }}
                      >
                        <AiOutlineQrcode style={{ color: '#DAA520', fontSize: '18px' }} />
                      </button> */}
                    </div>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-secondary mx-1"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary mx-1"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
      <BootstrapModal show={showModal} onHide={() => setShowModal(false)} centered>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Scan QR Code</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body className="text-center">
          {qrCode ? <img src={qrCode} alt="QR Code" style={{ width: "100%", maxWidth: "300px" }} /> : "Loading..."}
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </BootstrapModal.Footer>
      </BootstrapModal>



      {/* Modal for Viewing Advisor Details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Advisor Details"
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
        style={{
          content: {
            width: '500px', // Set the width of the modal
            height: 'auto', // Adjust height dynamically
            margin: 'auto', // Center the modal horizontally
            backgroundColor: '#fff', // Set the background to white
            borderRadius: '8px', // Add rounded corners
            padding: '20px', // Add padding inside the modal
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Add a subtle shadow for depth
            position: 'fixed', // Make it fixed to the viewport
            top: '50%', // Vertically center
            left: '50%', // Horizontally center
            transform: 'translate(-50%, -50%)', // Adjust to center the modal properly
            zIndex: 1000, // Ensure modal appears on top of other content
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the background for focus
          }
        }}
      >
        {selectedAdvisor && (
  <div>
    <h4>{selectedAdvisor.name}</h4>
    <p><strong>Description:</strong> {selectedAdvisor.description}</p>
    <p><strong>Category:</strong> {selectedAdvisor.category}</p>
    <p><strong>Ratings:</strong> {renderStars(selectedAdvisor.ratings)}</p>
    <p><strong>Price:</strong> {selectedAdvisor.currency} {selectedAdvisor.price}</p>
    <button className="btn btn-primary mt-3" onClick={closeModal}>
      Close
    </button>
  </div>
)}

      </Modal>
    </div>
  );
};

export default AdvisorLayer;
