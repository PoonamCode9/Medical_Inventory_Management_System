import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AddPurchaseOrder.css";

function AddPurchaseOrder() {

    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [supplierId, setSupplierId] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [expectedDelivery, setExpectedDelivery] = useState("");
    const [status, setStatus] = useState("PENDING");

    const [items, setItems] = useState([
        {
            medicineId: "",
            quantity: 1
        }
    ]);

    const token = localStorage.getItem("token");

    useEffect(() => {

        const today = new Date().toISOString().split("T")[0];
        setOrderDate(today);

        fetchSuppliers();
        fetchMedicines();

    }, []);


    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/suppliers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuppliers(response.data);

        } catch (error) {
            console.log(error);
        }
    };


    const fetchMedicines = async () => {
        try {

            const response = await axios.get(
                "http://localhost:8080/medicines",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMedicines(response.data);

        } catch (error) {
            console.log(error);
        }
    };


    const addMedicineRow = () => {

        setItems([
            ...items,
            {
                medicineId: "",
                quantity: 1
            }
        ]);

    };


    const removeMedicineRow = (index) => {

        const updatedItems = items.filter(
            (_, i) => i !== index
        );

        setItems(updatedItems);

    };


    const handleItemChange = (index, field, value) => {

        const updatedItems = [...items];

        updatedItems[index][field] = value;

        setItems(updatedItems);

    };


    const calculateTotal = () => {

        let total = 0;

        items.forEach(item => {

            const medicine = medicines.find(
                med => med.medicineId == item.medicineId
            );

            if (medicine) {
                total += medicine.unitPrice * item.quantity;
            }

        });

        return total;

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        const purchaseOrder = {

            supplier: {
                supplierId: supplierId
            },

            orderDate,

            expectedDelivery,

            totalAmount: calculateTotal(),

            status,

            items: items.map(item => ({
                medicine: {
                    medicineId: item.medicineId
                },
                quantity: item.quantity
            }))

        };


        try {

            await axios.post(
                "http://localhost:8080/purchase-orders",
                purchaseOrder,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            alert("Purchase Order Added Successfully");


            setSupplierId("");
            setExpectedDelivery("");

            setItems([
                {
                    medicineId: "",
                    quantity: 1
                }
            ]);


        } catch (error) {

            console.log(error);
            alert("Failed to Add Purchase Order");

        }

    };


    return (

        <div className="purchase-container">

            <div className="purchase-card">

                <h2>Create Purchase Order</h2>

                <p>
                    Create a medicine purchase request from supplier
                </p>


                <form onSubmit={handleSubmit}>


                    <div className="form-section">

                        <h3>Supplier Details</h3>

                        <label>
                            Select Supplier
                        </label>

                        <select
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            required
                        >

                            <option value="">
                                Select Supplier
                            </option>


                            {
                                suppliers.map(supplier => (
                                    <option
                                        key={supplier.supplierId}
                                        value={supplier.supplierId}
                                    >
                                        {supplier.supplierName}
                                    </option>
                                ))
                            }

                        </select>

                    </div>



                    <div className="form-section">

                        <h3>Order Details</h3>


                        <label>
                            Order Date
                        </label>

                        <input
                            type="date"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                        />


                        <label>
                            Expected Delivery
                        </label>

                        <input
                            type="date"
                            value={expectedDelivery}
                            onChange={(e) => setExpectedDelivery(e.target.value)}
                        />


                        <label>
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >

                            <option value="PENDING">
                                PENDING
                            </option>

                            <option value="DELIVERED">
                                DELIVERED
                            </option>

                            <option value="CANCELLED">
                                CANCELLED
                            </option>

                        </select>


                    </div>




                    <div className="form-section">

                        <h3>Medicine Items</h3>


                        {
                            items.map((item, index) => (

                                <div className="medicine-row" key={index}>


                                    <select
                                        value={item.medicineId}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "medicineId",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select Medicine
                                        </option>


                                        {
                                            medicines.map(medicine => (

                                                <option
                                                    key={medicine.medicineId}
                                                    value={medicine.medicineId}
                                                >
                                                    {medicine.medicineName}
                                                </option>

                                            ))
                                        }

                                    </select>


                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "quantity",
                                                e.target.value
                                            )
                                        }
                                    />


                                    {
                                        items.length > 1 &&
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeMedicineRow(index)}
                                        >
                                            Remove
                                        </button>
                                    }


                                </div>

                            ))
                        }



                        <button
                            type="button"
                            className="add-btn"
                            onClick={addMedicineRow}
                        >
                            + Add Medicine
                        </button>


                    </div>



                    <div className="total-box">

                        Total Amount:
                        ₹ {calculateTotal()}

                    </div>



                    <button
                        className="save-btn"
                        type="submit"
                    >
                        Save Purchase Order
                    </button>


                </form>

            </div>

        </div>

    );

}

export default AddPurchaseOrder;