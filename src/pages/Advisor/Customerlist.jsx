import React, { useState, useEffect } from "react";
import axios from "axios";

const AdvisorCustomer = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("advisor_token");
      const fk_login_id = localStorage.getItem("advisor_fk_login_id"); // Get advisor token
      const headers = token ? { "bb-access-token": token } : {}; // Set headers

      const response = await axios.post(
        "http://localhost:1337/v1/cms-advisor/details",
        { fk_login_id: fk_login_id },
        { headers } // Pass headers
      );

      console.log("Response:", response.data);

      if (response.data.result.customerList) {
        setCustomerList(response.data.result.customerList);
      } else {
        setCustomerList([]);
        setError("No customers found");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    }

    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mt-8">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-primary">Customer List</h4>
      </div>

      {loading ? (
        <div className="alert alert-info text-center">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : customerList.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>S.No</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Customer ID</th>
                <th>Logged Date</th>
                <th>Subscription</th>
              </tr>
            </thead>
            <tbody>
              {customerList.map((customer, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{customer.email}</td>
                  <td>{customer.mobile_number}</td>
                  <td>{customer.customer_id}</td>
                  <td>{formatDate(customer.logged_date_time)}</td>
                  <td>
                    <span
                      className={`badge ${
                        customer.subscription ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {customer.subscription ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-warning text-center">No customers found.</div>
      )}
    </div>
  );
};

export default AdvisorCustomer;
