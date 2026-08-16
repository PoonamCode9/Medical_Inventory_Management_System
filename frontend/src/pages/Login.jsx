import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../css/Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post("/users/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("role", response.data.role);

            navigate("/dashboard");

        } catch {

            alert("Invalid Email or Password");

        }
    };

    const handleGoogleLogin = () => {

        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";

    };

    return (

        <div className="login-page">

            <div className="overlay">

                <div className="login-wrapper">

                    {/* LEFT SECTION */}

                    <div className="left-section">

                        <h1>
                            Welcome to
                            <br />
                            <span>MediStock</span>
                        </h1>

                        <p className="tagline">
                            Smart Medical Inventory
                            <br />
                            Management System
                        </p>

                        <div className="features">

                            <div>✔ Manage Medicines Efficiently</div>

                            <div>✔ Secure Role Based Login</div>

                            <div>✔ Track Inventory in Real Time</div>

                            <div>✔ Generate Reports Easily</div>

                        </div>

                    </div>

                    {/* RIGHT SECTION */}

                    <div className="login-card">

                        <div className="logo-circle">
                            💊
                        </div>

                        <h2>Login</h2>

                        <p className="subtitle">
                            Sign in to continue
                        </p>

                        <form onSubmit={handleLogin}>

                            <div className="input-group">

                                <label>Email</label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="input-group">

                                <label>Password</label>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <button type="submit">
                                Login
                            </button>

                            <div className="forgot-password-link">
                                <Link to="/forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>

                        </form>

                        {/* GOOGLE LOGIN */}

                        <div className="google-login">

                            <div className="divider">
                                <span>OR</span>
                            </div>

                            <button
                                type="button"
                                className="google-btn"
                                onClick={handleGoogleLogin}
                            >
                                Continue with Google
                            </button>

                        </div>

                        {/* REGISTER */}

                        <div className="text-center mt-3">

                            Don't have an account?

                            <Link
                                to="/register"
                                className="ms-2"
                            >
                                Register
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Login;