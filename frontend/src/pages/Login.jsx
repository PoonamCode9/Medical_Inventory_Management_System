import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import { GoogleLogin } from "@react-oauth/google";

import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaArrowLeft,
  FaUserShield,
  FaUserNurse,
  FaUserTie,
  FaEnvelope,
  FaMobileAlt,
  FaKey,
  FaHeartbeat,
  FaShieldAlt,
  FaCapsules,
  FaChartLine,
  FaHospital,
  FaUserMd,
  FaSignInAlt,
  FaGoogle,
} from "react-icons/fa";

import loginBg from "../assets/login-bg.jpg";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("LOGIN");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
    role: "STAFF",
    secretCode: "",
  });

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // ==========================================
  // Save Login
  // ==========================================

  const saveLoginData = (response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("userId", response.data.userId);

    redirectUser(response.data.role);
  };

  // ==========================================
  // Google Login
  // ==========================================

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/google",
        {
          token: credentialResponse.credential,
        }
      );

      alert("Google Login Successful");

      saveLoginData(response);
    } catch (error) {
      console.log(error);

      alert("Google Authentication Failed");
    }
  };

  // ==========================================
  // Login
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: data.email,
          password: data.password,
          role: data.role,
          secretCode: data.secretCode,
        }
      );

      alert("Login Successful");

      saveLoginData(response);
    } catch (error) {
      console.log(error);

      alert(error.response?.data || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Send OTP
  // ==========================================

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/send-otp", {
        phone,
      });

      alert("OTP Sent Successfully");
    } catch (error) {
      console.log(error);

      alert("OTP Failed");
    }
  };

  // ==========================================
  // Verify OTP
  // ==========================================

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/verify-otp",
        {
          phone,
          otp,
        }
      );

      alert("OTP Login Successful");

      saveLoginData(response);
    } catch (error) {
      console.log(error);

      alert("Invalid OTP");
    }
  };

  // ==========================================
  // Redirect
  // ==========================================

  const redirectUser = (role) => {
    switch (role) {
      case "ADMIN":
        navigate("/admin/dashboard");
        break;

      case "PHARMACIST":
        navigate("/pharmacist/dashboard");
        break;

      case "STAFF":
        navigate("/staff/dashboard");
        break;

      default:
        navigate("/");
    }
  };

  return (

        <div
            className="login-page"
            style={{
                backgroundImage: `
                    linear-gradient(
                        135deg,
                        rgba(2,25,55,.92),
                        rgba(0,120,170,.75)
                    ),
                    url(${loginBg})
                `
            }}
        >

            <div className="background-overlay"></div>

            <div className="floating-circle one"></div>
            <div className="floating-circle two"></div>
            <div className="floating-circle three"></div>

            <div className="login-wrapper">

                {/* ==========================================
                        LEFT PANEL
                =========================================== */}

                <div className="login-left">

                    <div className="brand-section">

                        <div className="hospital-logo">
                            <FaHospital />
                        </div>

                        <h1>MediStock</h1>

                        <p>
                            Smart Healthcare Inventory
                            Management Platform
                        </p>

                    </div>

                    <div className="welcome-content">

                        <h2>Welcome Back</h2>

                        <p>
                            Securely manage medicines,
                            stock levels, suppliers,
                            expiry tracking and healthcare
                            analytics from one place.
                        </p>

                    </div>

                    <div className="feature-grid">

                        <div className="feature-card">
                            <FaCapsules />
                            <div>
                                <h4>Medicine Tracking</h4>
                                <span>
                                    Real-time inventory monitoring
                                </span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <FaHeartbeat />
                            <div>
                                <h4>Expiry Management</h4>
                                <span>
                                    Smart expiry alerts
                                </span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <FaShieldAlt />
                            <div>
                                <h4>Secure Login</h4>
                                <span>
                                    Role based authentication
                                </span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <FaChartLine />
                            <div>
                                <h4>Analytics Reports</h4>
                                <span>
                                    Sales and stock insights
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

                {/* ==========================================
                        RIGHT PANEL
                =========================================== */}

                <div className="login-right">

                    <div className="login-card">

                        <div className="login-header">

                            <div className="avatar">
                                <FaUserMd />
                            </div>

                            <h2>Sign In</h2>

                            <p>
                                Access your MediStock dashboard
                            </p>

                        </div>

                        {

                            mode === "LOGIN"

                                ?

                                <form
                                    className="login-form"
                                    onSubmit={handleLogin}
                                >

                                    <div className="section-title">
                                        <span>
                                            Choose Account Type
                                        </span>
                                    </div>

                                    <div className="role-grid">

                                        <button
                                            type="button"
                                            className={
                                                data.role === "ADMIN"
                                                    ? "role-card active"
                                                    : "role-card"
                                            }
                                            onClick={() =>
                                                setData({
                                                    ...data,
                                                    role: "ADMIN"
                                                })
                                            }
                                        >
                                            <FaUserShield className="role-icon" />
                                            <h4>Admin</h4>
                                            <small>Control Panel</small>
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                data.role === "PHARMACIST"
                                                    ? "role-card active"
                                                    : "role-card"
                                            }
                                            onClick={() =>
                                                setData({
                                                    ...data,
                                                    role: "PHARMACIST"
                                                })
                                            }
                                        >
                                            <FaUserNurse className="role-icon" />
                                            <h4>Pharmacist</h4>
                                            <small>Medicine Stock</small>
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                data.role === "STAFF"
                                                    ? "role-card active"
                                                    : "role-card"
                                            }
                                            onClick={() =>
                                                setData({
                                                    ...data,
                                                    role: "STAFF"
                                                })
                                            }
                                        >
                                            <FaUserTie className="role-icon" />
                                            <h4>Staff</h4>
                                            <small>Operations</small>
                                        </button>

                                    </div>

                                    {/* Secret Code */}

                                    <div className="input-box">

                                        <label>

                                            {
                                                data.role === "ADMIN"

                                                    ? "Admin Secret Code"

                                                    : data.role === "PHARMACIST"

                                                        ? "Pharmacist Secret Code"

                                                        : "Staff Secret Code"
                                            }

                                        </label>

                                        <div className="input-field">

                                            <FaKey className="input-icon" />

                                            <input
                                                type="password"
                                                placeholder="Enter secret code"
                                                value={data.secretCode}
                                                onChange={(e) =>
                                                    setData({
                                                        ...data,
                                                        secretCode: e.target.value
                                                    })
                                                }
                                            />

                                        </div>

                                    </div>

                                    {/* Email */}

                                    <div className="input-box">

                                        <label>Email Address</label>

                                        <div className="input-field">

                                            <FaEnvelope className="input-icon" />

                                            <input
                                                type="email"
                                                placeholder="Enter email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData({
                                                        ...data,
                                                        email: e.target.value
                                                    })
                                                }
                                                required
                                            />

                                        </div>

                                    </div>

                                    {/* Password */}

                                    <div className="input-box">

                                        <label>Password</label>

                                        <div className="input-field">

                                            <FaLock className="input-icon" />

                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData({
                                                        ...data,
                                                        password: e.target.value
                                                    })
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="eye-btn"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {
                                                    showPassword
                                                        ? <FaEyeSlash />
                                                        : <FaEye />
                                                }
                                            </button>

                                        </div>

                                    </div>
                                                                        <div className="login-options">

                                        <label className="remember">

                                            <input type="checkbox" />

                                            <span>Remember Me</span>

                                        </label>

                                        <button
                                            type="button"
                                            className="forgot-btn"
                                        >
                                            Forgot Password?
                                        </button>

                                    </div>

                                    <button
                                        className="login-btn"
                                        disabled={loading}
                                    >

                                        {
                                            loading
                                                ?
                                                <>
                                                    <span className="loader"></span>
                                                    Logging In...
                                                </>
                                                :
                                                <>
                                                    <FaSignInAlt />
                                                    Login Securely
                                                </>
                                        }

                                    </button>

                                    <div className="divider">

                                        <span>OR</span>

                                    </div>

                                    <div className="google-login-box">

                                        <GoogleLogin
                                            onSuccess={handleGoogleLogin}
                                            onError={() =>
                                                alert("Google Login Failed")
                                            }
                                        />

                                    </div>

                                    <button
                                        type="button"
                                        className="otp-login-btn"
                                        onClick={() =>
                                            setMode("OTP")
                                        }
                                    >

                                        <FaMobileAlt />

                                        Login With OTP

                                    </button>

                                </form>

                                :

                                /* ==========================================
                                        OTP LOGIN
                                ========================================== */

                                <div className="otp-container">

                                    <div className="otp-header">

                                        <div className="otp-icon">

                                            <FaMobileAlt />

                                        </div>

                                        <h3>OTP Login</h3>

                                        <p>

                                            Verify your registered
                                            mobile number

                                        </p>

                                    </div>

                                    <div className="input-box">

                                        <label>

                                            Mobile Number

                                        </label>

                                        <div className="input-field">

                                            <FaMobileAlt
                                                className="input-icon"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Enter mobile number"
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>

                                    <button
                                        className="login-btn"
                                        onClick={sendOtp}
                                    >

                                        <FaMobileAlt />

                                        Send OTP

                                    </button>

                                    <div className="input-box">

                                        <label>

                                            Verification OTP

                                        </label>

                                        <div className="input-field">

                                            <FaKey
                                                className="input-icon"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Enter OTP"
                                                value={otp}
                                                onChange={(e) =>
                                                    setOtp(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>

                                    <button
                                        className="login-btn"
                                        onClick={verifyOtp}
                                    >

                                        <FaShieldAlt />

                                        Verify OTP

                                    </button>

                                    <button
                                        className="back-btn"
                                        onClick={() =>
                                            setMode("LOGIN")
                                        }
                                    >

                                        <FaArrowLeft />

                                        Back To Login

                                    </button>

                                </div>

                        }

                        <div className="login-footer">

                            <p>

                                Don't have an account?

                                <Link to="/register">

                                    Register Now

                                </Link>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;