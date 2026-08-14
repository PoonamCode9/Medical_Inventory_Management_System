import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/Api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/forgot-password", {
        email: email.trim(),
      });

      toast.success(
        typeof response.data === "string"
          ? response.data
          : "OTP sent successfully to your email!"
      );

      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : "") ||
        "Failed to send OTP. Please try again.";

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-sm text-center text-gray-600">
          Enter your registered email address to receive a 6-digit OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-gray-400 cursor-pointer transition-colors"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="text-center">
          <Link to="/" className="text-sm text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;