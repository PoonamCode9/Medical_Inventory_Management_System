import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../css/Settings.css";

function Settings() {

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        role: ""
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const loadProfile = async () => {
        try {
            const response = await API.get("/users/profile");

            setProfile({
                name: response.data.name || "",
                email: response.data.email || "",
                role: response.data.role?.roleName || localStorage.getItem("role") || ""
            });
        } catch (error) {
            console.log(error);
            alert("Unable to load profile.");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const updateProfile = async (e) => {
        e.preventDefault();

        try {
            await API.put("/users/profile", {
                name: profile.name,
                email: profile.email,
                password: ""
            });

            localStorage.setItem("name", profile.name);
            localStorage.setItem("email", profile.email);

            alert("Profile updated successfully.");
        } catch (error) {
            console.log(error);
            alert("Profile update failed.");
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        try {
            await API.post("/users/reset-password", {
                currentPassword,
                newPassword
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            alert("Password changed successfully.");
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Password change failed."
            );
        }
    };

    return (
        <div className="settings-page">

            <div className="container mt-4">

                <div className="settings-header">
                    <div>
                        <h2>⚙️ Settings</h2>
                        <p>Manage your MediStock account and security.</p>
                    </div>

                    <Link to="/dashboard" className="back-dashboard">
                        ← Dashboard
                    </Link>
                </div>

                <div className="settings-grid">

                    <div className="settings-card">
                        <h4>👤 Profile</h4>
                        <p className="settings-help">
                            Update your account information.
                        </p>

                        <form onSubmit={updateProfile}>

                            <label>Name</label>
                            <input
                                className="form-control mb-3"
                                value={profile.name}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        name: e.target.value
                                    })
                                }
                                required
                            />

                            <label>Email</label>
                            <input
                                className="form-control mb-3"
                                type="email"
                                value={profile.email}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        email: e.target.value
                                    })
                                }
                                required
                            />

                            <label>Role</label>
                            <input
                                className="form-control mb-3"
                                value={profile.role}
                                readOnly
                            />

                            <button className="settings-primary" type="submit">
                                Save Profile
                            </button>
                        </form>
                    </div>

                    <div className="settings-card">
                        <h4>🔐 Change Password</h4>
                        <p className="settings-help">
                            Change your current MediStock password.
                        </p>

                        <form onSubmit={changePassword}>

                            <label>Current Password</label>
                            <input
                                className="form-control mb-3"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />

                            <label>New Password</label>
                            <input
                                className="form-control mb-3"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            <label>Confirm New Password</label>
                            <input
                                className="form-control mb-3"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <button className="settings-primary" type="submit">
                                Change Password
                            </button>
                        </form>
                    </div>

                    <div className="settings-card reset-card">
                        <h4>📧 Password Recovery</h4>
                        <p className="settings-help">
                            Forgot your password? We can send a secure reset link to your registered email.
                        </p>

                        <Link to="/" className="settings-secondary">
                            Go to Login → Forgot Password
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Settings;
