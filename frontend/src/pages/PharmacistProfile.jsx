import { useState } from "react";
import "../styles/PharmacistProfile.css";

function PharmacistProfile() {

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");


    // ==========================
    // PROFILE DATA
    // ==========================

    const firstLetter =
        user?.fullName?.charAt(0)?.toUpperCase() || "P";


    // ==========================
    // EDIT PROFILE STATES
    // ==========================

    const [showEditProfile, setShowEditProfile] =
        useState(false);

    const [fullName, setFullName] =
        useState(user?.fullName || "");

    const [username, setUsername] =
        useState(user?.username || "");

    const [email, setEmail] =
        useState(user?.email || "");


    // ==========================
    // CHANGE PASSWORD STATES
    // ==========================

    const [showChangePassword, setShowChangePassword] =
        useState(false);

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    // ==========================
    // EDIT PROFILE
    // ==========================

    // ==========================
    // EDIT PROFILE
    // ==========================

    const handleEditProfile = async () => {

        if (!user?.userId) {

            alert(
                "User ID not found. Please log out and log in again."
            );

            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/users/${user.userId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({

                        fullName:
                            fullName,

                        username:
                            username,

                        email:
                            email,

                    }),
                }
            );


            if (!response.ok) {

                const errorMessage =
                    await response.text();

                throw new Error(
                    errorMessage ||
                    "Failed to update profile"
                );

            }


            // Backend returns:
            // token + userId + fullName +
            // username + email + role

            const updatedUser =
                await response.json();


            // ==========================
            // SAVE NEW JWT TOKEN
            // ==========================

            localStorage.setItem(
                "token",
                updatedUser.token
            );


            // ==========================
            // SAVE UPDATED USER
            // ==========================

            const updatedUserForStorage = {

                userId:
                    updatedUser.userId,

                fullName:
                    updatedUser.fullName,

                username:
                    updatedUser.username,

                email:
                    updatedUser.email,

                role:
                    updatedUser.role,

            };


            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUserForStorage
                )
            );


            // Update role storage
            localStorage.setItem(
                "role",
                updatedUser.role
            );


            alert(
                "Profile updated successfully!"
            );


            // Close modal
            setShowEditProfile(false);


            // Refresh page
            window.location.reload();


        } catch (error) {

            console.error(
                "Profile Update Error:",
                error
            );


            alert(
                error.message ||
                "Failed to update profile."
            );

        }

    };


    // ==========================
    // CHANGE PASSWORD
    // ==========================

    const handleChangePassword = async () => {

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            alert(
                "Please fill all password fields."
            );

            return;

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "New password and confirm password do not match."
            );

            return;

        }


        try {

            const response = await fetch(
                `http://localhost:8080/users/${user.userId}/change-password`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({

                        currentPassword:
                            currentPassword,

                        newPassword:
                            newPassword,

                    }),
                }
            );


            if (!response.ok) {

                const errorMessage =
                    await response.text();

                throw new Error(
                    errorMessage ||
                    "Failed to change password"
                );

            }


            alert(
                "Password changed successfully!"
            );


            // Clear password fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");


            // Close modal
            setShowChangePassword(false);


        } catch (error) {

            console.error(
                "Password Change Error:",
                error
            );


            alert(
                error.message ||
                "Failed to change password."
            );

        }

    };


    return (

        <div className="pharmacist-profile-container">

            <div className="pharmacist-profile-card">


                {/* ==========================
                    PROFILE HEADER
                ========================== */}

                <div className="pharmacist-profile-header">

                    <div className="pharmacist-profile-avatar">

                        {firstLetter}

                    </div>


                    <div className="pharmacist-profile-header-info">

                        <h2>
                            {user?.fullName || "Pharmacist"}
                        </h2>


                        <p>

                            <span className="pharmacist-role-badge">

                                Pharmacist

                            </span>

                        </p>


                        <span className="pharmacist-profile-subtitle">

                            Manage your account information and security

                        </span>

                    </div>

                </div>


                {/* ==========================
                    PERSONAL INFORMATION
                ========================== */}

                <div className="pharmacist-profile-section">

                    <h3>
                        Personal Information
                    </h3>


                    <div className="pharmacist-profile-info-grid">


                        <div className="pharmacist-info-item">

                            <span className="pharmacist-info-label">
                                Full Name
                            </span>

                            <span className="pharmacist-info-value">

                                {user?.fullName ||
                                    "Not available"}

                            </span>

                        </div>


                        <div className="pharmacist-info-item">

                            <span className="pharmacist-info-label">
                                Username
                            </span>

                            <span className="pharmacist-info-value">

                                {user?.username ||
                                    "Not available"}

                            </span>

                        </div>


                        <div className="pharmacist-info-item">

                            <span className="pharmacist-info-label">
                                Email Address
                            </span>

                            <span className="pharmacist-info-value">

                                {user?.email ||
                                    "Not available"}

                            </span>

                        </div>


                        <div className="pharmacist-info-item">

                            <span className="pharmacist-info-label">
                                Role
                            </span>

                            <span className="pharmacist-info-value">

                                {user?.role ||
                                    "Pharmacist"}

                            </span>

                        </div>

                    </div>

                </div>


                {/* ==========================
                    ACCOUNT SETTINGS
                ========================== */}

                <div className="pharmacist-profile-section">

                    <h3>
                        Account Settings
                    </h3>


                    <div className="pharmacist-profile-actions">


                        <button
                            className="pharmacist-edit-profile-btn"
                            onClick={() =>
                                setShowEditProfile(true)
                            }
                        >

                            ✏️ Edit Profile

                        </button>


                        <button
                            className="pharmacist-change-password-btn"
                            onClick={() =>
                                setShowChangePassword(true)
                            }
                        >

                            🔒 Change Password

                        </button>


                    </div>

                </div>


                {/* ==========================
                    EDIT PROFILE MODAL
                ========================== */}

                {showEditProfile && (

                    <div className="pharmacist-modal-overlay">

                        <div className="pharmacist-profile-modal">

                            <h3>
                                Edit Profile
                            </h3>


                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) =>
                                    setFullName(
                                        e.target.value
                                    )
                                }
                            />


                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                            />


                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                            />


                            <div className="pharmacist-modal-buttons">

                                <button
                                    className="pharmacist-save-btn"
                                    onClick={
                                        handleEditProfile
                                    }
                                >
                                    Save Changes
                                </button>


                                <button
                                    className="pharmacist-cancel-btn"
                                    onClick={() =>
                                        setShowEditProfile(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {/* ==========================
                    CHANGE PASSWORD MODAL
                ========================== */}

                {showChangePassword && (

                    <div className="pharmacist-modal-overlay">

                        <div className="pharmacist-profile-modal">

                            <h3>
                                Change Password
                            </h3>


                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                value={
                                    currentPassword
                                }
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                            />


                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                value={
                                    newPassword
                                }
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                            />


                            <label>
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                value={
                                    confirmPassword
                                }
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                            />


                            <div className="pharmacist-modal-buttons">

                                <button
                                    className="pharmacist-save-btn"
                                    onClick={
                                        handleChangePassword
                                    }
                                >
                                    Change Password
                                </button>


                                <button
                                    className="pharmacist-cancel-btn"
                                    onClick={() =>
                                        setShowChangePassword(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}

export default PharmacistProfile;