import React, { useState, useEffect } from "react";
import API from "../api/Api";
import {
  User,
  ShieldCheck,
  Mail,
  Lock,
  Save,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleName: "",
    hasPassword: true,
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/users/profile");
      setProfile(response.data);
      setFullName(response.data.fullName || "");
      setPhone(response.data.phone || "");
    } catch (err) {
      setProfileError("Failed to load profile details.");
    }
  };

  const getErrorMessage = (err, fallbackMsg) => {
    if (!err?.response) return fallbackMsg;
    const data = err.response.data;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0].defaultMessage || data.errors[0];
    }
    return fallbackMsg;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    setLoadingProfile(true);

    try {
      const response = await API.put("/users/profile", {
        fullName: fullName.trim(),
        phone: phone ? phone.trim() : "",
      });
      setProfile(response.data);
      setFullName(response.data.fullName || "");
      setPhone(response.data.phone || "");
      setProfileMsg("Profile updated successfully!");
      setTimeout(() => setProfileMsg(""), 4000);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Failed to update profile."));
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg("");
    setPassError("");

    if (newPassword !== confirmPassword) {
      setPassError("New password and Confirm password do not match.");
      return;
    }

    setLoadingPass(true);

    try {
      const response = await API.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
      setPassMsg(response.data || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPassMsg(""), 4000);
    } catch (err) {
      setPassError(getErrorMessage(err, "Failed to change password."));
    } finally {
      setLoadingPass(false);
    }
  };

  const hasLocalPassword = profile.hasPassword !== false;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-slate-50/50 min-h-screen">
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xl shadow-inner">
            {fullName ? fullName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {fullName || "User Profile"}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
              <span className="flex items-center gap-1.5">
                <Mail size={14} /> {profile.email}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                <ShieldCheck size={12} /> {profile.roleName || "Role"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-6 ${
          hasLocalPassword
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1 max-w-xl mx-auto"
        }`}
      >
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="text-blue-600" size={20} />
            <h2 className="text-base font-semibold text-slate-800">
              Personal Information
            </h2>
          </div>

          {profileMsg && (
            <div className="p-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
              {profileMsg}
            </div>
          )}
          {profileError && (
            <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Account Role
              </label>
              <input
                type="text"
                disabled
                value={profile.roleName || ""}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email || ""}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="10-digit mobile number"
              />
            </div>

            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {loadingProfile ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        {hasLocalPassword && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lock className="text-slate-700" size={20} />
              <h2 className="text-base font-semibold text-slate-800">
                Security & Password
              </h2>
            </div>

            {passMsg && (
              <div className="p-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                {passMsg}
              </div>
            )}
            {passError && (
              <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {passError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingPass}
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 active:bg-black disabled:bg-slate-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound size={16} />
                {loadingPass ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
