import { useEffect, useState } from "react";

import {
    getMedicines,
    deleteMedicine,
    searchMedicine,
    downloadExcel,
    downloadPdf
} from "../services/medicineService";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Medicines() {

    const [medicines, setMedicines] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadMedicines();
    }, []);

    const loadMedicines = async () => {

        const res = await getMedicines();
        setMedicines(res.data);

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this medicine?"
        );

        if (confirmDelete) {

            await deleteMedicine(id);

            loadMedicines();

        }

    };

    return (

        <>

            <Navbar />

            <div className="container mt-4">

                <h2>Medicines</h2>

                <div className="d-flex mb-3">

                    <Link to="/add-medicine">

                        <button className="btn btn-success me-2">

                            Add Medicine

                        </button>

                    </Link>

                    <button
                        className="btn btn-primary"
                        onClick={downloadExcel}
                    >

                        Download Excel

                    </button>
                    <button
    className="btn btn-danger ms-2"
    onClick={downloadPdf}
>
    Download PDF
</button>

                </div>

                <div className="mb-3">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Medicine..."
                        value={search}
                        onChange={async (e) => {

                            const value = e.target.value;

                            setSearch(value);

                            if (value === "") {

                                loadMedicines();

                            } else {

                                const res = await searchMedicine(value);

                                setMedicines(res.data);

                            }

                        }}
                    />

                </div>

                <table className="table table-bordered table-hover">

                    <thead className="table-dark">

                        <tr>

                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            medicines.map((m) => (

                                <tr key={m.id}>

                                    <td>{m.id}</td>

                                    <td>{m.medicineName}</td>

                                    <td>{m.category}</td>

                                    <td>{m.quantity}</td>

                                    <td>₹ {m.price}</td>

                                    <td>

                                        <Link
                                            to={`/edit-medicine/${m.id}`}
                                            className="btn btn-warning btn-sm me-2"
                                        >

                                            Edit

                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(m.id)}
                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </>

    );

}

export default Medicines;