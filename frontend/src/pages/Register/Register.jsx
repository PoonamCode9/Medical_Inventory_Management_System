import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        roleId: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const user = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: {
                    roleId: Number(formData.roleId)
                }
            };

            await registerUser(user);

           

            setFormData({
                fullName: "",
                email: "",
                password: "",
                phone: "",
                roleId: ""
            });

            navigate("/login");

        } catch (err) {

            console.error(err);

            alert(err.response?.data?.message || "❌ Registration Failed!");

        }

    };

    return (

        <div className="register-container">

            <div className="register-card">

                <h1>MediStock</h1>

                <p>Create your account</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="roleId"
                        value={formData.roleId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="1">Admin</option>
                        <option value="2">Pharmacist</option>
                        <option value="3">Staff</option>
                    </select>

                    <button type="submit">
                        Create Account
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Register;