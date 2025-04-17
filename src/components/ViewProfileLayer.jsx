import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import API_BASE_URL from '../constants/constants';

const ViewProfileLayer = () => {
    const [imagePreview, setImagePreview] = useState('assets/images/user-grid/user-grid-img13.png');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [advisorList, setAdvisorList] = useState([]); // ✅ Corrected state variable name
      const [loading, setLoading] = useState(false); // ✅ Added missing state
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
            `${API_BASE_URL}/v1/cms/details`,
            { fk_login_id: fk_login_id },
            { headers } // Pass headers
          );
    
          console.log("Response:", response.data);
    
          if (response.data.result.advisorDetails) {
            setAdvisorList(response.data.result.advisorDetails);
          } else {
            setAdvisorList([]);
            setError("No customers found");
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data");
        }
    
        setLoading(false);
      };
    
      const handleSaveChanges = async (e) => {
        e.preventDefault();
    
        const updatedData = {
            fk_login_id: advisorList.fk_login_id,
            name: advisorList.name,
            email: advisorList.email,
            category: advisorList.category,
            company_name: advisorList.company_name,
            description: advisorList.description,
            price: advisorList.price,
            ratings: advisorList.ratings,
        };
    
        try {
            const response = await fetch(`${API_BASE_URL}/v1/advisor/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "bb-access-token": localStorage.getItem("bb-access-token"), // Include the token
                },
                body: JSON.stringify(updatedData),
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Details updated successfully!");
            } else {
                alert("Error updating details: " + result.messageText);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to update details.");
        }
    };
    
    // Toggle function for password field
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Toggle function for confirm password field
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const readURL = (input) => {
        if (input.target.files && input.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(input.target.files[0]);
        }
    };
    return (
        <div className="row gy-4">
            <div className="col-lg-4">
                <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                    <img
                        src="assets/images/user-grid/user-grid-bg1.png"
                        alt=""
                        className="w-100 object-fit-cover"
                    />
                    <div className="pb-24 ms-16 mb-24 me-16  mt--100">
                        <div className="text-center border border-top-0 border-start-0 border-end-0">
                            <img
                                src="assets/images/user-grid/user-grid-img14.png"
                                alt=""
                                className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover"
                            />
                            <h6 className="mb-0 mt-16">{advisorList.name}</h6>
                            <span className="text-secondary-light mb-16">{advisorList.email}</span>
                        </div>
                        <div className="mt-24">
                            <h6 className="text-xl mb-16">Personal Info</h6>
                            <ul>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Full Name
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        :{advisorList.name}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Email
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        :{advisorList.email}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Phone Number
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        :{advisorList.auth_mobile_number}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Company
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        :{advisorList.company_name}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Price
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        :{advisorList.price}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Ratings
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        :{advisorList.ratings}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Languages
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : English
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Bio
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : Lorem Ipsum&nbsp;is simply dummy text of the printing and
                                        typesetting industry.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="card h-100">
                    <div className="card-body p-24">
                        <ul
                            className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24 active"
                                    id="pills-edit-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-edit-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-edit-profile"
                                    aria-selected="true"
                                >
                                    Edit Profile
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24"
                                    id="pills-change-passwork-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-change-passwork"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-change-passwork"
                                    aria-selected="false"
                                    tabIndex={-1}
                                >
                                    Change Password
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24"
                                    id="pills-notification-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-notification"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-notification"
                                    aria-selected="false"
                                    tabIndex={-1}
                                >
                                    Notification Settings
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-edit-profile"
                                role="tabpanel"
                                aria-labelledby="pills-edit-profile-tab"
                                tabIndex={0}
                            >
                                <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                                {/* Upload Image Start */}
                                <div className="mb-24 mt-16">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                            <input
                                                type="file"
                                                id="imageUpload"
                                                accept=".png, .jpg, .jpeg"
                                                hidden
                                                onChange={readURL}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                                            >
                                                <Icon icon="solar:camera-outline" className="icon"></Icon>
                                            </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div
                                                id="imagePreview"
                                                style={{
                                                    backgroundImage: `url(${imagePreview})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Upload Image End */}
                                <form action="#">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Full Name
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="name"
                                                    placeholder="Enter Full Name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="email"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Email <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control radius-8"
                                                    id="email"
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="number"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Phone
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control radius-8"
                                                    id="number"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Company
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="name"
                                                    placeholder="Enter Company Name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="number"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Price
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control radius-8"
                                                    id="number"
                                                    placeholder="Enter Price "
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="Language"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Language
                                                    <span className="text-danger-600">*</span>{" "}
                                                </label>
                                                <select
                                                    className="form-control radius-8 form-select"
                                                    id="Language"
                                                    defaultValue="Select Language"
                                                >
                                                    <option value="Select Language" disabled>
                                                        Select Language
                                                    </option>
                                                    <option value="English">English</option>
                                                    <option value="Bangla">Bangla</option>
                                                    <option value="Hindi">Hindi</option>
                                                    <option value="Arabic">Arabic</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="desc"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Description
                                                </label>
                                                <textarea
                                                    name="#0"
                                                    className="form-control radius-8"
                                                    id="desc"
                                                    placeholder="Write description..."
                                                    defaultValue={""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <button
                                            type="button"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="tab-pane fade" id="pills-change-passwork" role="tabpanel" aria-labelledby="pills-change-passwork-tab" tabIndex="0">
                                <div className="mb-20">
                                    <label htmlFor="your-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        New Password <span className="text-danger-600">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            className="form-control radius-8"
                                            id="your-password"
                                            placeholder="Enter New Password*"
                                        />
                                        <span
                                            className={`toggle-password ${passwordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                            onClick={togglePasswordVisibility}
                                        ></span>
                                    </div>
                                </div>

                                <div className="mb-20">
                                    <label htmlFor="confirm-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        Confirm Password <span className="text-danger-600">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={confirmPasswordVisible ? "text" : "password"}
                                            className="form-control radius-8"
                                            id="confirm-password"
                                            placeholder="Confirm Password*"
                                        />
                                        <span
                                            className={`toggle-password ${confirmPasswordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                            onClick={toggleConfirmPasswordVisibility}
                                        ></span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="pills-notification"
                                role="tabpanel"
                                aria-labelledby="pills-notification-tab"
                                tabIndex={0}
                            >
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="companzNew"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Company News
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="companzNew"
                                        />
                                    </div>
                                </div>
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="pushNotifcation"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Push Notification
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="pushNotifcation"
                                            defaultChecked=""
                                        />
                                    </div>
                                </div>
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="weeklyLetters"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Weekly News Letters
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="weeklyLetters"
                                            defaultChecked=""
                                        />
                                    </div>
                                </div>
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="meetUp"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Meetups Near you
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="meetUp"
                                        />
                                    </div>
                                </div>
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="orderNotification"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Orders Notifications
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="orderNotification"
                                            defaultChecked=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ViewProfileLayer;