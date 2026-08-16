import { useEffect, useState } from "react";
import API from "../api/Api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const response = await API.post("/auth/login", { email, password });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");

      if (rememberMe) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
      } else {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("role", response.data.role);
      }

      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string" ? error.response?.data : "") ||
        "Something went wrong. Please try again.";

      toast.error(errorMsg);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      {/* Left side */}
      <div className="w-1/2 relative">
        <img
          src="/medicine.jpg"
          alt="medicineImg"
          className="w-full h-screen object-cover"
        />
        <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/70 to-white"></div>
        <div className="absolute bottom-20 left-12 text-white z-10">
          <h2
            className="text-4xl font-extrabold"
            style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}
          >
            Manage Medicines Efficiently
          </h2>
          <p
            className="mt-3 text-lg font-bold"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            Track inventory, monitor expiry dates, and manage suppliers with
            ease.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex w-1/2 flex-col justify-center bg-white p-13 text-center">
        <h1 className="text-5xl font-extrabold text-blue-700">MediStock</h1>
        <p className="text-gray-500 mt-2">
          Medical Inventory Management Platform
        </p>
        <h2 className="text-3xl font-semibold mt-5">Welcome Back!👋</h2>
        <p className="text-gray-500 mt-2">Please sign in to your account</p>

        <form className="mt-10 space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              className="block w-max mb-2 font-medium text-start"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full border rounded-lg px-4 py-3 focus:ring-blue-500 focus:outline-none focus:border-blue-500 shadow-sm"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block w-max mb-2 font-medium text-start"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="w-full border rounded-lg pl-4 pr-12 py-3 focus:ring-blue-500 focus:outline-none focus:border-blue-500 shadow-sm"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash text-lg"></i>
                ) : (
                  <i className="fa-solid fa-eye text-lg"></i>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="cursor-pointer h-4 w-4 text-blue-600 rounded border-gray-300"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 cursor-pointer select-none text-sm font-medium"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="mt-3">
          <p className="mb-3 text-gray-400">or</p>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border py-3 rounded-lg font-semibold bg-blue-200 hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer flex justify-center items-center gap-3"
          >
            <img src="/google-logo.png" alt="googleLogo" className="w-5" />
            Login with Google
          </button>
        </div>

        <div className="flex justify-between mt-3">
          <p className="text-gray-600">Don't have an account?</p>
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;