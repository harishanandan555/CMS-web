import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { FiEye } from "react-icons/fi";
import {ProgressBar} from 'react-loader-spinner';

const UsersListLayer = () => {
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

      console.log("Token", token);
      const config = { headers: { 'bb-access-token': token } };
      const res = await axios.get(
        'http://localhost:1337/v1/superadmin/cms/admin/clientlist',
        config
      );
      console.log("result in client", res);
      if (res.data && res.data.result) {
        const mappedData = res.data.result.map((client) => ({
          email: client.login_email || 'N/A',
          phone: client.login_mobile_number || 'N/A',
          status: client.login_status || 'N/A',
          stage: client.login_stage || 'N/A',
          kycVerified: client.login_kyc_verified ? 'Yes' : 'No',
          esignVerified: client.login_esign_verified ? 'Yes' : 'No',
          bseClientCodeVerified: client.login_bse_clientcode_verified ? 'Yes' : 'No',
          photoVerified: client.login_bse_photo_verified ? 'Yes' : 'No',
          fullClientData: client,
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

  // Implement loader when loading is true
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
        <h4>Client List</h4>
        <Link
          to="/add-user"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" />
          Add New User
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
              <th>Phone</th>
              <th>Status</th>
              <th>Stage</th>
              <th>KYC Verified</th>
              <th>Esign Verified</th>
              <th>BSE Client Code Verified</th>
              <th>Photo Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((client, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{client.phone || 'N/A'}</td>
                <td>
                  <span
                    className={`badge ${
                      client.status === 'Active'
                        ? 'bg-success'
                        : client.status === 'Inactive'
                          ? 'bg-secondary'
                          : 'bg-warning'
                    }`}
                  >
                    {client.status || 'N/A'}
                  </span>
                </td>
                <td>{client.stage || 'N/A'}</td>
                <td>{client.kycVerified}</td>
                <td>{client.esignVerified}</td>
                <td>{client.bseClientCodeVerified}</td>
                <td>{client.photoVerified}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    {/* View Icon */}
                    <button
                      className="btn btn-light rounded-circle"
                      onClick={() => openModal(client)}
                      style={{
                        backgroundColor: 'rgba(173, 216, 230, 0.3)',
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
                        backgroundColor: 'rgba(144, 238, 144, 0.3)',
                        padding: '10px',
                        border: 'none',
                      }}
                    >
                      <Icon
                        icon="mdi:pencil-outline"
                        style={{ color: '#32CD32', fontSize: '18px' }}
                      />
                    </button>

                    {/* Delete Icon - Uncomment if needed */}
                    {/* <button
                      className="btn btn-light rounded-circle"
                      style={{
                        backgroundColor: 'rgba(255, 182, 193, 0.3)',
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

      {/* Pagination Section */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-light"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ padding: '5px 15px', border: '1px solid #ddd' }}
        >
          Previous
        </button>

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
            width: '700px',
            height: '300px',
            margin: 'auto',
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <div className="modal-header">
          <h5>Client Details</h5>
          <button onClick={closeModal} className="btn-close"></button>
        </div>
        <div className="modal-body">
          {selectedClient && (
            <>
              <p>
                <strong>Email:</strong> {selectedClient.email}
              </p>
              <p>
                <strong>Address:</strong> {selectedClient.fullClientData.login_personal_information.address_information.address}
              </p>
              <p>
                <strong>Income:</strong> {selectedClient.fullClientData.login_personal_information.annual_income_text || 'N/A'}
              </p>
              <p>
                <strong>bse_fatca_verified:</strong> {selectedClient.fullClientData.login_bse_fatca_verified || 'N/A'}
              </p>
              <p>
                <strong>BSE Client Code Verified:</strong> {selectedClient.bseClientCodeVerified}
              </p>
              <p>
                <strong>Photo Verified:</strong> {selectedClient.photoVerified}
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UsersListLayer;
