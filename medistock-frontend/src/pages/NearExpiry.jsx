import { useEffect, useState } from "react";
import { getNearExpiryMedicines } from "../services/medicineService";
import Navbar from "../components/Navbar";

function NearExpiry() {

    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        loadMedicines();
    }, []);

    const loadMedicines = async () => {
        const response = await getNearExpiryMedicines();
        setMedicines(response.data);
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Near Expiry Medicines</h2>

                <table className="table table-bordered table-striped">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Batch</th>
                            <th>Expiry Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            medicines.length === 0 ?

                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No Near Expiry Medicines
                                    </td>
                                </tr>

                                :

                                medicines.map((medicine) => (

                                    <tr key={medicine.medicineId}>

                                        <td>{medicine.medicineId}</td>

                                        <td>{medicine.medicineName}</td>

                                        <td>{medicine.category}</td>

                                        <td>{medicine.batchNumber}</td>

                                        <td className="text-warning fw-bold">
                                            {medicine.expiryDate}
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

export default NearExpiry;