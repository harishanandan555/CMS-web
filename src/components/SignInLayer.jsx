import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../constants/constants";
const SignInLayer = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [institutionName, setInstitutionName] = useState("");

  const [role, setRole] = useState(""); // Default role
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);



  const isStrongPassword = (pwd) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return passwordRegex.test(pwd);
  };


  const handleSignIn = async (e) => {
    e.preventDefault();
    try {

      if (!isStrongPassword(password)) {
        alert("Password must be at least 8 characters long, include at least one uppercase letter, one digit, and one special character.");
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/v1/superadmin/cms/login`, {
        login_email: email,
        password,
        login_role: role,
      });

      console.log("Login response:", response.data);

      if (response.data) {
        const { token, role, fk_login_id, distributorARN } = response.data;

        if (role === "superadmin" && fk_login_id && token) {
          localStorage.setItem('superadmin_user login Id', fk_login_id)
          localStorage.setItem("user_token", token);
          localStorage.setItem('user_role', role);
        }

        if (role === "amc" && fk_login_id && token) {
          localStorage.setItem('amc_ user login Id', fk_login_id)
          localStorage.setItem("amc_user_token", token);
          localStorage.setItem('user_role', role);
        }

        if(role=== "distributor"){
          localStorage.setItem('distributor_ user login Id', fk_login_id)
          localStorage.setItem("distributor_user_token", token);
          localStorage.setItem("ARN Number", distributorARN
          )
          localStorage.setItem('user_role', role);
        }
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Store fk_login_id if the role is advisor
        if (role === "advisor" && fk_login_id && token) {
          localStorage.setItem("advisor_fk_login_id", fk_login_id);
          localStorage.setItem("advisor_token", token);
          localStorage.setItem('user_role', role);
        }

        // Log all localStorage items
        console.log("🗂️ Current localStorage items:");
        Object.keys(localStorage).forEach((key) => {
          console.log(`${key}:`, localStorage.getItem(key));
        });

        // Navigate based on role
        // Navigate based on role
        if (role === "advisor" ) {
          navigate("/index-2");
        }else if (role === "distributor" ) {
            navigate("/index-4");
        } else if (role === "amc") {
          navigate("/index-3");
        } else {
          navigate("/index-1");
        }

      } else {
        console.error("Login failed: Invalid credentials or response code not 200");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };



  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/v1/superadmin/cms/create/password`, {
        email: email,
        password: password,
        login_role: role,
      });

      console.log("Sign-up response:", response.data);

      if (response.data.code === "200") {
        alert("Account created successfully! You can now log in.");
        setIsSignUp(false); // Switch back to Sign In mode
      } else {
        alert("Failed to create an account. Please try again.");
      }
    } catch (error) {
      console.error("Error creating account:", error.response?.data || error.message);
      alert("An error occurred while creating the account.");
    }
  };

  return (
    <section className="auth bg-base d-flex flex-wrap">
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="assets/images/auth/auth-img.png" alt="Auth" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <Link to="/index-2" className="mb-40 max-w-290-px">
              <img src="assets/images/logo.png" alt="Logo" />
            </Link>
            <h4 className="mb-12">{isSignUp ? "Create Your Account" : "Sign In to Your Account"}</h4>
            <p className="mb-32 text-secondary-light text-lg">
              {isSignUp ? "Register your details below" : "Welcome back! Please enter your details"}
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <Icon icon="mage:email" />
              </span>
              <input
                type="email"
                className="form-control h-56-px bg-neutral-50 radius-12"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="position-relative mb-20">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="solar:lock-password-outline" />
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <span
                className="toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                <Icon icon={passwordVisible ? "ri:eye-off-line" : "ri:eye-line"} />
              </span>
            </div>

            {isSignUp && (
              <div className="position-relative mb-20">
                <div className="icon-field">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="position-relative mb-20">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mdi:account-box-outline" />
                </span>
                <select
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {isSignUp ? (
                    <>
                      <option value="advisor">Advisor</option>
                      <option value="distributor">Distributor</option>
                      <option value="AMC">AMC</option>
                    </>
                  ) : (
                    <>
                      <option value="superadmin">Superadmin</option>
                      <option value="admin">Admin</option>
                      <option value="advisor">Advisor</option>
                      <option value="distributor">Distributor</option>
                      <option value="AMC">AMC</option>
                    </>
                  )}
                </select>
              </div>
            </div>





            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-16">
            <p>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;
