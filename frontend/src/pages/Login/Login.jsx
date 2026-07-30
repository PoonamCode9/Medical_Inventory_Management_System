import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await loginUser(loginData);

            // Save user details
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("roleId", response.data.roleId);
            localStorage.setItem("roleName", response.data.roleName);
            localStorage.setItem("fullName", response.data.fullName);

           

            // Navigate based on role
            if (response.data.roleId === 1) {

                navigate("/admin");

            } else if (response.data.roleId === 2) {

                navigate("/pharmacist");

            } else if (response.data.roleId === 3) {
    navigate("/staff");
} else {

                alert("Invalid User Role");

            }

        } catch (err) {

            console.error(err);

            alert(err.response?.data?.message || "Invalid Email or Password");

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>MediStock</h1>

                <p>Login to continue</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={loginData.email}
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

                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Login;