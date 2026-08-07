import React, { useState, useEffect, useMemo } from "react";
import API from "../../api/Api";
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Shield,
  Trash2,
  Edit2,
  Mail,
  Phone,
  CheckCircle2,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
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

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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
      setError("Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  const getUserRoleId = (user) => {
    if (user.role && typeof user.role === "object") {
      return user.role.roleId;
    }
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

    users.forEach((u) => {
      const r = String(getUserRoleName(u)).toUpperCase();
      if (r === "ADMIN") admins++;
      else if (r === "PHARMACIST") pharmacists++;
      else staff++;
    });

    return { total, admins, pharmacists, staff };
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
    setError("");
    setMsg("");

    const selectedRoleObj = ROLES.find((r) => r.id === Number(newUser.roleId));

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
      setMsg("New user created successfully!");
      handleCloseAddModal();
      fetchUsers();
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      console.error("Add user error:", err);
      setError(
        err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response?.data : "") ||
          "Failed to create user.",
      );
    }
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setError("");
    setMsg("");

    try {
      const userId = selectedUser.userId || selectedUser.id;
      const selectedRoleObj = ROLES.find((r) => r.id === Number(updatedRoleId));

      const payload = {
        ...selectedUser,
        role: {
          roleId: Number(updatedRoleId),
        },
      };

      await API.put(`/users/${userId}`, payload);
      setMsg(`Role updated to ${selectedRoleObj?.name} successfully!`);
      handleCloseEditModal();
      fetchUsers();
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      console.error("Update role error:", err);
      setError(
        err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response?.data : "") ||
          "Failed to update role.",
      );
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await API.delete(`/users/${userId}`);
        setMsg("User deleted successfully!");
        fetchUsers();
        setTimeout(() => setMsg(""), 4000);
      } catch (err) {
        console.error("Delete user error:", err);
        setError(
          err.response?.data?.message ||
            (typeof err.response?.data === "string"
              ? err.response?.data
              : "") ||
            "Failed to delete user.",
        );
      }
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
      userRole.toUpperCase() === roleFilter.toUpperCase();

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <UsersIcon className="w-6 h-6" />
            </div>
            User Management
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            Manage system users, assign roles, and control access permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 h-fit rounded-xl text-sm shadow-xs transition-all cursor-pointer active:scale-98"
        >
          <UserPlus className="w-4 h-4" /> Add New User
        </button>
      </div>

      {msg && (
        <div className="p-4 text-xs font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200/90 rounded-xl flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}
      {error && (
        <div className="p-4 text-xs font-semibold text-rose-800 bg-rose-50/90 border border-rose-200/90 rounded-xl flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
          <AlertTriangle size={16} className="text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => setRoleFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              roleFilter === "ALL"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
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
                ? "bg-purple-600 text-white shadow-2xs font-bold"
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
                ? "bg-blue-600 text-white shadow-2xs font-bold"
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
                ? "bg-slate-700 text-white shadow-2xs font-bold"
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-2xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const currentRole = getUserRoleName(user);
                  const userId = user.userId || user.id;
                  return (
                    <tr
                      key={userId}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                            {user.fullName
                              ? user.fullName.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">
                              {user.fullName}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail size={12} className="text-slate-400" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Phone size={13} className="text-slate-400" />
                          <span>{user.phone || "—"}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
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

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-2 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                            title="Edit User Role"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(userId, user.fullName)
                            }
                            className="p-2 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-xl hover:border-rose-200 hover:bg-rose-50/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-12 text-slate-400 font-medium text-xs"
                  >
                    No users match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SHOW ADD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={handleCloseAddModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
              <UserPlus className="text-blue-600 w-5 h-5" /> Create New User
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Enter user credentials and assign system role
            </p>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                    required
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl p-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
                >
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
              <Shield className="text-blue-600 w-5 h-5" /> Change User Role
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
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
                >
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
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
