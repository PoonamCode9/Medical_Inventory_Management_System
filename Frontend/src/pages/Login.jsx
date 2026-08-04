import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

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
    FaKey
} from "react-icons/fa";

import loginBg from "../assets/login-bg.jpg";

function Login() {

    const navigate = useNavigate();

    const [mode, setMode] = useState("LOGIN");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        email: "",
        password: "",
        role: "STAFF",
        secretCode: ""
    });

    const [phone, setPhone] = useState("");

    const [otp, setOtp] = useState("");



    // ================= LOGIN =================

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
                    secretCode: data.secretCode
                }
            );

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

            alert("Login Successful");

            redirectUser(
                response.data.role
            );

        }
        catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data
                );

            } else {

                alert(
                    "Unable to connect to server."
                );

            }

        }
        finally {

            setLoading(false);

        }

    };





    // ================= SEND OTP =================

    const sendOtp = async () => {

        try {

            await axios.post(
                "http://localhost:8080/api/auth/send-otp",
                {
                    phone: phone
                }
            );

            alert(
                "OTP Sent Successfully"
            );

        }
        catch (error) {

            console.error(error);

            alert(
                "OTP Sending Failed"
            );

        }

    };






    // ================= VERIFY OTP =================

    const verifyOtp = async () => {

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/verify-otp",
                {
                    phone: phone,
                    otp: otp
                }
            );

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

            alert(
                "OTP Login Successful"
            );

            redirectUser(
                response.data.role
            );

        }
        catch (error) {

            console.error(error);

            alert(
                "Invalid OTP"
            );

        }

    };






    // ================= REDIRECT =================

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
            className="auth-container"
            style={{
                backgroundImage: `
                linear-gradient(
                    135deg,
                    rgba(0,70,120,.85),
                    rgba(0,180,220,.65)
                ),
                url(${loginBg})
                `
            }}
        >

            <div className="auth-overlay"></div>

            <div className="auth-left">

                <div className="brand">

                    <h1>
                        🏥 MediStock
                    </h1>

                    <p>
                        Smart Medical Inventory Management System
                    </p>

                </div>

                <div className="feature-list">

                    <div>💊 Medicine Management</div>

                    <div>🚚 Supplier Tracking</div>

                    <div>⚠ Expiry Notifications</div>

                    <div>📊 Smart Analytics Reports</div>

                </div>

            </div>

            <div className="auth-card">

                <div className="medical-icon">
                    🩺
                </div>

                <h1 className="title">
                    MediStock Login
                </h1>

                {
                    mode === "LOGIN"
                        ?
                        <form onSubmit={handleLogin}>

    <h3 className="role-title">
        Select Account Type
    </h3>

    {/* ================= ROLE SELECTION ================= */}

    <div className="role-box">

        <button
            type="button"
            className={data.role === "ADMIN" ? "role active" : "role"}
            onClick={() =>
                setData({
                    ...data,
                    role: "ADMIN",
                    secretCode: ""
                })
            }
        >
            <FaUserShield />
            <span>Admin</span>
        </button>

        <button
            type="button"
            className={data.role === "PHARMACIST" ? "role active" : "role"}
            onClick={() =>
                setData({
                    ...data,
                    role: "PHARMACIST",
                    secretCode: ""
                })
            }
        >
            <FaUserNurse />
            <span>Pharmacist</span>
        </button>

        <button
            type="button"
            className={data.role === "STAFF" ? "role active" : "role"}
            onClick={() =>
                setData({
                    ...data,
                    role: "STAFF",
                    secretCode: ""
                })
            }
        >
            <FaUserTie />
            <span>Staff</span>
        </button>

    </div>


    {/* ================= SECRET CODE ================= */}

    <div className="input-group">

        <FaKey />

        <input
            type="password"
            placeholder={`${data.role} Secret Code`}
            value={data.secretCode}
            onChange={(e) =>
                setData({
                    ...data,
                    secretCode: e.target.value
                })
            }
            required
        />

    </div>


    {/* ================= EMAIL ================= */}

    <div className="input-group">

        <FaEnvelope />

        <input
            type="email"
            placeholder="Email Address"
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


    {/* ================= PASSWORD ================= */}

    <div className="input-group password-wrapper">

        <FaLock />

        <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={data.password}
            onChange={(e) =>
                setData({
                    ...data,
                    password: e.target.value
                })
            }
            required
        />

        <button
            type="button"
            className="eye-btn"
            onClick={() =>
                setShowPassword(!showPassword)
            }
        >
            {
                showPassword
                    ? <FaEyeSlash />
                    : <FaEye />
            }
        </button>

    </div>


    {/* ================= LOGIN BUTTON ================= */}

    <button
        className="primary-btn"
        type="submit"
        disabled={loading}
    >
        {
            loading
                ? "Logging in..."
                : "🔐 Login"
        }
    </button>


    {/* ================= OTP BUTTON ================= */}

    <button
        type="button"
        className="otp-btn"
        onClick={() =>
            setMode("OTP")
        }
    >
        📱 Login With OTP
    </button>

</form>

:
<div className="otp-section">

    <h2>
        📱 OTP Login
    </h2>

    {/* ================= PHONE ================= */}

    <div className="input-group">

        <FaMobileAlt />

        <input
            type="text"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
        />

    </div>

    {/* ================= SEND OTP ================= */}

    <button
        className="primary-btn"
        onClick={sendOtp}
    >
        Send OTP
    </button>

    {/* ================= OTP INPUT ================= */}

    <div className="input-group">

        <FaKey />

        <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
        />

    </div>

    {/* ================= VERIFY OTP ================= */}

    <button
        className="primary-btn"
        onClick={verifyOtp}
    >
        Verify OTP
    </button>

    {/* ================= BACK ================= */}

    <button
        className="back-btn"
        onClick={() => setMode("LOGIN")}
    >
        <FaArrowLeft />
        <span>Back</span>
    </button>

</div>

}

<div className="link">

    <Link to="/register">
        Don't have an account? Register
    </Link>

</div>

</div>

</div>

);

}

export default Login;