import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../css/AuthSupport.css";

function ResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Invalid password reset link.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await API.post("/users/reset-password-token", {
                token,
                newPassword
            });

            alert("Password reset successfully. Please log in.");
            navigate("/");
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Reset link is invalid or expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-support-page">
            <div className="auth-support-card">

                <div className="support-icon">🔑</div>
                <h2>Reset Password</h2>

                <p>Create a new password for your MediStock account.</p>

                {!token ? (
                    <Link to="/" className="support-button">
                        Back to Login
                    </Link>
                ) : (
                    <form onSubmit={submit}>

                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength="6"
                        />

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                    </form>
                )}

                <Link to="/" className="support-link">
                    ← Back to Login
                </Link>

            </div>
        </div>
    );
}

export default ResetPassword;
