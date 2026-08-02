import { useState } from "react";
import "../styles/StaffProfile.css";

function StaffProfile() {

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");


    // ==========================
    // PROFILE DATA
    // ==========================

    const firstLetter =
        user?.fullName?.charAt(0)?.toUpperCase() || "S";


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

                        fullName: fullName,

                        username: username,

                        email: email,

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


            // Backend now returns
            // updated user + NEW JWT
            const updatedUser =
                await response.json();


            // ==========================
            // SAVE NEW JWT
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


            // Also update role
            localStorage.setItem(
                "role",
                updatedUser.role
            );


            alert(
                "Profile updated successfully!"
            );


            // Close modal
            setShowEditProfile(false);


            // Reload page
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

        // Check user ID
        if (!user?.userId) {

            alert(
                "User ID not found. Please log out and log in again."
            );

            return;
        }


        // Check empty fields
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


        // Check password match
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


            // Check response
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

        <div className="staff-profile-container">

            <div className="staff-profile-card">


                {/* ==========================
                    PROFILE HEADER
                ========================== */}

                <div className="staff-profile-header">


                    {/* Avatar */}

                    <div className="staff-profile-avatar">

                        {firstLetter}

                    </div>


                    {/* Profile Information */}

                    <div className="staff-profile-header-info">

                        <h2>

                            {user?.fullName ||
                                "Staff"}

                        </h2>


                        <p>

                            <span className="staff-role-badge">

                                Staff

                            </span>

                        </p>


                        <span className="staff-profile-subtitle">

                            Manage your account information and security

                        </span>

                    </div>

                </div>


                {/* ==========================
                    PERSONAL INFORMATION
                ========================== */}

                <div className="staff-profile-section">

                    <h3>
                        Personal Information
                    </h3>


                    <div className="staff-profile-info-grid">


                        {/* Full Name */}

                        <div className="staff-info-item">

                            <span className="staff-info-label">

                                Full Name

                            </span>

                            <span className="staff-info-value">

                                {user?.fullName ||
                                    "Not available"}

                            </span>

                        </div>


                        {/* Username */}

                        <div className="staff-info-item">

                            <span className="staff-info-label">

                                Username

                            </span>

                            <span className="staff-info-value">

                                {user?.username ||
                                    "Not available"}

                            </span>

                        </div>


                        {/* Email */}

                        <div className="staff-info-item">

                            <span className="staff-info-label">

                                Email Address

                            </span>

                            <span className="staff-info-value">

                                {user?.email ||
                                    "Not available"}

                            </span>

                        </div>


                        {/* Role */}

                        <div className="staff-info-item">

                            <span className="staff-info-label">

                                Role

                            </span>

                            <span className="staff-info-value">

                                {user?.role ||
                                    "Staff"}

                            </span>

                        </div>

                    </div>

                </div>


                {/* ==========================
                    ACCOUNT SETTINGS
                ========================== */}

                <div className="staff-profile-section">

                    <h3>
                        Account Settings
                    </h3>


                    <div className="staff-profile-actions">


                        {/* Edit Profile */}

                        <button
                            className="staff-edit-profile-btn"

                            onClick={() =>
                                setShowEditProfile(true)
                            }
                        >

                            ✏️ Edit Profile

                        </button>


                        {/* Change Password */}

                        <button
                            className="staff-change-password-btn"

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

                    <div className="staff-modal-overlay">

                        <div className="staff-profile-modal">


                            <h3>
                                Edit Profile
                            </h3>


                            {/* Full Name */}

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


                            {/* Username */}

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


                            {/* Email */}

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


                            {/* Modal Buttons */}

                            <div className="staff-modal-buttons">


                                <button
                                    className="staff-save-btn"

                                    onClick={
                                        handleEditProfile
                                    }
                                >

                                    Save Changes

                                </button>


                                <button
                                    className="staff-cancel-btn"

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

                    <div className="staff-modal-overlay">

                        <div className="staff-profile-modal">


                            <h3>
                                Change Password
                            </h3>


                            {/* Current Password */}

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


                            {/* New Password */}

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


                            {/* Confirm Password */}

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


                            {/* Modal Buttons */}

                            <div className="staff-modal-buttons">


                                <button
                                    className="staff-save-btn"

                                    onClick={
                                        handleChangePassword
                                    }
                                >

                                    Change Password

                                </button>


                                <button
                                    className="staff-cancel-btn"

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

export default StaffProfile;