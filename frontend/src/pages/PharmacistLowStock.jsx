import { useEffect, useState } from "react";

function PharmacistLowStock() {

    const [lowStockMedicines, setLowStockMedicines] = useState([]);

    useEffect(() => {
        fetchLowStockMedicines();
    }, []);

    const fetchLowStockMedicines = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/medicines", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const medicines = await response.json();

            const lowStock = medicines.filter(
                medicine => medicine.quantity > 0 && medicine.quantity <= 50
            );

            setLowStockMedicines(lowStock);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="dashboard-content">

            <h2>⚠️ Low Stock Medicines</h2>

            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Quantity</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {lowStockMedicines.length > 0 ? (
                        lowStockMedicines.map((medicine) => (
                            <tr key={medicine.medicineId}>
                                <td>{medicine.medicineName}</td>
                                <td>{medicine.quantity}</td>
                                <td>Low Stock</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No medicines are low in stock.</td>
                        </tr>
                    )}
                </tbody>

            </table>

        </div>
    );
}

export default PharmacistLowStock;