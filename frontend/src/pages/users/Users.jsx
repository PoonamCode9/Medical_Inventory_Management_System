import React, { useState, useEffect, useMemo } from "react";
import API from "../../api/Api";
import toast from "react-hot-toast";
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Shield,
  Trash2,
  Edit2,
  Mail,
  Phone,
  X,
  Eye,
  EyeOff,
  CheckCircle, 
  Clock
} from "lucide-react";

// Role Mappings
const ROLES = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Pharmacist" },
  { id: 3, name: "Staff" },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const getEmailFromToken = () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return null;

      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const parsed = JSON.parse(jsonPayload);
      return parsed.sub || parsed.email || parsed.username || null;
    } catch (e) {
      console.error("Error decoding token", e);
      return null;
    }
  };

  const currentUserEmail = getEmailFromToken();

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    roleId: 3,
  });

  const [updatedRoleId, setUpdatedRoleId] = useState(3);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch All Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get("/users");
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  const getUserRoleId = (user) => {
    if (user.role && typeof user.role === "object") {
      return user.role.roleId;
    }
    return user.roleId || user.role;
  };

  const getUserRoleName = (user) => {
    if (user.role && typeof user.role === "object") {
      return user.role.roleName;
    }
    const roleId = getUserRoleId(user);
    const foundRole = ROLES.find((r) => r.id === Number(roleId));
    return foundRole ? foundRole.name : user.roleName || "Staff";
  };

  const roleCounts = useMemo(() => {
    const total = users.length;
    let admins = 0;
    let pharmacists = 0;
    let staff = 0;
    let pending = 0;

    users.forEach((u) => {
      if (u.enabled === false) pending++;
      const r = String(getUserRoleName(u)).toUpperCase();
      if (r === "ADMIN") admins++;
      else if (r === "PHARMACIST") pharmacists++;
      else staff++;
    });

    return { total, admins, pharmacists, staff, pending };
  }, [users]);

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setUpdatedRoleId(getUserRoleId(user));
    setShowEditModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setShowPassword(false);
    setNewUser({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      roleId: 3,
    });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setUpdatedRoleId(3);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUser.fullName.trim()) {
      toast.error("Please enter full name!");
      return;
    }

    if (!newUser.email.trim()) {
      toast.error("Please enter email address!");
      return;
    }

    if (!newUser.password) {
      toast.error("Please enter a password!");
      return;
    }

    try {
      const payload = {
        fullName: newUser.fullName.trim(),
        email: newUser.email.trim(),
        phone: newUser.phone.trim(),
        password: newUser.password,
        role: {
          roleId: Number(newUser.roleId),
        },
      };

      await API.post("/users", payload);
      toast.success("New user created successfully!");
      handleCloseAddModal();
      fetchUsers();
    } catch (err) {
      console.error("Add user error:", err);
      toast.error(
        err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response?.data : "") ||
          "Failed to create user."
      );
    }
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const userId = selectedUser.userId || selectedUser.id;
      const selectedRoleObj = ROLES.find((r) => r.id === Number(updatedRoleId));

      const payload = {
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        phone: selectedUser.phone,
        password: "",
        role: {
          roleId: Number(updatedRoleId),
        },
      };

      await API.put(`/users/${userId}`, payload);
      toast.success(`Role updated to ${selectedRoleObj?.name} successfully!`);
      handleCloseEditModal();
      fetchUsers();
    } catch (err) {
      console.error("Update role error:", err);
      toast.error(
        err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response?.data : "") ||
          "Failed to update role."
      );
    }
  };

  const handleDeleteUser = (userId, name) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-800">
            Are you sure you want to delete user "{name}"?
          </p>
          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                confirmDeleteUser(userId);
              }}
              className="px-3 py-1 text-xs bg-rose-600 text-white rounded-md hover:bg-rose-700 font-medium transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" }
    );
  };

  const confirmDeleteUser = async (userId) => {
    try {
      await API.delete(`/users/${userId}`);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      toast.error(
        err.response?.data?.message ||
          (typeof err.response?.data === "string"
            ? err.response?.data
            : "") ||
          "Failed to delete user."
      );
    }
  };

  // Approve User Handler
  const handleApproveUser = async (userId, roleName = "Staff") => {
    try {
      await API.put(`/users/${userId}/approve?role=${roleName}`);
      toast.success("User approved successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Approve user error:", err);
      toast.error(
        err.response?.data?.message ||
          (typeof err.response?.data === "string"
            ? err.response?.data
            : "") ||
          "Failed to approve user."
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      u.fullName?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.includes(query);

    const userRole = getUserRoleName(u);
    const matchesRole =
      roleFilter === "ALL" ||
      (roleFilter === "PENDING" ? u.enabled === false : userRole.toUpperCase() === roleFilter.toUpperCase());

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Loading users list...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-10 min-h-screen bg-slate-50/60">
      <div className="mx-6 mt-6 mb-6 bg-gradient-to-r from-white via-white to-blue-50/40 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-500/20 ring-4 ring-blue-50">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                User Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage system users, assign roles, and control access permissions
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition cursor-pointer shadow-sm shadow-blue-600/20 active:scale-98"
        >
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl text-xs font-medium text-slate-600 overflow-x-auto border border-slate-200/50">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                roleFilter === "ALL"
                  ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60"
                  : "hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              All Roles
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  roleFilter === "ALL"
                    ? "bg-slate-100 text-slate-800"
                    : "bg-slate-200/80 text-slate-600"
                }`}
              >
                {roleCounts.total}
              </span>
            </button>

            <button
              onClick={() => setRoleFilter("ADMIN")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                roleFilter === "ADMIN"
                  ? "bg-purple-600 text-white font-semibold shadow-xs"
                  : "hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              Admin
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  roleFilter === "ADMIN"
                    ? "bg-purple-700 text-white"
                    : "bg-purple-100 text-purple-700 font-semibold"
                }`}
              >
                {roleCounts.admins}
              </span>
            </button>

            <button
              onClick={() => setRoleFilter("PHARMACIST")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                roleFilter === "PHARMACIST"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Pharmacist
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  roleFilter === "PHARMACIST"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100 text-blue-700 font-semibold"
                }`}
              >
                {roleCounts.pharmacists}
              </span>
            </button>

            <button
              onClick={() => setRoleFilter("STAFF")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                roleFilter === "STAFF"
                  ? "bg-slate-700 text-white font-semibold shadow-xs"
                  : "hover:text-slate-800 hover:bg-slate-200/60"
              }`}
            >
              Staff
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  roleFilter === "STAFF"
                    ? "bg-slate-800 text-white"
                    : "bg-slate-200 text-slate-700 font-semibold"
                }`}
              >
                {roleCounts.staff}
              </span>
            </button>

            {/* Pending Filter Button */}
            <button
              onClick={() => setRoleFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                roleFilter === "PENDING"
                  ? "bg-amber-600 text-white font-semibold shadow-xs"
                  : "hover:text-amber-700 hover:bg-amber-50"
              }`}
            >
              Pending
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  roleFilter === "PENDING"
                    ? "bg-amber-700 text-white"
                    : "bg-amber-100 text-amber-700 font-semibold"
                }`}
              >
                {roleCounts.pending}
              </span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-700 uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-5">Contact</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const currentRole = getUserRoleName(user);
                    const userId = user.userId || user.id;
                    return (
                      <tr
                        key={userId}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                              {user.fullName
                                ? user.fullName.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {user.fullName}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Mail size={12} className="text-slate-400" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-5 text-slate-600">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Phone size={13} className="text-slate-400" />
                            <span>{user.phone || "—"}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                              currentRole === "Admin"
                                ? "bg-purple-50 text-purple-700 border-purple-200/80"
                                : currentRole === "Pharmacist"
                                ? "bg-blue-50 text-blue-700 border-blue-200/80"
                                : "bg-slate-100 text-slate-700 border-slate-200/80"
                            }`}
                          >
                            <Shield size={12} className="opacity-80" />
                            {currentRole}
                          </span>
                        </td>

                        <td className="py-3.5 px-5">
                          {user.enabled !== false ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                              <CheckCircle size={12} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                              <Clock size={12} /> Pending Approval
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-5 text-center">
                          {user.email === currentUserEmail ? (
                            <span className="text-[11px] text-slate-400 italic font-medium px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200/60">
                              Logged-in (You)
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              {user.enabled === false && (
                                <button
                                  onClick={() => handleApproveUser(userId, currentRole)}
                                  className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                                  title="Approve User"
                                >
                                  <CheckCircle size={13} /> Approve
                                </button>
                              )}

                              <button
                                onClick={() => handleOpenEditModal(user)}
                                className="p-1.5 text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/70 rounded-lg transition-colors cursor-pointer"
                                title="Edit User Role"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteUser(userId, user.fullName)
                                }
                                className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/70 rounded-lg transition-colors cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 text-slate-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-slate-100 rounded-full">
                          <UsersIcon className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          No users match your criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ADD USER MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={handleCloseAddModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <UserPlus className="w-4 h-4" />
              </div>
              Create New User
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter user credentials and assign system role
            </p>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="10-digit phone number"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Role
                </label>
                <select
                  value={newUser.roleId}
                  onChange={(e) =>
                    setNewUser({ ...newUser, roleId: Number(e.target.value) })
                  }
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
                >
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT ROLE MODAL --- */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Shield className="w-4 h-4" />
              </div>
              Change User Role
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Updating permissions for:{" "}
              <span className="font-bold text-slate-700">
                {selectedUser.fullName}
              </span>
            </p>

            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Role
                </label>
                <select
                  value={updatedRoleId}
                  onChange={(e) => setUpdatedRoleId(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
                >
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;