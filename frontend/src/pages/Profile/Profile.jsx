import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaCalendarAlt,
  FaLock,
  FaEdit,
  FaSave,
} from "react-icons/fa";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../services/profileService";

import "./profile.css";

export default function Profile() {

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    createdAt: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {

      await updateProfile({
        fullName: profile.fullName,
        phone: profile.phone,
      });

      alert("Profile Updated Successfully");

      setEditing(false);

      loadProfile();

    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }
  };

  const handlePassword = async () => {

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password Changed Successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {

      console.log(err);

      alert(err.response?.data || "Password Change Failed");
    }

  };

  return (
    <div className="profile-container">

      <div className="profile-main">

        <Navbar userName={profile.fullName} />

        <div className="profile-content">

          <div className="profile-header">

            <div className="avatar">
              {profile.fullName
                ? profile.fullName.charAt(0).toUpperCase()
                : "U"}
            </div>

            <h2>{profile.fullName}</h2>

            <p>{profile.role}</p>

          </div>

          <div className="profile-card">

            <div className="card-header">

              <h3>Personal Information</h3>

              <button
                className="edit-btn"
                onClick={() => {
                  if (editing) {
                    handleUpdate();
                  } else {
                    setEditing(true);
                  }
                }}
              >
                {editing ? (
                  <>
                    <FaSave /> Save
                  </>
                ) : (
                  <>
                    <FaEdit /> Edit
                  </>
                )}
              </button>

            </div>

            <div className="profile-grid">

              <div className="profile-field">

                <label>
                  <FaUser /> Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>

              <div className="profile-field">

                <label>
                  <FaEnvelope /> Email
                </label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                />

              </div>

              <div className="profile-field">

                <label>
                  <FaPhone /> Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>

              <div className="profile-field">

                <label>
                  <FaUserShield /> Role
                </label>

                <input
                  type="text"
                  value={profile.role}
                  disabled
                />

              </div>

              <div className="profile-field">

                <label>
                  <FaCalendarAlt /> Joined
                </label>

                <input
                  type="text"
                  value={
                    profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : ""
                  }
                  disabled
                />

              </div>

            </div>

          </div>
                    {/* Statistics */}

          <div className="stats-grid">

            <div className="stat-card">
              <h3>186</h3>
              <p>Medicines</p>
            </div>

            <div className="stat-card">
              <h3>96</h3>
              <p>Orders</p>
            </div>

            <div className="stat-card">
              <h3>58</h3>
              <p>Notifications</p>
            </div>

            <div className="stat-card">
              <h3>12</h3>
              <p>Reports</p>
            </div>

          </div>

          {/* Change Password */}

          <div className="profile-card">

            <h3 style={{ color: "rgb(88,110,108)" }}>
              <FaLock /> Change Password
            </h3>

            <br />

            <div className="profile-grid">

              <div className="profile-field">

                <label>Current Password</label>

                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />

              </div>

              <div className="profile-field">

                <label>New Password</label>

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />

              </div>

              <div className="profile-field">

                <label>Confirm Password</label>

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <button
              className="update-btn"
              onClick={handlePassword}
            >
              Update Password
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}