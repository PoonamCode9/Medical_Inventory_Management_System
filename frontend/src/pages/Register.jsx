import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../css/Register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("STAFF");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const register = async () => {

        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            alert("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            setLoading(true);

            await API.post("/users/register", {
                name,
                email,
                password,
                role
            });

            alert("Registration Successful!");

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setRole("STAFF");

            navigate("/");

        } catch (error) {

            console.log(error);
            console.log(error.response?.data);

            alert("Registration Failed");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="register-page">

            <div className="register-card">

                <h2>Create Account</h2>

                <p>Register to access MediStock</p>

                {/* Name */}

                <input
                    className="form-control mb-3"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Email */}

                <input
                    className="form-control mb-3"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password */}

                <div className="password-field mb-3">

                    <input
                        className="form-control"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>

                </div>

                {/* Confirm Password */}

                <div className="password-field mb-3">

                    <input
                        className="form-control"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <span
                        className="eye-icon"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>

                </div>

                {/* Role */}

                <select
                    className="form-select mb-4"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="ADMIN">Admin</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="STAFF">Staff</option>
                </select>

                <button
                    className="btn btn-success w-100"
                    onClick={register}
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <div className="text-center mt-4">

                    Already have an account?

                    <Link to="/" className="ms-2">
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );
}

export default Register;