import { useEffect, useState } from "react";
import { getSuppliers } from "../services/supplierService";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {

        loadSuppliers();

    }, []);

    const loadSuppliers = async () => {

        const res = await getSuppliers();

        setSuppliers(res.data);

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

            <table className="table table-bordered">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>

                    </tr>

                </thead>

                <tbody>

                    {suppliers.map((s) => (

                        <tr key={s.id}>

                            <td>{s.id}</td>
                            <td>{s.supplierName}</td>
                            <td>{s.contactNumber}</td>
                            <td>{s.email}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
        </>

    );

}

export default Suppliers;