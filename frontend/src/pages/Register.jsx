import { useState } from "react";
import { registerUser } from "../services/authService";
import "../styles/Register.css";

function Register() {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(user);
      alert("Registration Successful!");
      console.log(response.data);
    } catch (error) {
      alert("Registration Failed!");
      console.error(error);
    }
  };

  return (
    <div className="register-page">
      <div
        className="register-container">
        <h1>Medical Inventory System</h1>
        <br></br>
        <h2>Registration Form</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
          />


          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />


          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />


          <select name="role" onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="Staff">Staff</option>
            <option value="Pharmacist">Pharmacist</option>
          </select>



          <button type="submit">Register</button>
          <div className="login-link">
            Already have an account? <a href="/login">Login</a>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Register;