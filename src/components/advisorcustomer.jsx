import { useLocation, useNavigate } from "react-router-dom";

const CustomerList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const customers = location.state?.customers || [];

    // Helper function to format date (YYYY-MM-DD)
    const formatDate = (dateTime) => {
        if (!dateTime) return "N/A";
        return new Date(dateTime).toISOString().split("T")[0]; // Extract date part
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-primary">Customer List</h4>
               
            </div>

            {customers.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>
                                    S.No
                                </th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Customer ID</th>
                               
                                <th>Logged Date</th>
                                <th>Subscription</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.mobile_number}</td>
                                    <td>{customer.customer_id}</td>
                                    
                                    <td>{formatDate(customer.logged_date_time)}</td>
                                    <td>
                                        <span className={`badge ${customer.subscription ? "bg-success" : "bg-danger"}`}>
                                            {customer.subscription ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="alert alert-warning text-center">
                    No customers found.
                </div>
            )}
        </div>
    );
};

export default CustomerList;
