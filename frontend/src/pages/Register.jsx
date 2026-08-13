import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import {
    FaEye,
    FaEyeSlash,
    FaUserShield,
    FaUserNurse,
    FaUserTie,
    FaUserCircle,
    FaEnvelope,
    FaHeartbeat,
    FaHospital,
    FaBoxes,
    FaChartLine,
    FaUserPlus,
    FaKey,
    FaMobileAlt
} from "react-icons/fa";

import registerBg from "../assets/register-bg.jpg";

import {
    showSuccess,
    showError,
    showWarning
} from "../components/Toast";

import "./Register.css";


function Register() {


    // ==========================================
    // STATES
    // ==========================================

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);


    const [data, setData] = useState({

        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "STAFF"

    });


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        setData({

            ...data,

            [e.target.name]: e.target.value

        });

    };


    // ==========================================
    // HANDLE ROLE CHANGE
    // ==========================================

    const handleRoleChange = (role) => {

        setData({

            ...data,

            role

        });

    };


    // ==========================================
    // HANDLE REGISTER
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // ======================================
        // BASIC VALIDATION
        // ======================================

        if (!data.fullName.trim()) {

            showWarning(
                "Please enter your full name."
            );

            return;

        }


        if (!data.username.trim()) {

            showWarning(
                "Please enter a username."
            );

            return;

        }


        if (!data.email.trim()) {

            showWarning(
                "Please enter your email address."
            );

            return;

        }


        if (!data.phone.trim()) {

            showWarning(
                "Please enter your mobile number."
            );

            return;

        }


        if (!/^\d{10}$/.test(data.phone)) {

            showWarning(
                "Please enter a valid 10-digit mobile number."
            );

            return;

        }


        if (!data.password) {

            showWarning(
                "Please enter a password."
            );

            return;

        }


        if (data.password.length < 6) {

            showWarning(
                "Password must contain at least 6 characters."
            );

            return;

        }


        // ======================================
        // API REQUEST
        // ======================================

        try {

            setLoading(true);


            await axios.post(

                "http://localhost:8080/api/auth/register",

                data

            );


            // ==================================
            // SUCCESS TOAST
            // ==================================

            showSuccess(
                "Account created successfully. You can now login."
            );


            // ==================================
            // CLEAR FORM
            // ==================================

            setData({

                fullName: "",
                username: "",
                email: "",
                phone: "",
                password: "",
                role: "STAFF"

            });


            setShowPassword(false);


        }

        catch (error) {

            console.error(
                "Registration error:",
                error
            );


            // ==================================
            // GET BACKEND MESSAGE
            // ==================================

            let message =
                "Registration failed. Please try again.";


            if (
                typeof error.response?.data ===
                "string"
            ) {

                message =
                    error.response.data;

            }

            else if (
                error.response?.data?.message
            ) {

                message =
                    error.response.data.message;

            }

            else if (
                error.response?.data?.error
            ) {

                message =
                    error.response.data.error;

            }


            // ==================================
            // HIDE TECHNICAL ERRORS
            // ==================================

            const technicalErrors = [

                "localhost",
                "Exception",
                "org.springframework",
                "Whitelabel",
                "StackTrace",
                "ServletException",
                "java.",
                "SQL",
                "Hibernate"

            ];


            const containsTechnicalError =
                technicalErrors.some(
                    (text) =>
                        message
                            .toString()
                            .includes(text)
                );


            if (containsTechnicalError) {

                message =
                    "Registration failed. Please check your details and try again.";

            }


            // ==================================
            // ERROR TOAST
            // ==================================

            showError(message);

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="register-page">


            <div

                className="register-background"

                style={{

                    backgroundImage:

                        `
                        linear-gradient(
                            135deg,
                            rgba(0,65,120,.90),
                            rgba(0,190,220,.70)
                        ),
                        url(${registerBg})
                        `

                }}

            >


                <div className="register-wrapper">


                    {/* ==========================================
                        LEFT SECTION
                    ========================================== */}

                    <div className="register-info">


                        <div className="brand-logo">


                            <div className="logo-circle">

                                <FaHeartbeat />

                            </div>


                            <h1>

                                MediStock

                            </h1>


                        </div>


                        <h2>

                            Create Your Medical Account

                        </h2>


                        <p>

                            Manage medicines, suppliers and inventory
                            with a secure healthcare platform.

                        </p>


                        {/* ==========================================
                            FEATURES
                        ========================================== */}

                        <div className="features">


                            <div className="feature-item">

                                <FaHospital />

                                <span>

                                    Hospital Inventory Management

                                </span>

                            </div>


                            <div className="feature-item">

                                <FaBoxes />

                                <span>

                                    Medicine Stock Tracking

                                </span>

                            </div>


                            <div className="feature-item">

                                <FaChartLine />

                                <span>

                                    Smart Analytics Dashboard

                                </span>

                            </div>


                        </div>


                    </div>


                    {/* ==========================================
                        REGISTER CARD
                    ========================================== */}

                    <div className="register-card">


                        {/* ==========================================
                            CARD HEADER
                        ========================================== */}

                        <div className="card-header">


                            <div className="medical-symbol">

                                <FaUserPlus />

                            </div>


                            <h1>

                                Create Account

                            </h1>


                            <p>

                                Join MediStock Healthcare System

                            </p>


                        </div>


                        {/* ==========================================
                            FORM
                        ========================================== */}

                        <form onSubmit={handleSubmit}>


                            {/* FULL NAME */}

                            <div className="input-box">

                                <FaUserCircle />

                                <input

                                    type="text"

                                    name="fullName"

                                    placeholder="Full Name"

                                    value={data.fullName}

                                    onChange={handleChange}

                                    autoComplete="name"

                                    required

                                />

                            </div>


                            {/* USERNAME */}

                            <div className="input-box">

                                <FaUserCircle />

                                <input

                                    type="text"

                                    name="username"

                                    placeholder="Username"

                                    value={data.username}

                                    onChange={handleChange}

                                    autoComplete="username"

                                    required

                                />

                            </div>


                            {/* EMAIL */}

                            <div className="input-box">

                                <FaEnvelope />

                                <input

                                    type="email"

                                    name="email"

                                    placeholder="Email Address"

                                    value={data.email}

                                    onChange={handleChange}

                                    autoComplete="email"

                                    required

                                />

                            </div>


                            {/* PHONE */}

                            <div className="input-box">

                                <FaMobileAlt />

                                <input

                                    type="tel"

                                    name="phone"

                                    placeholder="Mobile Number"

                                    maxLength="10"

                                    value={data.phone}

                                    onChange={(e) => {

                                        const value =
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        setData({

                                            ...data,

                                            phone: value

                                        });

                                    }}

                                    autoComplete="tel"

                                    required

                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="input-box password-box">

                                <FaKey />


                                <input

                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }

                                    name="password"

                                    placeholder="Password"

                                    value={data.password}

                                    onChange={handleChange}

                                    autoComplete="new-password"

                                    required

                                />


                                <button

                                    type="button"

                                    className="password-toggle"

                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }

                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }

                                >

                                    {

                                        showPassword

                                            ? <FaEyeSlash />

                                            : <FaEye />

                                    }

                                </button>


                            </div>


                            {/* ==========================================
                                ROLE TITLE
                            ========================================== */}

                            <h3 className="choose-title">

                                Select Account Type

                            </h3>


                            {/* ==========================================
                                ROLE CARDS
                            ========================================== */}

                            <div className="role-container">


                                {/* ADMIN */}

                                <button

                                    type="button"

                                    className={

                                        data.role === "ADMIN"

                                            ? "role-card selected"

                                            : "role-card"

                                    }

                                    onClick={() =>
                                        handleRoleChange(
                                            "ADMIN"
                                        )
                                    }

                                >

                                    <FaUserShield />

                                    <span>

                                        Admin

                                    </span>

                                </button>


                                {/* PHARMACIST */}

                                <button

                                    type="button"

                                    className={

                                        data.role === "PHARMACIST"

                                            ? "role-card selected"

                                            : "role-card"

                                    }

                                    onClick={() =>
                                        handleRoleChange(
                                            "PHARMACIST"
                                        )
                                    }

                                >

                                    <FaUserNurse />

                                    <span>

                                        Pharmacist

                                    </span>

                                </button>


                                {/* STAFF */}

                                <button

                                    type="button"

                                    className={

                                        data.role === "STAFF"

                                            ? "role-card selected"

                                            : "role-card"

                                    }

                                    onClick={() =>
                                        handleRoleChange(
                                            "STAFF"
                                        )
                                    }

                                >

                                    <FaUserTie />

                                    <span>

                                        Staff

                                    </span>

                                </button>


                            </div>


                            {/* ==========================================
                                REGISTER BUTTON
                            ========================================== */}

                            <button

                                className="register-btn"

                                type="submit"

                                disabled={loading}

                            >

                                {

                                    loading

                                        ? "Creating Account..."

                                        : "Create Account"

                                }

                            </button>


                        </form>


                        {/* ==========================================
                            LOGIN LINK
                        ========================================== */}

                        <div className="login-link">

                            Already have an account?


                            <Link to="/login">

                                Login

                            </Link>

                        </div>


                    </div>


                </div>


            </div>


        </div>

    );

}


export default Register;