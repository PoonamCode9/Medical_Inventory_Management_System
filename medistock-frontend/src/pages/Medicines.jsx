import { useEffect, useState } from "react";
import { getMedicines } from "../services/medicineService";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
function Medicines() {

    const [medicines, setMedicines] = useState([]);

    useEffect(() => {

        loadMedicines();

    }, []);

    const loadMedicines = async () => {

        const res = await getMedicines();

        setMedicines(res.data);

    };

    return (
        <>
        <Navbar />

        <div className="container mt-4">

            <h2>Medicines</h2>
            <Link to="/add-medicine">

<button className="btn btn-success mb-3">

Add Medicine

</button>

</Link>

            <table className="table table-bordered">

                <thead>
                     

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>

                    </tr>
                   

                </thead>

                <tbody>

                    {medicines.map((m) => (

                        <tr key={m.id}>

                            <td>{m.id}</td>
                            <td>{m.medicineName}</td>
                            <td>{m.category}</td>
                            <td>{m.quantity}</td>
                            <td>{m.price}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
        </>
    );

}

export default Medicines;