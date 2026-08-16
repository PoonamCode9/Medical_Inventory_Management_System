import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../css/AuthSupport.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await API.post("/users/forgot-password", { email });
            setSent(true);
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to send reset email."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-support-page">
            <div className="auth-support-card">

                <div className="support-icon">🔐</div>
                <h2>Forgot Password?</h2>

                {sent ? (
                    <>
                        <p>
                            A password reset link has been sent to your registered email.
                            The link is valid for 15 minutes.
                        </p>

                        <Link to="/" className="support-button">
                            Back to Login
                        </Link>
                    </>
                ) : (
                    <>
                        <p>Enter your MediStock registered email address.</p>

                        <form onSubmit={submit}>
                            <input
                                type="email"
                                placeholder="Enter registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <button type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>

                        <Link to="/" className="support-link">
                            ← Back to Login
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
}

export default ForgotPassword;
