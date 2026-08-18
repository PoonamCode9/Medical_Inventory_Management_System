import { useState } from "react";
import API from "../api/Api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !fullname.trim() ||
      !email.trim() ||
      !password ||
      !confirmPass ||
      !phone.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPass) {
      toast.error("Passwords do not match.");
      return;
    }

    const userData = {
      fullName: fullname.trim(),
      email: email.trim(),
      password: password,
      phone: phone.trim(),
    };

    setLoading(true);

    try {
      const response = await API.post("/auth/register", userData);
      toast.success("Account created successfully! Please login.");
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response?.data) {
        toast.error(
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data.message || "Registration failed."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://medistock-backend-ljqa.onrender.com/oauth2/authorization/google";
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      {/* Left side */}
      <div className="w-1/2 relative hidden md:block">
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
      <div className="flex w-full md:w-1/2 flex-col justify-center bg-white px-8 sm:px-16 py-4 text-center h-screen overflow-y-auto">
        <h1 className="text-4xl font-extrabold text-blue-700">MediStock</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Medical Inventory Management Platform
        </p>
        <h2 className="text-2xl font-semibold mt-3 text-slate-800">Create Account</h2>
        <p className="text-gray-500 text-xs mt-1">Register to get started</p>

        <form className="mt-4 space-y-3" onSubmit={handleRegister}>
          <div>
            <label
              className="block w-max mb-1 font-bold text-start text-xs text-slate-700"
              htmlFor="fullname"
            >
              Full Name
            </label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-2xs"
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block w-max mb-1 font-bold text-start text-xs text-slate-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-2xs"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block w-max mb-1 font-bold text-start text-xs text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="w-full border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-2xs"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block w-max mb-1 font-bold text-start text-xs text-slate-700"
              htmlFor="confirm_pass"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-2xs"
                id="confirm_pass"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block w-max mb-1 font-bold text-start text-xs text-slate-700"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-2xs"
              id="phone"
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 transition-colors shadow-sm cursor-pointer text-sm mt-2"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-3">
          <p className="mb-2 text-xs text-slate-400">or</p>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-slate-200 py-2 rounded-lg font-bold text-slate-700 bg-blue-200 hover:bg-blue-600 hover:text-white transition cursor-pointer flex justify-center items-center gap-2 text-sm shadow-2xs"
          >
            <img src="/google-logo.png" alt="googleLogo" className="w-4 h-4" />
            Signup with Google
          </button>
        </div>

        <div className="flex justify-between items-center mt-4 text-xs">
          <p className="text-slate-500">Already have an account?</p>
          <Link to="/" className="text-blue-600 hover:underline font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;