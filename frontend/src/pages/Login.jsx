import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import { GoogleLogin } from "@react-oauth/google";

import toast from "react-hot-toast";

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
    FaSignInAlt
} from "react-icons/fa";

import loginBg from "../assets/login-bg.jpg";
import "../styles/Login.css";


function Login() {

    const navigate = useNavigate();


    // =====================================================
    // MODE
    // =====================================================

    const [mode, setMode] = useState("LOGIN");


    // =====================================================
    // LOGIN STATES
    // =====================================================

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);


    const [data, setData] = useState({
        email: "",
        password: "",
        role: "STAFF",
        secretCode: ""
    });


    // =====================================================
    // OTP LOGIN STATES
    // =====================================================

    const [phone, setPhone] = useState("");

    const [otp, setOtp] = useState("");


    // =====================================================
    // FORGOT PASSWORD STATES
    // =====================================================

    const [resetEmail, setResetEmail] = useState("");

    const [resetOtp, setResetOtp] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [resetLoading, setResetLoading] = useState(false);

    const [resetOtpVerified, setResetOtpVerified] = useState(false);


    // =====================================================
    // TOAST HELPERS
    // =====================================================

    const showSuccess = (message) => {

        toast.success(message, {
            duration: 3500,
            icon: "✓"
        });

    };


    const showError = (message) => {

        toast.error(message, {
            duration: 4000,
            icon: "!"
        });

    };


    const showInfo = (message) => {

        toast(message, {
            duration: 3000,
            icon: "ⓘ"
        });

    };


    // =====================================================
    // SAVE LOGIN DATA
    // =====================================================

    const saveLoginData = (response) => {

        localStorage.setItem(
            "token",
            response.data.token
        );

        localStorage.setItem(
            "role",
            response.data.role
        );

        localStorage.setItem(
            "userId",
            response.data.userId
        );


        redirectUser(
            response.data.role
        );

    };


    // =====================================================
    // GOOGLE LOGIN
    // =====================================================

    const handleGoogleLogin = async (
        credentialResponse
    ) => {

        try {

            setLoading(true);


            const response = await axios.post(
                "http://localhost:8080/api/auth/google",
                {
                    token:
                        credentialResponse.credential
                }
            );


            showSuccess(
                "Google login successful"
            );


            saveLoginData(response);


        } catch (error) {

            console.error(
                "Google Login Error:",
                error
            );


            const message =
                error.response?.data ||
                "Google authentication failed";


            showError(message);


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // NORMAL LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();


        if (!data.email.trim()) {

            showError(
                "Please enter your email address."
            );

            return;

        }


        if (!data.password.trim()) {

            showError(
                "Please enter your password."
            );

            return;

        }


        if (!data.secretCode.trim()) {

            showError(
                `Please enter your ${data.role.toLowerCase()} secret code.`
            );

            return;

        }


        try {

            setLoading(true);


            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email: data.email,
                    password: data.password,
                    role: data.role,
                    secretCode: data.secretCode
                }
            );


            showSuccess(
                "Login successful. Welcome to MediStock!"
            );


            saveLoginData(response);


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            const message =
                error.response?.data ||
                "Login failed. Please check your credentials.";


            showError(message);


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SEND OTP - NORMAL OTP LOGIN
    // =====================================================

    const sendOtp = async () => {

        if (!phone.trim()) {

            showError(
                "Please enter your mobile number."
            );

            return;

        }


        try {

            setLoading(true);


            await axios.post(
                "http://localhost:8080/api/auth/send-otp",
                {
                    phone: phone
                }
            );


            showSuccess(
                "OTP sent successfully."
            );


        } catch (error) {

            console.error(
                "Send OTP Error:",
                error
            );


            const message =
                error.response?.data ||
                "Unable to send OTP.";


            showError(message);


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // VERIFY OTP - NORMAL OTP LOGIN
    // =====================================================

    const verifyOtp = async () => {

        if (!phone.trim()) {

            showError(
                "Please enter your mobile number."
            );

            return;

        }


        if (!otp.trim()) {

            showError(
                "Please enter the OTP."
            );

            return;

        }


        try {

            setLoading(true);


            const response = await axios.post(
                "http://localhost:8080/api/auth/verify-otp",
                {
                    phone: phone,
                    otp: otp
                }
            );


            showSuccess(
                "OTP verified. Login successful!"
            );


            saveLoginData(response);


        } catch (error) {

            console.error(
                "OTP Verification Error:",
                error
            );


            const message =
                error.response?.data ||
                "Invalid or expired OTP.";


            showError(message);


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FORGOT PASSWORD
    // SEND RESET OTP
    // =====================================================

    const sendForgotPasswordOtp = async () => {

        if (!resetEmail.trim()) {

            showError(
                "Please enter your registered email address."
            );

            return;

        }


        try {

            setResetLoading(true);


            await axios.post(
                "http://localhost:8080/api/auth/forgot-password/send-otp",
                {
                    email: resetEmail
                }
            );


            showSuccess(
                "Password reset OTP sent successfully."
            );


        } catch (error) {

            console.error(
                "Forgot Password OTP Error:",
                error
            );


            const message =
                error.response?.data ||
                "Unable to send password reset OTP.";


            showError(message);


        } finally {

            setResetLoading(false);

        }

    };


    // =====================================================
    // VERIFY RESET OTP
    // =====================================================

    const verifyForgotPasswordOtp = async () => {

        if (!resetEmail.trim()) {

            showError(
                "Please enter your registered email."
            );

            return;

        }


        if (!resetOtp.trim()) {

            showError(
                "Please enter the OTP."
            );

            return;

        }


        try {

            setResetLoading(true);


            await axios.post(
                "http://localhost:8080/api/auth/forgot-password/verify-otp",
                {
                    email: resetEmail,
                    otp: resetOtp
                }
            );


            setResetOtpVerified(true);


            showSuccess(
                "OTP verified successfully."
            );


        } catch (error) {

            console.error(
                "Reset OTP Verification Error:",
                error
            );


            const message =
                error.response?.data ||
                "Invalid or expired OTP.";


            showError(message);


        } finally {

            setResetLoading(false);

        }

    };


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    const resetPassword = async () => {

        if (!newPassword) {

            showError(
                "Please enter the new password."
            );

            return;

        }


        if (!confirmPassword) {

            showError(
                "Please confirm the new password."
            );

            return;

        }


        if (
            newPassword !== confirmPassword
        ) {

            showError(
                "Passwords do not match."
            );

            return;

        }


        if (
            newPassword.length < 6
        ) {

            showError(
                "Password must contain at least 6 characters."
            );

            return;

        }


        try {

            setResetLoading(true);


            await axios.post(
                "http://localhost:8080/api/auth/forgot-password/reset",
                {
                    email: resetEmail,
                    otp: resetOtp,
                    newPassword: newPassword
                }
            );


            showSuccess(
                "Password reset successful. Please login with your new password."
            );


            // Clear reset data

            setResetEmail("");

            setResetOtp("");

            setNewPassword("");

            setConfirmPassword("");

            setResetOtpVerified(false);


            // Return to login

            setMode("LOGIN");


        } catch (error) {

            console.error(
                "Password Reset Error:",
                error
            );


            const message =
                error.response?.data ||
                "Password reset failed.";


            showError(message);


        } finally {

            setResetLoading(false);

        }

    };


    // =====================================================
    // OPEN FORGOT PASSWORD
    // =====================================================

    const openForgotPassword = () => {

        setResetEmail(
            data.email
        );

        setResetOtp("");

        setNewPassword("");

        setConfirmPassword("");

        setResetOtpVerified(false);

        setMode("FORGOT");

    };


    // =====================================================
    // BACK TO LOGIN
    // =====================================================

    const backToLogin = () => {

        setResetEmail("");

        setResetOtp("");

        setNewPassword("");

        setConfirmPassword("");

        setResetOtpVerified(false);

        setMode("LOGIN");

    };


    // =====================================================
    // REDIRECT USER
    // =====================================================

    const redirectUser = (role) => {

        switch (role) {

            case "ADMIN":

                navigate(
                    "/admin/dashboard"
                );

                break;


            case "PHARMACIST":

                navigate(
                    "/pharmacist/dashboard"
                );

                break;


            case "STAFF":

                navigate(
                    "/staff/dashboard"
                );

                break;


            default:

                navigate("/");

        }

    };


    // =====================================================
    // PAGE
    // =====================================================

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


                {/* =====================================================
                    LEFT PANEL
                ===================================================== */}

                <div className="login-left">

                    <div className="brand-section">

                        <div className="hospital-logo">

                            <FaHospital />

                        </div>


                        <h1>
                            MediStock
                        </h1>


                        <p>
                            Smart Healthcare Inventory
                            Management Platform
                        </p>

                    </div>


                    <div className="welcome-content">

                        <h2>
                            Welcome Back
                        </h2>


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

                                <h4>
                                    Medicine Tracking
                                </h4>

                                <span>
                                    Real-time inventory monitoring
                                </span>

                            </div>

                        </div>


                        <div className="feature-card">

                            <FaHeartbeat />

                            <div>

                                <h4>
                                    Expiry Management
                                </h4>

                                <span>
                                    Smart expiry alerts
                                </span>

                            </div>

                        </div>


                        <div className="feature-card">

                            <FaShieldAlt />

                            <div>

                                <h4>
                                    Secure Login
                                </h4>

                                <span>
                                    Role based authentication
                                </span>

                            </div>

                        </div>


                        <div className="feature-card">

                            <FaChartLine />

                            <div>

                                <h4>
                                    Analytics Reports
                                </h4>

                                <span>
                                    Sales and stock insights
                                </span>

                            </div>

                        </div>


                    </div>

                </div>


                {/* =====================================================
                    RIGHT PANEL
                ===================================================== */}

                <div className="login-right">

                    <div className="login-card">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="login-header">

                            <div className="avatar">

                                {mode === "LOGIN" && (
                                    <FaUserMd />
                                )}

                                {mode === "OTP" && (
                                    <FaMobileAlt />
                                )}

                                {mode === "FORGOT" && (
                                    <FaKey />
                                )}

                            </div>


                            <h2>

                                {mode === "LOGIN" &&
                                    "Sign In"
                                }

                                {mode === "OTP" &&
                                    "OTP Login"
                                }

                                {mode === "FORGOT" &&
                                    "Forgot Password"
                                }

                            </h2>


                            <p>

                                {mode === "LOGIN" &&
                                    "Access your MediStock dashboard"
                                }

                                {mode === "OTP" &&
                                    "Login securely using your mobile number"
                                }

                                {mode === "FORGOT" &&
                                    "Recover your MediStock account"
                                }

                            </p>

                        </div>


                        {/* =================================================
                            LOGIN MODE
                        ================================================= */}

                        {mode === "LOGIN" && (

                            <form
                                className="login-form"
                                onSubmit={handleLogin}
                            >


                                <div className="section-title">

                                    <span>
                                        Choose Account Type
                                    </span>

                                </div>


                                {/* ROLE GRID */}

                                <div className="role-grid">


                                    {/* ADMIN */}

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

                                        <FaUserShield
                                            className="role-icon"
                                        />

                                        <h4>
                                            Admin
                                        </h4>

                                        <small>
                                            Control Panel
                                        </small>

                                    </button>


                                    {/* PHARMACIST */}

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

                                        <FaUserNurse
                                            className="role-icon"
                                        />

                                        <h4>
                                            Pharmacist
                                        </h4>

                                        <small>
                                            Medicine Stock
                                        </small>

                                    </button>


                                    {/* STAFF */}

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

                                        <FaUserTie
                                            className="role-icon"
                                        />

                                        <h4>
                                            Staff
                                        </h4>

                                        <small>
                                            Operations
                                        </small>

                                    </button>


                                </div>


                                {/* SECRET CODE */}

                                <div className="input-box">

                                    <label>

                                        {data.role === "ADMIN"
                                            ? "Admin Secret Code"
                                            : data.role === "PHARMACIST"
                                                ? "Pharmacist Secret Code"
                                                : "Staff Secret Code"
                                        }

                                    </label>


                                    <div className="input-field">

                                        <FaKey
                                            className="input-icon"
                                        />


                                        <input
                                            type="password"
                                            placeholder="Enter secret code"
                                            value={data.secretCode}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    secretCode:
                                                        e.target.value
                                                })
                                            }
                                        />

                                    </div>

                                </div>


                                {/* EMAIL */}

                                <div className="input-box">

                                    <label>
                                        Email Address
                                    </label>


                                    <div className="input-field">

                                        <FaEnvelope
                                            className="input-icon"
                                        />


                                        <input
                                            type="email"
                                            placeholder="Enter email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    email:
                                                        e.target.value
                                                })
                                            }
                                            required
                                        />

                                    </div>

                                </div>


                                {/* PASSWORD */}

                                <div className="input-box">

                                    <label>
                                        Password
                                    </label>


                                    <div className="input-field">

                                        <FaLock
                                            className="input-icon"
                                        />


                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter password"
                                            value={
                                                data.password
                                            }
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    password:
                                                        e.target.value
                                                })
                                            }
                                            required
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

                                            {showPassword
                                                ? <FaEyeSlash />
                                                : <FaEye />
                                            }

                                        </button>

                                    </div>

                                </div>


                                {/* LOGIN OPTIONS */}

                                <div className="login-options">

                                    <label className="remember">

                                        <input
                                            type="checkbox"
                                        />

                                        <span>
                                            Remember Me
                                        </span>

                                    </label>


                                    <button
                                        type="button"
                                        className="forgot-btn"
                                        onClick={
                                            openForgotPassword
                                        }
                                    >

                                        Forgot Password?

                                    </button>

                                </div>


                                {/* LOGIN BUTTON */}

                                <button
                                    type="submit"
                                    className="login-btn"
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>

                                            <span className="loader"></span>

                                            Logging In...

                                        </>

                                    ) : (

                                        <>

                                            <FaSignInAlt />

                                            Login Securely

                                        </>

                                    )}

                                </button>


                                {/* DIVIDER */}

                                <div className="divider">

                                    <span>
                                        OR
                                    </span>

                                </div>


                                {/* GOOGLE LOGIN */}

                                <div className="google-login-box">

                                    <GoogleLogin
                                        onSuccess={
                                            handleGoogleLogin
                                        }
                                        onError={() =>
                                            showError(
                                                "Google login failed. Please try again."
                                            )
                                        }
                                    />

                                </div>


                                {/* OTP LOGIN */}

                                <button
                                    type="button"
                                    className="otp-login-btn"
                                    onClick={() => {

                                        setPhone("");

                                        setOtp("");

                                        setMode("OTP");

                                    }}
                                >

                                    <FaMobileAlt />

                                    Login With OTP

                                </button>


                            </form>

                        )}


                        {/* =================================================
                            OTP LOGIN MODE
                        ================================================= */}

                        {mode === "OTP" && (

                            <div className="otp-container">


                                <div className="otp-header">

                                    <div className="otp-icon">

                                        <FaMobileAlt />

                                    </div>


                                    <h3>
                                        OTP Login
                                    </h3>


                                    <p>
                                        Verify your registered
                                        mobile number
                                    </p>

                                </div>


                                {/* PHONE */}

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


                                {/* SEND OTP */}

                                <button
                                    type="button"
                                    className="login-btn"
                                    onClick={sendOtp}
                                    disabled={loading}
                                >

                                    <FaMobileAlt />

                                    {loading
                                        ? "Sending OTP..."
                                        : "Send OTP"
                                    }

                                </button>


                                {/* OTP */}

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


                                {/* VERIFY */}

                                <button
                                    type="button"
                                    className="login-btn"
                                    onClick={verifyOtp}
                                    disabled={loading}
                                >

                                    <FaShieldAlt />

                                    {loading
                                        ? "Verifying..."
                                        : "Verify OTP"
                                    }

                                </button>


                                {/* BACK */}

                                <button
                                    type="button"
                                    className="back-btn"
                                    onClick={
                                        backToLogin
                                    }
                                >

                                    <FaArrowLeft />

                                    Back To Login

                                </button>

                            </div>

                        )}


                        {/* =================================================
                            FORGOT PASSWORD MODE
                        ================================================= */}

                        {mode === "FORGOT" && (

                            <div className="otp-container">


                                <div className="otp-header">

                                    <div className="otp-icon">

                                        <FaKey />

                                    </div>


                                    <h3>
                                        Reset Password
                                    </h3>


                                    <p>
                                        Verify your registered
                                        email to reset your password
                                    </p>

                                </div>


                                {!resetOtpVerified ? (

                                    <>


                                        {/* EMAIL */}

                                        <div className="input-box">

                                            <label>
                                                Registered Email
                                            </label>


                                            <div className="input-field">

                                                <FaEnvelope
                                                    className="input-icon"
                                                />


                                                <input
                                                    type="email"
                                                    placeholder="Enter registered email"
                                                    value={
                                                        resetEmail
                                                    }
                                                    onChange={(e) =>
                                                        setResetEmail(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>


                                        {/* SEND RESET OTP */}

                                        <button
                                            type="button"
                                            className="login-btn"
                                            onClick={
                                                sendForgotPasswordOtp
                                            }
                                            disabled={
                                                resetLoading
                                            }
                                        >

                                            <FaEnvelope />

                                            {resetLoading
                                                ? "Sending OTP..."
                                                : "Send Reset OTP"
                                            }

                                        </button>


                                        {/* RESET OTP */}

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
                                                    value={
                                                        resetOtp
                                                    }
                                                    onChange={(e) =>
                                                        setResetOtp(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>


                                        {/* VERIFY RESET OTP */}

                                        <button
                                            type="button"
                                            className="login-btn"
                                            onClick={
                                                verifyForgotPasswordOtp
                                            }
                                            disabled={
                                                resetLoading
                                            }
                                        >

                                            <FaShieldAlt />

                                            {resetLoading
                                                ? "Verifying..."
                                                : "Verify OTP"
                                            }

                                        </button>


                                    </>

                                ) : (

                                    <>


                                        {/* NEW PASSWORD */}

                                        <div className="input-box">

                                            <label>
                                                New Password
                                            </label>


                                            <div className="input-field">

                                                <FaLock
                                                    className="input-icon"
                                                />


                                                <input
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    value={
                                                        newPassword
                                                    }
                                                    onChange={(e) =>
                                                        setNewPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>


                                        {/* CONFIRM PASSWORD */}

                                        <div className="input-box">

                                            <label>
                                                Confirm New Password
                                            </label>


                                            <div className="input-field">

                                                <FaLock
                                                    className="input-icon"
                                                />


                                                <input
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    value={
                                                        confirmPassword
                                                    }
                                                    onChange={(e) =>
                                                        setConfirmPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>


                                        {/* RESET PASSWORD */}

                                        <button
                                            type="button"
                                            className="login-btn"
                                            onClick={
                                                resetPassword
                                            }
                                            disabled={
                                                resetLoading
                                            }
                                        >

                                            <FaShieldAlt />

                                            {resetLoading
                                                ? "Resetting Password..."
                                                : "Reset Password"
                                            }

                                        </button>


                                    </>

                                )}


                                {/* BACK TO LOGIN */}

                                <button
                                    type="button"
                                    className="back-btn"
                                    onClick={
                                        backToLogin
                                    }
                                >

                                    <FaArrowLeft />

                                    Back To Login

                                </button>


                            </div>

                        )}


                        {/* =================================================
                            FOOTER
                        ================================================= */}

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