import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { FiEye } from "react-icons/fi";
import {ProgressBar} from 'react-loader-spinner';

const DistributorPageLayer = () => {
  const [clientList, setClientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // Set 50 items per page

  const loadClientList = async () => {
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
        'http://localhost:1337/v1/superadmin/distributor/list',
        config
      );
  
      console.log('resu', res.data);
  
      if (res.data && res.data.result) {
        const mappedData = res.data.result.map((client) => ({
          arn: client.ARN || 'N/A',
          arnHolderName: client["ARN Holder's Name"] || 'N/A',
          arnValidFrom: client["ARN Valid From"] || 'N/A',
          arnValidTill: client["ARN Valid Till"] || 'N/A',
          address: client.Address || 'N/A',
          city: client.City || 'N/A',
          euin: client.EUIN || 'N/A',
          email: client.Email || 'N/A',
          kydCompliant: client["KYD Compliant"] || 'N/A',
          pin: client.Pin || 'N/A',
          srNo: client["Sr No."] || 'N/A',
          telephone: client["Telephone (R)"] || 'N/A',
          fullClientData: client, // Storing full data if needed later
        }));
        
        setClientList(mappedData);
      } else {
        setMessageText('No client data found.');
        setIsRefresh(true);
      }
    } catch (err) {
      setMessageText('Failed to load client data.');
      setIsRefresh(true);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (client) => {
    setSelectedClient(client);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedClient(null);
  };

  useEffect(() => {
    loadClientList();
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
  const currentClients = clientList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(clientList.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Distributor List</h4>
        <Link
          to="/wizardstepper"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" />
          Add Distributor Details
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <select className="form-select">
          <option disabled>Select Number</option>
          {[...Array(10).keys()].map((num) => (
            <option key={num} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search"
        />
        <Icon icon="ion:search-outline" className="icon" />
        <select className="form-select">
          <option disabled>Select Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="table-responsive">
  <table className="table table-bordered">
    <thead className="thead-light">
      <tr>
        <th>S. No</th>
        <th>ARN</th>
        <th>ARN Holder Name</th>
        <th>ARN Valid From</th>
        <th>ARN Valid Till</th>
        {/* <th>Address</th> */}
        {/* <th>City</th> */}
        <th>EUIN</th>
        {/* <th>Email</th> */}
        {/* <th>KYD Compliant</th> */}
        {/* <th>Pin</th> */}
        <th>Telephone</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentClients.map((client, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{client.arn || 'N/A'}</td>
          <td>{client.arnHolderName || 'N/A'}</td>
          <td>{client.arnValidFrom || 'N/A'}</td>
          <td>{client.arnValidTill || 'N/A'}</td>
          {/* <td>{client.address || 'N/A'}</td> */}
          {/* <td>{client.city || 'N/A'}</td> */}
          <td>{client.euin || 'N/A'}</td>
          {/* <td>{client.email || 'N/A'}</td> */}
          {/* <td>{client.kydCompliant}</td> */}
          {/* <td>{client.pin || 'N/A'}</td> */}
          <td>{client.telephone || 'N/A'}</td>
          <td>
            <div className="d-flex justify-content-center align-items-center gap-2">
              {/* View Icon */}
              <button
                className="btn btn-light rounded-circle"
                onClick={() => openModal(client)}
                style={{
                  backgroundColor: 'rgba(173, 216, 230, 0.3)', // Light blue background
                  padding: '10px',
                  border: 'none',
                }}
              >
                <FiEye style={{ color: '#4682B4', fontSize: '18px' }} />
              </button>

              {/* Edit Icon */}
              <button
                className="btn btn-light rounded-circle"
                style={{
                  backgroundColor: 'rgba(144, 238, 144, 0.3)', // Light green background
                  padding: '10px',
                  border: 'none',
                }}
              >
                <Icon
                  icon="mdi:pencil-outline"
                  style={{ color: '#32CD32', fontSize: '18px' }}
                />
              </button>

              {/* Delete Icon */}
              {/* <button
                className="btn btn-light rounded-circle"
                style={{
                  backgroundColor: 'rgba(255, 182, 193, 0.3)', // Light pink background
                  padding: '10px',
                  border: 'none',
                }}
              >
                <Icon
                  icon="mdi:delete-outline"
                  style={{ color: '#FF4500', fontSize: '18px' }}
                />
              </button> */}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<div className="d-flex justify-content-between align-items-center mt-3">
        {/* Previous Button */}
        <button
          className="btn btn-light"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ padding: '5px 15px', border: '1px solid #ddd' }}
        >
          Previous
        </button>

        {/* Pagination Info */}
        <div className="d-flex align-items-center gap-3">
          <span
            style={{
              display: 'inline-block',
              padding: '5px 15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
              fontSize: '14px',
            }}
          >
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Next Button */}
        <button
          className="btn btn-light"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ padding: '5px 15px', border: '1px solid #ddd' }}
        >
          Next
        </button>
      </div>


{/* Modal Section */}
<Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Client Details Modal"
  style={{
    content: {
      width: '700px', // Set the width of the modal
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
  <div className="modal-header">
    <h5>Distributor Details</h5>
    <button onClick={closeModal} className="btn-close"></button>
  </div>
  <div className="modal-body">
    {selectedClient && (
      <>
        {/* <p>
          <strong>ARN:</strong> {selectedClient.arn}
        </p> */}
        <p>
          <strong>ARN Holder Name:</strong> {selectedClient.arnHolderName}
        </p>
        {/* <p>
          <strong>ARN Valid From:</strong> {selectedClient.arnValidFrom}
        </p>
        <p>
          <strong>ARN Valid Till:</strong> {selectedClient.arnValidTill}
        </p> */}
        <p>
          <strong>Address:</strong> {selectedClient.address}
        </p>
        <p>
          <strong>City:</strong> {selectedClient.city}
        </p>
        {/* <p>
          <strong>EUIN:</strong> {selectedClient.euin}
        </p> */}
        <p>
          <strong>Email:</strong> {selectedClient.email || 'N/A'}
        </p>
        <p>
          <strong>KYD Compliant:</strong> {selectedClient.kydCompliant}
        </p>
        <p>
          <strong>Pin:</strong> {selectedClient.pin}
        </p>
        {/* <p>
          <strong>Telephone:</strong> {selectedClient.telephone}
        </p> */}
      </>
    )}
  </div>
</Modal>

    </div>
  );
};

export default DistributorPageLayer;
