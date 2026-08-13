import { Link } from "react-router-dom";

import {
    FaHospital,
    FaCapsules,
    FaShieldAlt,
    FaChartLine,
    FaBoxes,
    FaTruck,
    FaClock,
    FaArrowRight,
    FaUserShield,
    FaUserNurse,
    FaUserTie,
    FaCheckCircle,
    FaSignInAlt
} from "react-icons/fa";

import "../styles/Home.css";

function Home() {

    return (

        <div className="home-page">

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <nav className="home-navbar">

                <div className="home-logo">

                    <div className="home-logo-icon">
                        <FaHospital />
                    </div>

                    <div>
                        <h2>MediStock</h2>
                        <span>Healthcare Inventory</span>
                    </div>

                </div>


                <div className="home-nav-links">

                    <a href="#home">Home</a>

                    <a href="#features">Features</a>

                    <a href="#roles">Roles</a>

                    <a href="#about">About</a>

                </div>


                <div className="home-nav-actions">

                    <Link
                        to="/login"
                        className="home-login-btn"
                    >
                        <FaSignInAlt />
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="home-register-btn"
                    >
                        Register
                    </Link>

                </div>

            </nav>



            {/* =====================================================
                HERO
            ===================================================== */}

            <section
                id="home"
                className="home-hero"
            >

                <div className="hero-background-circle circle-one"></div>
                <div className="hero-background-circle circle-two"></div>
                <div className="hero-background-circle circle-three"></div>


                <div className="hero-content">

                    <div className="hero-badge">

                        <FaShieldAlt />

                        Secure Healthcare Management

                    </div>


                    <h1>

                        Smart Medical Inventory

                        <span>
                            Management Platform
                        </span>

                    </h1>


                    <p>

                        MediStock helps hospitals and pharmacies
                        efficiently manage medicines, inventory,
                        suppliers, stock levels, expiry dates,
                        sales and healthcare analytics from
                        one centralized platform.

                    </p>


                    <div className="hero-buttons">

                        <Link
                            to="/login"
                            className="hero-primary-btn"
                        >

                            Get Started

                            <FaArrowRight />

                        </Link>


                        <a
                            href="#features"
                            className="hero-secondary-btn"
                        >

                            Explore Features

                        </a>

                    </div>


                    <div className="hero-trust">

                        <div>
                            <FaCheckCircle />
                            Role-Based Access
                        </div>

                        <div>
                            <FaCheckCircle />
                            Secure Authentication
                        </div>

                        <div>
                            <FaCheckCircle />
                            Real-Time Monitoring
                        </div>

                    </div>

                </div>



                {/* =================================================
                    HERO DASHBOARD CARD
                ================================================= */}

                <div className="hero-dashboard">

                    <div className="dashboard-window">

                        <div className="window-header">

                            <div className="window-dots">

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                            <span>
                                MediStock Dashboard
                            </span>

                        </div>


                        <div className="dashboard-content">

                            <div className="dashboard-welcome">

                                <div>

                                    <small>
                                        Healthcare Inventory
                                    </small>

                                    <h3>
                                        Inventory Overview
                                    </h3>

                                </div>

                                <FaCapsules />

                            </div>


                            <div className="dashboard-stat-grid">

                                <div className="dashboard-stat">

                                    <div className="stat-icon medicine">
                                        <FaCapsules />
                                    </div>

                                    <div>
                                        <span>Total Medicines</span>
                                        <strong>1,248</strong>
                                    </div>

                                </div>


                                <div className="dashboard-stat">

                                    <div className="stat-icon stock">
                                        <FaBoxes />
                                    </div>

                                    <div>
                                        <span>Available Stock</span>
                                        <strong>8,540</strong>
                                    </div>

                                </div>


                                <div className="dashboard-stat">

                                    <div className="stat-icon suppliers">
                                        <FaTruck />
                                    </div>

                                    <div>
                                        <span>Suppliers</span>
                                        <strong>86</strong>
                                    </div>

                                </div>


                                <div className="dashboard-stat">

                                    <div className="stat-icon expiry">
                                        <FaClock />
                                    </div>

                                    <div>
                                        <span>Expiry Alerts</span>
                                        <strong>12</strong>
                                    </div>

                                </div>

                            </div>


                            <div className="dashboard-chart">

                                <div className="chart-header">

                                    <span>
                                        Stock Analytics
                                    </span>

                                    <small>
                                        Monthly
                                    </small>

                                </div>


                                <div className="chart-bars">

                                    <span style={{ height: "45%" }}></span>
                                    <span style={{ height: "65%" }}></span>
                                    <span style={{ height: "50%" }}></span>
                                    <span style={{ height: "80%" }}></span>
                                    <span style={{ height: "60%" }}></span>
                                    <span style={{ height: "90%" }}></span>
                                    <span style={{ height: "75%" }}></span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>



            {/* =====================================================
                STATS
            ===================================================== */}

            <section className="home-stats">

                <div className="home-stat-box">

                    <FaCapsules />

                    <strong>
                        Medicine Management
                    </strong>

                    <span>
                        Complete medicine inventory control
                    </span>

                </div>


                <div className="home-stat-box">

                    <FaBoxes />

                    <strong>
                        Stock Monitoring
                    </strong>

                    <span>
                        Monitor available and low stock
                    </span>

                </div>


                <div className="home-stat-box">

                    <FaClock />

                    <strong>
                        Expiry Tracking
                    </strong>

                    <span>
                        Detect expired medicines early
                    </span>

                </div>


                <div className="home-stat-box">

                    <FaChartLine />

                    <strong>
                        Smart Reports
                    </strong>

                    <span>
                        Analyze inventory and sales
                    </span>

                </div>

            </section>



            {/* =====================================================
                FEATURES
            ===================================================== */}

            <section
                id="features"
                className="features-section"
            >

                <div className="section-heading">

                    <span>
                        POWERFUL FEATURES
                    </span>

                    <h2>
                        Everything You Need
                        <br />
                        To Manage Medical Inventory
                    </h2>

                    <p>
                        A centralized platform designed to simplify
                        healthcare inventory operations.
                    </p>

                </div>


                <div className="features-grid">

                    <div className="feature-card-home">

                        <div className="feature-icon">
                            <FaCapsules />
                        </div>

                        <h3>
                            Medicine Management
                        </h3>

                        <p>
                            Add, update, view and manage medicines
                            with batch and manufacture information.
                        </p>

                        <span>
                            Explore Medicine Management
                            <FaArrowRight />
                        </span>

                    </div>


                    <div className="feature-card-home">

                        <div className="feature-icon">
                            <FaBoxes />
                        </div>

                        <h3>
                            Inventory Management
                        </h3>

                        <p>
                            Track stock quantities and identify
                            low-stock medicines before they run out.
                        </p>

                        <span>
                            Monitor Inventory
                            <FaArrowRight />
                        </span>

                    </div>


                    <div className="feature-card-home">

                        <div className="feature-icon">
                            <FaTruck />
                        </div>

                        <h3>
                            Supplier Management
                        </h3>

                        <p>
                            Maintain supplier information and
                            organize your medical supply network.
                        </p>

                        <span>
                            Manage Suppliers
                            <FaArrowRight />
                        </span>

                    </div>


                    <div className="feature-card-home">

                        <div className="feature-icon">
                            <FaClock />
                        </div>

                        <h3>
                            Expiry Tracking
                        </h3>

                        <p>
                            Detect expired and near-expiry medicines
                            with intelligent alerts.
                        </p>

                        <span>
                            Track Expiry
                            <FaArrowRight />
                        </span>

                    </div>


                    <div className="feature-card-home">

                        <div className="feature-icon">
                            <FaChartLine />
                        </div>

                        <h3>
                            Reports & Analytics
                        </h3>

                        <p>
                            Generate useful reports and understand
                            stock and sales performance.
                        </p>

                        <span>
                            View Analytics
                            <FaArrowRight />
                        </span>

                    </div>


                    <div className="feature-card-home">

                        <div className="feature-icon">
                            <FaShieldAlt />
                        </div>

                        <h3>
                            Secure Authentication
                        </h3>

                        <p>
                            Protect the platform using role-based
                            authentication and secure login.
                        </p>

                        <span>
                            Secure Access
                            <FaArrowRight />
                        </span>

                    </div>

                </div>

            </section>



            {/* =====================================================
                ROLES
            ===================================================== */}

            <section
                id="roles"
                className="roles-section"
            >

                <div className="section-heading">

                    <span>
                        ROLE BASED ACCESS
                    </span>

                    <h2>
                        One Platform.
                        <br />
                        Three Powerful Roles.
                    </h2>

                    <p>
                        Each user gets access to the tools required
                        for their responsibilities.
                    </p>

                </div>


                <div className="roles-grid">

                    <div className="role-home-card admin-role">

                        <div className="role-home-icon">
                            <FaUserShield />
                        </div>

                        <h3>
                            Administrator
                        </h3>

                        <p>
                            Complete control over the medical
                            inventory management platform.
                        </p>

                        <ul>

                            <li>
                                <FaCheckCircle />
                                Medicine Management
                            </li>

                            <li>
                                <FaCheckCircle />
                                Supplier Management
                            </li>

                            <li>
                                <FaCheckCircle />
                                User Management
                            </li>

                            <li>
                                <FaCheckCircle />
                                Reports & Analytics
                            </li>

                        </ul>

                    </div>


                    <div className="role-home-card pharmacist-role">

                        <div className="role-home-icon">
                            <FaUserNurse />
                        </div>

                        <h3>
                            Pharmacist
                        </h3>

                        <p>
                            Manage medicine sales, stock and
                            expiry-related operations.
                        </p>

                        <ul>

                            <li>
                                <FaCheckCircle />
                                Sell Medicines
                            </li>

                            <li>
                                <FaCheckCircle />
                                View Stock
                            </li>

                            <li>
                                <FaCheckCircle />
                                Expiry Checking
                            </li>

                            <li>
                                <FaCheckCircle />
                                Sales History
                            </li>

                        </ul>

                    </div>


                    <div className="role-home-card staff-role">

                        <div className="role-home-icon">
                            <FaUserTie />
                        </div>

                        <h3>
                            Staff
                        </h3>

                        <p>
                            View important inventory information
                            without modifying system data.
                        </p>

                        <ul>

                            <li>
                                <FaCheckCircle />
                                View Medicines
                            </li>

                            <li>
                                <FaCheckCircle />
                                View Stock
                            </li>

                            <li>
                                <FaCheckCircle />
                                View Suppliers
                            </li>

                            <li>
                                <FaCheckCircle />
                                View Reports
                            </li>

                        </ul>

                    </div>

                </div>

            </section>



            {/* =====================================================
                ABOUT
            ===================================================== */}

            <section
                id="about"
                className="about-section"
            >

                <div className="about-visual">

                    <div className="about-main-card">

                        <div className="about-medical-icon">
                            <FaHospital />
                        </div>

                        <h3>
                            MediStock
                        </h3>

                        <p>
                            Smart Healthcare
                            Inventory Management
                        </p>

                        <div className="about-line"></div>

                        <div className="about-mini-grid">

                            <span>
                                <FaCapsules />
                                Medicines
                            </span>

                            <span>
                                <FaBoxes />
                                Inventory
                            </span>

                            <span>
                                <FaTruck />
                                Suppliers
                            </span>

                            <span>
                                <FaChartLine />
                                Reports
                            </span>

                        </div>

                    </div>

                </div>


                <div className="about-content">

                    <span className="about-label">
                        ABOUT MEDISTOCK
                    </span>

                    <h2>
                        Making Healthcare
                        Inventory Smarter
                    </h2>

                    <p>
                        MediStock is a centralized medical inventory
                        management platform designed to help hospitals,
                        pharmacies and healthcare organizations manage
                        their inventory efficiently.
                    </p>

                    <p>
                        The system combines medicine management,
                        stock monitoring, supplier management,
                        expiry tracking, sales management,
                        notifications and analytics into a single
                        secure platform.
                    </p>


                    <div className="about-checks">

                        <div>
                            <FaCheckCircle />
                            Centralized Inventory Management
                        </div>

                        <div>
                            <FaCheckCircle />
                            Role-Based Authentication
                        </div>

                        <div>
                            <FaCheckCircle />
                            Real-Time Stock Monitoring
                        </div>

                        <div>
                            <FaCheckCircle />
                            Expiry & Low Stock Alerts
                        </div>

                    </div>

                </div>

            </section>



            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="home-cta">

                <div>

                    <span>
                        READY TO GET STARTED?
                    </span>

                    <h2>
                        Manage Your Medical Inventory
                        <br />
                        Smarter With MediStock
                    </h2>

                    <p>
                        Access your dashboard and take control
                        of your healthcare inventory.
                    </p>

                </div>


                <Link
                    to="/login"
                    className="cta-button"
                >

                    Login To MediStock

                    <FaArrowRight />

                </Link>

            </section>



            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="home-footer">

                <div className="footer-brand">

                    <div className="home-logo">

                        <div className="home-logo-icon">
                            <FaHospital />
                        </div>

                        <div>

                            <h2>
                                MediStock
                            </h2>

                            <span>
                                Healthcare Inventory
                            </span>

                        </div>

                    </div>

                    <p>
                        Smart, secure and centralized medical
                        inventory management.
                    </p>

                </div>


                <div className="footer-links">

                    <h4>
                        Platform
                    </h4>

                    <a href="#features">
                        Features
                    </a>

                    <a href="#roles">
                        User Roles
                    </a>

                    <a href="#about">
                        About
                    </a>

                </div>


                <div className="footer-links">

                    <h4>
                        Account
                    </h4>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Register
                    </Link>

                </div>


                <div className="footer-links">

                    <h4>
                        System
                    </h4>

                    <span>
                        Secure Authentication
                    </span>

                    <span>
                        Inventory Monitoring
                    </span>

                    <span>
                        Analytics
                    </span>

                </div>

            </footer>


            <div className="footer-bottom">

                <span>
                    © 2026 MediStock. All Rights Reserved.
                </span>

                <span>
                    Medical Inventory Management Platform
                </span>

            </div>

        </div>

    );

}

export default Home;