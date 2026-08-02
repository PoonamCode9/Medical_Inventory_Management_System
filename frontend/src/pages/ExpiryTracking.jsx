import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/ExpiryTracking.css";

function ExpiryTracking() {

    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");

    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        fetchMedicines();
    }, [status]);

    const fetchMedicines = async () => {

        try {

            const token = localStorage.getItem("token");

            let url = "";

            if (status === "expired") {
                url = "http://localhost:8080/expiry-tracking/expired";
            } else if (status === "expiring") {
                url = "http://localhost:8080/expiry-tracking/expiring-soon";
            } else {
                url = "http://localhost:8080/expiry-tracking/valid";
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMedicines(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="expiry-container">

            <h2>
                {status === "expired"
                    ? "Expired Medicines"
                    : status === "expiring"
                        ? "Medicines Expiring Soon"
                        : "Valid Medicines"}
            </h2>

            <table className="expiry-table">

                <thead>
                    <tr>
                        <th>Medicine Name</th>
                        <th>Expiry Date</th>
                        <th>Quantity</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    {medicines.map((item) => (
                        <tr key={item.expiryId}>
                            <td>{item.medicine.medicineName}</td>
                            <td>{item.expiryDate}</td>
                            <td>{item.quantity}</td>
                            <td>{item.status}</td>
                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default ExpiryTracking;