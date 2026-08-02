import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(loginData);

      // Save JWT token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);


      // Save user details for profile page
      localStorage.setItem("user", JSON.stringify({
        userId: response.data.userId,
        fullName: response.data.fullName,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      }));

      // Redirect based on role
      if (response.data.role === "Admin") {
        navigate("/admin-dashboard");
      } else if (response.data.role === "Staff") {
        navigate("/staff-dashboard");
      } else if (response.data.role === "Pharmacist") {
        navigate("/pharmacist-dashboard");
      } else {
        alert("Invalid role!");
      }
    } catch (error) {
      alert("Invalid Username or Password!");
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Medical Inventory System</h1>
        <br />
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={loginData.username}
            onChange={handleChange}
            required
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />


          <button type="submit">Login</button>

          <div className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;