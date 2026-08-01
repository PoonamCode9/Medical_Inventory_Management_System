import { useEffect, useState } from "react";
import {
    getSuppliers,
    deleteSupplier,
    searchSupplier
} from "../services/supplierService";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        const res = await getSuppliers();
        setSuppliers(res.data);
    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this supplier?"
        );

        if (confirmDelete) {
            await deleteSupplier(id);
            loadSuppliers();
        }
    };

    const handleSearch = async (value) => {

        setSearch(value);

        if (value === "") {
            loadSuppliers();
        } else {
            const res = await searchSupplier(value);
            setSuppliers(res.data);
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Suppliers</h2>

                <Link to="/add-supplier">
                    <button className="btn btn-success mb-3">
                        Add Supplier
                    </button>
                </Link>

                {/* Search Box */}

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Supplier..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <table className="table table-bordered">

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {suppliers.length > 0 ? (

                            suppliers.map((s) => (

                                <tr key={s.id}>

                                    <td>{s.id}</td>
                                    <td>{s.supplierName}</td>
                                    <td>{s.contactNumber}</td>
                                    <td>{s.email}</td>

                                    <td>

                                        <Link
                                            to={`/edit-supplier/${s.id}`}
                                            className="btn btn-warning btn-sm me-2"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(s.id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td colSpan="5" className="text-center">
                                    No Suppliers Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </>
    );

}

export default Suppliers;