import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("admin@medistock.com");
    const [password, setPassword] = useState("admin123");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const response = await axios.post(
                "http://localhost:8081/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            console.log("Login response:", response.data);

            // Save JWT
            if (response.data.token) {

                localStorage.setItem(
                    "token",
                    response.data.token
                );

            }

            // Save user information if returned
            if (response.data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

            }

            navigate("/dashboard");

        } catch (err) {

            console.error("Login error:", err);

            if (err.response) {

                setError(
                    err.response.data?.message ||
                    err.response.data ||
                    "Invalid email or password"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }
        }
    };

    return (

        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{
                background:
                    "linear-gradient(135deg,#2563eb,#06b6d4)"
            }}
        >

            <div
                className="card shadow-lg border-0"
                style={{
                    width: "430px",
                    borderRadius: "20px"
                }}
            >

                <div className="card-body p-5">

                    <div className="text-center mb-4">

                        <div
                            style={{
                                fontSize: "60px"
                            }}
                        >
                            💊
                        </div>

                        <h1 className="fw-bold">
                            MediStock
                        </h1>

                        <p className="text-muted">
                            Medical Inventory Management
                        </p>

                    </div>

                    {error && (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    )}

                    <form onSubmit={handleLogin}>

                        <div className="mb-3">

                            <label className="form-label fw-bold">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control form-control-lg"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="form-label fw-bold">
                                Password
                            </label>

                            <input
                                type="password"
                                className="form-control form-control-lg"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100"
                        >
                            Login
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Login;