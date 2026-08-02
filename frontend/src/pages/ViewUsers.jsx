import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewUsers.css";

function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <h2>View Users</h2>
            <div className="user-filters">
                <input
                    type="text"
                    className="search-box"
                    placeholder="Search by name, username or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />


                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Staff">Staff</option>
                </select>
            </div>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>

                <tbody>
                    {users
                        .filter((user) => {
                            const matchesSearch =
                                user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                                user.username.toLowerCase().includes(search.toLowerCase()) ||
                                user.email.toLowerCase().includes(search.toLowerCase());

                            const matchesRole =
                                roleFilter === "All" || user.role?.name === roleFilter;

                            return matchesSearch && matchesRole;
                        })
                        .map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.fullName}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role?.name}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewUsers;