import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    FaSearch,
    FaTrash,
    FaUsers,
    FaPhone,
    FaEnvelope,
    FaUserShield,
    FaEdit,
    FaTimes,
    FaUserPlus,
    FaUserTie,
    FaUserNurse,
    FaShieldAlt,
    FaCheckCircle,
    FaSyncAlt,
    FaFilter,
    FaLock,
    FaIdCard,
    FaChevronDown,
    FaEye,
    FaEyeSlash,
    FaUserCog,
    FaPlus,
    FaKey,
    FaCircle
} from "react-icons/fa";


// =========================================================
// API
// =========================================================

const API = "http://localhost:8080/api/users";


// =========================================================
// INITIAL FORM
// =========================================================

const INITIAL_FORM = {
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "STAFF"
};


// =========================================================
// MAIN COMPONENT
// =========================================================

function ManageUsers() {

    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] = useState("ALL");

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(null);

    const [showDrawer, setShowDrawer] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const [form, setForm] = useState(INITIAL_FORM);

    const [showPassword, setShowPassword] = useState(false);


    // =====================================================
    // TOKEN
    // =====================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };


    // =====================================================
    // AUTH CONFIG
    // =====================================================

    const authConfig = () => {

        const token = getToken();

        return token
            ? {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            : {};
    };


    // =====================================================
    // ROLE
    // =====================================================

    const getRole = (user) => {

        return (
            user?.role?.roleName ||
            user?.role ||
            "STAFF"
        );
    };


    // =====================================================
    // FETCH USERS
    // =====================================================

    const fetchUsers = async () => {

        try {

            setLoading(true);

            const token = getToken();

            if (!token) {

                alert("Session expired. Please login again.");

                return;
            }


            const response = await axios.get(
                API,
                authConfig()
            );


            const data = Array.isArray(response.data)
                ? response.data
                : [];


            const sortedUsers = [...data].sort(
                (a, b) =>
                    Number(a.id) - Number(b.id)
            );


            setUsers(sortedUsers);

        }
        catch (error) {

            console.error(
                "Fetch users error:",
                error
            );


            if (error.response?.status === 401) {

                alert(
                    "Unauthorized. Please login again."
                );

            }
            else if (error.response?.status === 403) {

                alert(
                    "Access denied. Login with an ADMIN account."
                );

            }
            else {

                alert(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to load users."
                );
            }

        }
        finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchUsers();

    }, []);


    // =====================================================
    // HANDLE FORM
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // =====================================================
    // OPEN ADD DRAWER
    // =====================================================

    const openAddDrawer = () => {

        setEditMode(false);

        setSelectedUser(null);

        setShowPassword(false);

        setForm({
            ...INITIAL_FORM
        });

        setShowDrawer(true);
    };


    // =====================================================
    // OPEN EDIT DRAWER
    // =====================================================

    const openEditDrawer = (user) => {

        setEditMode(true);

        setSelectedUser(user);

        setShowPassword(false);

        setForm({

            fullName:
                user?.fullName || "",

            username:
                user?.username || "",

            email:
                user?.email || "",

            phone:
                user?.phone || "",

            password: "",

            role:
                getRole(user)

        });

        setShowDrawer(true);
    };


    // =====================================================
    // CLOSE DRAWER
    // =====================================================

    const closeDrawer = () => {

        if (saving) {
            return;
        }


        setShowDrawer(false);

        setEditMode(false);

        setSelectedUser(null);

        setShowPassword(false);

        setForm({
            ...INITIAL_FORM
        });
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = (isEdit = false) => {

        if (!form.fullName.trim()) {

            alert("Full name is required.");

            return false;
        }


        if (!form.username.trim()) {

            alert("Username is required.");

            return false;
        }


        if (!form.email.trim()) {

            alert("Email is required.");

            return false;
        }


        if (!/^\d{10}$/.test(form.phone)) {

            alert(
                "Enter a valid 10 digit phone number."
            );

            return false;
        }


        if (!isEdit && form.password.length < 6) {

            alert(
                "Password must contain at least 6 characters."
            );

            return false;
        }


        if (
            isEdit &&
            form.password &&
            form.password.length < 6
        ) {

            alert(
                "New password must contain at least 6 characters."
            );

            return false;
        }


        return true;
    };


    // =====================================================
    // ADD USER
    // =====================================================

    const addUser = async (e) => {

        e.preventDefault();


        if (!validateForm(false)) {
            return;
        }


        try {

            setSaving(true);


            await axios.post(
                API,
                {
                    fullName:
                        form.fullName.trim(),

                    username:
                        form.username.trim(),

                    email:
                        form.email.trim(),

                    phone:
                        form.phone.trim(),

                    password:
                        form.password,

                    role:
                        form.role
                },
                authConfig()
            );


            alert(
                "User created successfully."
            );


            closeDrawer();

            await fetchUsers();

        }
        catch (error) {

            console.error(
                "Create user error:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to create user."
            );

        }
        finally {

            setSaving(false);

        }
    };


    // =====================================================
    // UPDATE USER
    // =====================================================

    const updateUser = async (e) => {

        e.preventDefault();


        if (!selectedUser) {
            return;
        }


        if (!validateForm(true)) {
            return;
        }


        try {

            setSaving(true);


            const updateData = {

                fullName:
                    form.fullName.trim(),

                username:
                    form.username.trim(),

                email:
                    form.email.trim(),

                phone:
                    form.phone.trim(),

                role:
                    form.role

            };


            if (
                form.password &&
                form.password.trim()
            ) {

                updateData.password =
                    form.password.trim();
            }


            await axios.put(
                `${API}/${selectedUser.id}`,
                updateData,
                authConfig()
            );


            alert(
                "User updated successfully."
            );


            closeDrawer();

            await fetchUsers();

        }
        catch (error) {

            console.error(
                "Update user error:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to update user."
            );

        }
        finally {

            setSaving(false);

        }
    };


    // =====================================================
    // DELETE USER
    // =====================================================

    const deleteUser = async (user) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${user.fullName || "this user"}?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeleteLoading(user.id);


            await axios.delete(
                `${API}/${user.id}`,
                authConfig()
            );


            alert(
                "User deleted successfully."
            );


            await fetchUsers();

        }
        catch (error) {

            console.error(
                "Delete user error:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to delete user."
            );

        }
        finally {

            setDeleteLoading(null);

        }
    };


    // =====================================================
    // FILTER
    // =====================================================

    const filteredUsers = useMemo(() => {

        const searchValue =
            search.toLowerCase().trim();


        return users.filter((user) => {

            const role =
                getRole(user);


            const matchesSearch =

                !searchValue ||

                user.fullName
                    ?.toLowerCase()
                    .includes(searchValue) ||

                user.username
                    ?.toLowerCase()
                    .includes(searchValue) ||

                user.email
                    ?.toLowerCase()
                    .includes(searchValue) ||

                user.phone
                    ?.toLowerCase()
                    .includes(searchValue);


            const matchesRole =
                roleFilter === "ALL" ||
                role === roleFilter;


            return (
                matchesSearch &&
                matchesRole
            );
        });

    }, [
        users,
        search,
        roleFilter
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalUsers =
        users.length;


    const adminCount =
        users.filter(
            user =>
                getRole(user) === "ADMIN"
        ).length;


    const pharmacistCount =
        users.filter(
            user =>
                getRole(user) === "PHARMACIST"
        ).length;


    const staffCount =
        users.filter(
            user =>
                getRole(user) === "STAFF"
        ).length;


    // =====================================================
    // ROLE CONFIG
    // =====================================================

    const getRoleConfig = (role) => {

        switch (role) {

            case "ADMIN":

                return {
                    label: "Administrator",
                    icon: <FaUserShield />,
                    badge:
                        "bg-red-50 text-red-600 border-red-100",
                    avatar:
                        "bg-red-100 text-red-600"
                };


            case "PHARMACIST":

                return {
                    label: "Pharmacist",
                    icon: <FaUserNurse />,
                    badge:
                        "bg-emerald-50 text-emerald-600 border-emerald-100",
                    avatar:
                        "bg-emerald-100 text-emerald-600"
                };


            default:

                return {
                    label: "Staff",
                    icon: <FaUserTie />,
                    badge:
                        "bg-blue-50 text-blue-600 border-blue-100",
                    avatar:
                        "bg-blue-100 text-blue-600"
                };
        }
    };


    // =====================================================
    // AVATAR
    // =====================================================

    const getInitials = (name) => {

        if (!name) {
            return "U";
        }


        const parts =
            name.trim().split(" ");


        if (parts.length === 1) {

            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }


        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="w-full min-w-0 bg-slate-100">

            <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-5
                    mb-7
                ">

                    <div>

                        <div className="
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            bg-blue-50
                            border
                            border-blue-100
                            text-blue-600
                            text-[11px]
                            font-extrabold
                            uppercase
                            tracking-wider
                            mb-3
                        ">

                            <FaShieldAlt />

                            Admin Control Center

                        </div>


                        <h1 className="
                            text-2xl
                            sm:text-3xl
                            lg:text-4xl
                            font-extrabold
                            text-slate-800
                        ">

                            User Management

                        </h1>


                        <p className="
                            mt-2
                            text-sm
                            sm:text-base
                            text-slate-500
                            max-w-2xl
                        ">

                            Manage system accounts,
                            healthcare staff,
                            pharmacists and administrators.

                        </p>

                    </div>


                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                    ">

                        <button
                            onClick={fetchUsers}
                            disabled={loading}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-3
                                rounded-xl
                                bg-white
                                border
                                border-slate-200
                                text-slate-600
                                font-bold
                                text-sm
                                shadow-sm
                                hover:bg-slate-50
                                transition
                                disabled:opacity-50
                            "
                        >

                            <FaSyncAlt
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>


                        <button
                            onClick={openAddDrawer}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-5
                                py-3
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-bold
                                text-sm
                                shadow-lg
                                shadow-blue-100
                                transition
                            "
                        >

                            <FaPlus />

                            Add User

                        </button>

                    </div>

                </div>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="
                    grid
                    grid-cols-2
                    xl:grid-cols-4
                    gap-3
                    sm:gap-4
                    mb-6
                ">

                    <StatCard
                        icon={<FaUsers />}
                        title="Total Users"
                        value={totalUsers}
                        description="All accounts"
                        iconClass="bg-blue-50 text-blue-600"
                    />


                    <StatCard
                        icon={<FaUserShield />}
                        title="Administrators"
                        value={adminCount}
                        description="Full access"
                        iconClass="bg-red-50 text-red-600"
                    />


                    <StatCard
                        icon={<FaUserNurse />}
                        title="Pharmacists"
                        value={pharmacistCount}
                        description="Pharmacy access"
                        iconClass="bg-emerald-50 text-emerald-600"
                    />


                    <StatCard
                        icon={<FaUserTie />}
                        title="Staff"
                        value={staffCount}
                        description="View-only access"
                        iconClass="bg-violet-50 text-violet-600"
                    />

                </div>


                {/* =================================================
                    SEARCH TOOLBAR
                ================================================= */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-4
                    shadow-sm
                    mb-6
                ">

                    <div className="
                        flex
                        flex-col
                        lg:flex-row
                        gap-3
                    ">

                        {/* SEARCH */}

                        <div className="
                            flex
                            items-center
                            gap-3
                            flex-1
                            px-4
                            bg-slate-50
                            border
                            border-slate-200
                            rounded-xl
                            focus-within:border-blue-400
                            focus-within:ring-4
                            focus-within:ring-blue-50
                        ">

                            <FaSearch className="
                                text-slate-400
                                shrink-0
                            " />


                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search users by name, username, email or phone..."
                                className="
                                    w-full
                                    py-3.5
                                    bg-transparent
                                    outline-none
                                    text-sm
                                    text-slate-700
                                    placeholder:text-slate-400
                                "
                            />


                            {search && (

                                <button
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="
                                        text-slate-400
                                        hover:text-red-500
                                    "
                                >

                                    <FaTimes />

                                </button>

                            )}

                        </div>


                        {/* ROLE FILTER */}

                        <div className="
                            relative
                            w-full
                            lg:w-56
                        ">

                            <FaFilter className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                pointer-events-none
                            " />


                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(
                                        e.target.value
                                    )
                                }
                                className="
                                    appearance-none
                                    w-full
                                    pl-11
                                    pr-10
                                    py-3.5
                                    bg-slate-50
                                    border
                                    border-slate-200
                                    rounded-xl
                                    outline-none
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    cursor-pointer
                                    focus:border-blue-400
                                "
                            >

                                <option value="ALL">
                                    All Roles
                                </option>

                                <option value="ADMIN">
                                    Administrators
                                </option>

                                <option value="PHARMACIST">
                                    Pharmacists
                                </option>

                                <option value="STAFF">
                                    Staff
                                </option>

                            </select>


                            <FaChevronDown className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                text-xs
                                pointer-events-none
                            " />

                        </div>

                    </div>


                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        mt-3
                    ">

                        <p className="
                            text-xs
                            text-slate-400
                        ">

                            Showing{" "}

                            <span className="
                                font-bold
                                text-slate-700
                            ">
                                {filteredUsers.length}
                            </span>

                            {" "}of{" "}

                            <span className="
                                font-bold
                                text-slate-700
                            ">
                                {totalUsers}
                            </span>

                            {" "}users

                        </p>


                        {(search || roleFilter !== "ALL") && (

                            <button
                                onClick={() => {

                                    setSearch("");

                                    setRoleFilter("ALL");

                                }}
                                className="
                                    text-xs
                                    font-bold
                                    text-blue-600
                                    hover:text-blue-800
                                "
                            >

                                Clear filters

                            </button>

                        )}

                    </div>

                </div>


                {/* =================================================
                    USER LIST
                ================================================= */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    shadow-sm
                    overflow-hidden
                ">

                    {/* LIST HEADER */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                        px-5
                        sm:px-6
                        py-5
                        border-b
                        border-slate-100
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                w-10
                                h-10
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                            ">

                                <FaUserCog />

                            </div>


                            <div>

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                ">

                                    System Users

                                </h2>


                                <p className="
                                    text-xs
                                    text-slate-400
                                ">

                                    Manage accounts and permissions

                                </p>

                            </div>

                        </div>


                        <div className="
                            inline-flex
                            items-center
                            gap-2
                            w-fit
                            px-3
                            py-2
                            rounded-lg
                            bg-emerald-50
                            border
                            border-emerald-100
                            text-emerald-600
                            text-xs
                            font-bold
                        ">

                            <FaCircle className="text-[7px]" />

                            System Active

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading ? (

                        <LoadingState />

                    ) : filteredUsers.length === 0 ? (

                        <EmptyState />

                    ) : (

                        <div className="
                            divide-y
                            divide-slate-100
                        ">

                            {/* DESKTOP HEADER */}

                            <div className="
                                hidden
                                lg:grid
                                lg:grid-cols-[2fr_2fr_1fr_1fr]
                                gap-4
                                px-6
                                py-3
                                bg-slate-50
                                text-[10px]
                                font-extrabold
                                uppercase
                                tracking-wider
                                text-slate-400
                            ">

                                <span>User</span>

                                <span>Contact</span>

                                <span>Role</span>

                                <span className="text-right">
                                    Actions
                                </span>

                            </div>


                            {filteredUsers.map((user) => {

                                const role =
                                    getRole(user);

                                const roleConfig =
                                    getRoleConfig(role);


                                return (

                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        role={role}
                                        roleConfig={roleConfig}
                                        initials={
                                            getInitials(
                                                user.fullName
                                            )
                                        }
                                        deleteLoading={
                                            deleteLoading
                                        }
                                        onEdit={
                                            openEditDrawer
                                        }
                                        onDelete={
                                            deleteUser
                                        }
                                    />

                                );

                            })}

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-2
                    mt-5
                    px-1
                ">

                    <p className="
                        text-xs
                        text-slate-400
                    ">

                        MediStock User Management

                    </p>


                    <div className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-slate-400
                    ">

                        <FaLock />

                        Role-based access protected

                    </div>

                </div>

            </div>


            {/* =====================================================
                DRAWER
            ===================================================== */}

            {showDrawer && (

                <div className="
                    fixed
                    inset-0
                    z-[100]
                    bg-slate-950/50
                    backdrop-blur-sm
                ">

                    {/* BACKDROP */}

                    <button
                        onClick={closeDrawer}
                        disabled={saving}
                        className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            cursor-default
                        "
                        aria-label="Close drawer"
                    />


                    {/* DRAWER */}

                    <div className="
                        absolute
                        top-0
                        right-0
                        h-full
                        w-full
                        sm:w-[480px]
                        bg-white
                        shadow-2xl
                        flex
                        flex-col
                        animate-[slideIn_0.25s_ease-out]
                    ">

                        {/* DRAWER HEADER */}

                        <div className="
                            px-5
                            sm:px-6
                            py-5
                            border-b
                            border-slate-200
                            flex
                            items-center
                            justify-between
                            gap-4
                            shrink-0
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-600
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    {editMode
                                        ? <FaEdit />
                                        : <FaUserPlus />
                                    }

                                </div>


                                <div>

                                    <h2 className="
                                        text-lg
                                        sm:text-xl
                                        font-extrabold
                                        text-slate-800
                                    ">

                                        {editMode
                                            ? "Edit User"
                                            : "Create New User"
                                        }

                                    </h2>


                                    <p className="
                                        text-xs
                                        text-slate-400
                                        mt-0.5
                                    ">

                                        {editMode
                                            ? `Editing account #${selectedUser?.id}`
                                            : "Add a new system account"
                                        }

                                    </p>

                                </div>

                            </div>


                            <button
                                onClick={closeDrawer}
                                disabled={saving}
                                className="
                                    w-10
                                    h-10
                                    rounded-xl
                                    bg-slate-100
                                    text-slate-500
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-red-50
                                    hover:text-red-500
                                    transition
                                    disabled:opacity-50
                                "
                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* DRAWER BODY */}

                        <form
                            onSubmit={
                                editMode
                                    ? updateUser
                                    : addUser
                            }
                            className="
                                flex
                                flex-col
                                flex-1
                                min-h-0
                            "
                        >

                            <div className="
                                flex-1
                                overflow-y-auto
                                p-5
                                sm:p-6
                            ">

                                {/* ACCOUNT */}

                                <DrawerSection
                                    icon={<FaIdCard />}
                                    title="Account Information"
                                    description="Basic details of the user."
                                />


                                <div className="
                                    space-y-4
                                ">

                                    <DrawerInput
                                        label="Full Name"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        icon={<FaUsers />}
                                        required
                                    />


                                    <DrawerInput
                                        label="Username"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                        icon={<FaIdCard />}
                                        required
                                    />


                                    <DrawerInput
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="user@example.com"
                                        icon={<FaEnvelope />}
                                        required
                                    />


                                    <DrawerInput
                                        label="Phone Number"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="10 digit phone number"
                                        icon={<FaPhone />}
                                        maxLength={10}
                                        required
                                    />

                                </div>


                                {/* SECURITY */}

                                <div className="mt-8">

                                    <DrawerSection
                                        icon={<FaKey />}
                                        title="Security & Access"
                                        description="Password and account permissions."
                                    />

                                </div>


                                <div className="
                                    space-y-4
                                ">

                                    {/* PASSWORD */}

                                    <div>

                                        <label className="
                                            block
                                            text-xs
                                            font-bold
                                            text-slate-600
                                            mb-2
                                        ">

                                            {editMode
                                                ? "New Password"
                                                : "Password"
                                            }

                                            {!editMode && (
                                                <span className="
                                                    text-red-500
                                                    ml-1
                                                ">
                                                    *
                                                </span>
                                            )}

                                        </label>


                                        <div className="
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            focus-within:border-blue-400
                                            focus-within:ring-4
                                            focus-within:ring-blue-50
                                        ">

                                            <FaLock className="
                                                text-blue-500
                                                shrink-0
                                            " />


                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder={
                                                    editMode
                                                        ? "Leave blank to keep current"
                                                        : "Minimum 6 characters"
                                                }
                                                required={!editMode}
                                                className="
                                                    flex-1
                                                    min-w-0
                                                    py-3.5
                                                    bg-transparent
                                                    outline-none
                                                    text-sm
                                                    text-slate-700
                                                "
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        previous =>
                                                            !previous
                                                    )
                                                }
                                                className="
                                                    text-slate-400
                                                    hover:text-blue-600
                                                "
                                            >

                                                {showPassword
                                                    ? <FaEyeSlash />
                                                    : <FaEye />
                                                }

                                            </button>

                                        </div>


                                        <p className="
                                            text-[10px]
                                            text-slate-400
                                            mt-1.5
                                        ">

                                            {editMode
                                                ? "Leave empty if you do not want to change the password."
                                                : "Password must contain at least 6 characters."
                                            }

                                        </p>

                                    </div>


                                    {/* ROLE */}

                                    <div>

                                        <label className="
                                            block
                                            text-xs
                                            font-bold
                                            text-slate-600
                                            mb-2
                                        ">

                                            Account Role

                                        </label>


                                        <div className="
                                            relative
                                        ">

                                            <FaUserShield className="
                                                absolute
                                                left-4
                                                top-1/2
                                                -translate-y-1/2
                                                text-blue-500
                                                pointer-events-none
                                            " />


                                            <select
                                                name="role"
                                                value={form.role}
                                                onChange={handleChange}
                                                className="
                                                    appearance-none
                                                    w-full
                                                    pl-11
                                                    pr-10
                                                    py-3.5
                                                    rounded-xl
                                                    border
                                                    border-slate-200
                                                    bg-slate-50
                                                    outline-none
                                                    text-sm
                                                    font-semibold
                                                    text-slate-700
                                                    focus:border-blue-400
                                                    focus:ring-4
                                                    focus:ring-blue-50
                                                "
                                            >

                                                <option value="STAFF">
                                                    Staff
                                                </option>

                                                <option value="PHARMACIST">
                                                    Pharmacist
                                                </option>

                                                <option value="ADMIN">
                                                    Administrator
                                                </option>

                                            </select>


                                            <FaChevronDown className="
                                                absolute
                                                right-4
                                                top-1/2
                                                -translate-y-1/2
                                                text-slate-400
                                                pointer-events-none
                                                text-xs
                                            " />

                                        </div>

                                    </div>

                                </div>


                                {/* ROLE CARDS */}

                                <div className="
                                    mt-6
                                    space-y-2
                                ">

                                    <RolePermission
                                        role="ADMIN"
                                        icon={<FaUserShield />}
                                        text="Full system access"
                                        active={
                                            form.role === "ADMIN"
                                        }
                                        className="
                                            border-red-100
                                            bg-red-50
                                            text-red-600
                                        "
                                    />


                                    <RolePermission
                                        role="PHARMACIST"
                                        icon={<FaUserNurse />}
                                        text="Medicine and pharmacy operations"
                                        active={
                                            form.role === "PHARMACIST"
                                        }
                                        className="
                                            border-emerald-100
                                            bg-emerald-50
                                            text-emerald-600
                                        "
                                    />


                                    <RolePermission
                                        role="STAFF"
                                        icon={<FaUserTie />}
                                        text="View-only system access"
                                        active={
                                            form.role === "STAFF"
                                        }
                                        className="
                                            border-blue-100
                                            bg-blue-50
                                            text-blue-600
                                        "
                                    />

                                </div>

                            </div>


                            {/* DRAWER FOOTER */}

                            <div className="
                                shrink-0
                                p-4
                                sm:p-5
                                border-t
                                border-slate-200
                                bg-white
                                flex
                                gap-3
                            ">

                                <button
                                    type="button"
                                    onClick={closeDrawer}
                                    disabled={saving}
                                    className="
                                        flex-1
                                        px-5
                                        py-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        text-slate-600
                                        font-bold
                                        text-sm
                                        hover:bg-slate-50
                                        transition
                                        disabled:opacity-50
                                    "
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        flex-[1.5]
                                        px-5
                                        py-3
                                        rounded-xl
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                        font-bold
                                        text-sm
                                        shadow-lg
                                        shadow-blue-100
                                        transition
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        disabled:opacity-50
                                    "
                                >

                                    {saving ? (

                                        <>
                                            <span className="
                                                w-4
                                                h-4
                                                rounded-full
                                                border-2
                                                border-white/40
                                                border-t-white
                                                animate-spin
                                            " />

                                            Saving...

                                        </>

                                    ) : (

                                        <>
                                            {editMode
                                                ? <FaEdit />
                                                : <FaUserPlus />
                                            }

                                            {editMode
                                                ? "Update User"
                                                : "Create User"
                                            }

                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


// =========================================================
// USER ROW
// =========================================================

function UserRow({
    user,
    role,
    roleConfig,
    initials,
    deleteLoading,
    onEdit,
    onDelete
}) {

    return (

        <div className="
            px-4
            sm:px-6
            py-4
            hover:bg-slate-50
            transition
        ">

            <div className="
                grid
                grid-cols-1
                lg:grid-cols-[2fr_2fr_1fr_1fr]
                gap-4
                lg:items-center
            ">


                {/* USER */}

                <div className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                ">

                    <div className={`
                        w-11
                        h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        font-extrabold
                        text-sm
                        ${roleConfig.avatar}
                    `}>

                        {initials}

                    </div>


                    <div className="min-w-0">

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <p className="
                                font-bold
                                text-slate-800
                                truncate
                            ">

                                {user.fullName || "N/A"}

                            </p>

                        </div>


                        <p className="
                            text-xs
                            text-slate-400
                            mt-1
                            flex
                            items-center
                            gap-1.5
                            truncate
                        ">

                            <FaIdCard />

                            @{user.username || "N/A"}

                        </p>

                    </div>

                </div>


                {/* CONTACT */}

                <div className="
                    flex
                    flex-col
                    gap-2
                    text-xs
                    text-slate-500
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                        min-w-0
                    ">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-rose-50
                            text-rose-500
                            flex
                            items-center
                            justify-center
                            shrink-0
                        ">

                            <FaEnvelope />

                        </span>


                        <span className="
                            truncate
                            max-w-[260px]
                        ">

                            {user.email || "N/A"}

                        </span>

                    </div>


                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <span className="
                            w-7
                            h-7
                            rounded-lg
                            bg-emerald-50
                            text-emerald-600
                            flex
                            items-center
                            justify-center
                            shrink-0
                        ">

                            <FaPhone />

                        </span>


                        <span>

                            {user.phone || "N/A"}

                        </span>

                    </div>

                </div>


                {/* ROLE */}

                <div>

                    <span className={`
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-full
                        border
                        text-[11px]
                        font-extrabold
                        ${roleConfig.badge}
                    `}>

                        {roleConfig.icon}

                        {roleConfig.label}

                    </span>

                </div>


                {/* ACTIONS */}

                <div className="
                    flex
                    items-center
                    lg:justify-end
                    gap-2
                ">

                    <button
                        onClick={() =>
                            onEdit(user)
                        }
                        title="Edit user"
                        className="
                            w-9
                            h-9
                            rounded-lg
                            bg-blue-50
                            border
                            border-blue-100
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-600
                            hover:text-white
                            transition
                        "
                    >

                        <FaEdit />

                    </button>


                    <button
                        onClick={() =>
                            onDelete(user)
                        }
                        disabled={
                            deleteLoading === user.id
                        }
                        title="Delete user"
                        className="
                            w-9
                            h-9
                            rounded-lg
                            bg-red-50
                            border
                            border-red-100
                            text-red-600
                            flex
                            items-center
                            justify-center
                            hover:bg-red-600
                            hover:text-white
                            transition
                            disabled:opacity-50
                        "
                    >

                        {deleteLoading === user.id ? (

                            <span className="
                                w-3.5
                                h-3.5
                                rounded-full
                                border-2
                                border-red-300
                                border-t-red-600
                                animate-spin
                            " />

                        ) : (

                            <FaTrash />

                        )}

                    </button>

                </div>

            </div>

        </div>
    );
}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
    icon,
    title,
    value,
    description,
    iconClass
}) {

    return (

        <div className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-4
            sm:p-5
            shadow-sm
            hover:shadow-md
            transition
        ">

            <div className="
                flex
                items-center
                justify-between
                gap-3
            ">

                <div>

                    <p className="
                        text-[10px]
                        sm:text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-400
                    ">

                        {title}

                    </p>


                    <h3 className="
                        text-2xl
                        sm:text-3xl
                        font-extrabold
                        text-slate-800
                        mt-1
                    ">

                        {value}

                    </h3>


                    <p className="
                        hidden
                        sm:block
                        text-[11px]
                        text-slate-400
                        mt-1
                    ">

                        {description}

                    </p>

                </div>


                <div className={`
                    w-10
                    h-10
                    sm:w-11
                    sm:h-11
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    shrink-0
                    ${iconClass}
                `}>

                    {icon}

                </div>

            </div>

        </div>
    );
}


// =========================================================
// DRAWER SECTION
// =========================================================

function DrawerSection({
    icon,
    title,
    description
}) {

    return (

        <div className="
            flex
            items-center
            gap-3
            mb-4
        ">

            <div className="
                w-8
                h-8
                rounded-lg
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
                shrink-0
            ">

                {icon}

            </div>


            <div>

                <h3 className="
                    text-sm
                    font-extrabold
                    text-slate-800
                ">

                    {title}

                </h3>


                <p className="
                    text-[11px]
                    text-slate-400
                    mt-0.5
                ">

                    {description}

                </p>

            </div>

        </div>
    );
}


// =========================================================
// DRAWER INPUT
// =========================================================

function DrawerInput({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    icon,
    required = false,
    maxLength
}) {

    return (

        <div>

            <label className="
                block
                text-xs
                font-bold
                text-slate-600
                mb-2
            ">

                {label}

                {required && (

                    <span className="
                        text-red-500
                        ml-1
                    ">

                        *

                    </span>

                )}

            </label>


            <div className="
                flex
                items-center
                gap-3
                px-4
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                focus-within:border-blue-400
                focus-within:ring-4
                focus-within:ring-blue-50
            ">

                <span className="
                    text-blue-500
                    shrink-0
                ">

                    {icon}

                </span>


                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    maxLength={maxLength}
                    className="
                        w-full
                        min-w-0
                        py-3.5
                        bg-transparent
                        outline-none
                        text-sm
                        text-slate-700
                        placeholder:text-slate-400
                    "
                />

            </div>

        </div>
    );
}


// =========================================================
// ROLE PERMISSION
// =========================================================

function RolePermission({
    role,
    icon,
    text,
    active,
    className
}) {

    return (

        <div className={`
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            border
            transition
            ${className}
            ${active
                ? "ring-2 ring-offset-1 ring-blue-200"
                : "opacity-60"
            }
        `}>

            <div className="
                w-8
                h-8
                rounded-lg
                bg-white/70
                flex
                items-center
                justify-center
                shrink-0
            ">

                {icon}

            </div>


            <div className="flex-1">

                <p className="
                    text-[11px]
                    font-extrabold
                ">

                    {role}

                </p>


                <p className="
                    text-[10px]
                    opacity-70
                    mt-0.5
                ">

                    {text}

                </p>

            </div>


            {active && (

                <FaCheckCircle className="
                    text-sm
                " />

            )}

        </div>
    );
}


// =========================================================
// LOADING STATE
// =========================================================

function LoadingState() {

    return (

        <div className="
            py-20
            flex
            flex-col
            items-center
            justify-center
        ">

            <div className="
                w-11
                h-11
                rounded-full
                border-4
                border-blue-100
                border-t-blue-600
                animate-spin
            " />


            <p className="
                mt-4
                text-sm
                font-semibold
                text-slate-500
            ">

                Loading users...

            </p>

        </div>
    );
}


// =========================================================
// EMPTY STATE
// =========================================================

function EmptyState() {

    return (

        <div className="
            py-20
            text-center
            px-6
        ">

            <div className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-slate-100
                text-slate-400
                flex
                items-center
                justify-center
                text-2xl
            ">

                <FaUsers />

            </div>


            <h3 className="
                mt-4
                text-lg
                font-bold
                text-slate-700
            ">

                No users found

            </h3>


            <p className="
                mt-1
                text-sm
                text-slate-400
            ">

                Try changing your search or role filter.

            </p>

        </div>
    );
}


// =========================================================
// EXPORT
// =========================================================

export default ManageUsers;