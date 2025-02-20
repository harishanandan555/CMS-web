import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { FiEye } from "react-icons/fi";
import { ProgressBar } from 'react-loader-spinner';
import ReactCardFlip from 'react-card-flip';
import { useNavigate } from "react-router-dom";


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
const fetchEventList = async (fk_login_id) => {
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
          'http://localhost:1337/v1/superadmin/advisor-event/list',
          { fk_login_id }, 
          config
      );

      console.log("Event List Response:", response.data);

      // Ensure result exists and is an array
      const result = response.data?.result; // Safe optional chaining

      if (!result || !Array.isArray(result)) {
          console.error("Invalid or missing 'result' in response:", response.data);
          alert("No valid event data found.");
          return;
      }

      // Extract all steps dynamically (step1, step2, stepX)
      const events = result.flatMap(event => 
          Object.keys(event)
              .filter(key => key.startsWith('step')) // Find all stepX keys
              .flatMap(key => event[key] || []) // Extract their values
      );

      console.log("Extracted Events:", events);

      if (events.length > 0) {
          setEventData(events); // Store all events
          setIsFlipped(true); // Open modal
      } else {
          alert("No event data found.");
      }
  } catch (error) {
      console.error("Error fetching event list:", error);
      alert("Failed to fetch event list.");
  }
};





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
      <div className="table-responsive">
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
                  title="Customer list"
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
            <p><strong>Ratings:</strong> {selectedAdvisor.ratings}</p>
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
