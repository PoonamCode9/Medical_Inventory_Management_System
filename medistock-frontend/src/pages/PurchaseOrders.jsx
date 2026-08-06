import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getPurchases,
    addPurchase,
    deletePurchase
} from "../services/purchaseService";

function PurchaseOrders() {

    const [purchase, setPurchase] = useState({

        supplierName: "",
        medicineName: "",
        quantity: "",
        totalPrice: "",
        purchaseDate: ""

    });

    const [purchases, setPurchases] = useState([]);

    useEffect(() => {

        loadPurchases();

    }, []);

    const loadPurchases = async () => {

        const res = await getPurchases();

        setPurchases(res.data);

    };

    const handleChange = (e) => {

        setPurchase({

            ...purchase,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (purchase.supplierName === "") {

            alert("Supplier Name Required");

            return;

        }

        if (purchase.medicineName === "") {

            alert("Medicine Name Required");

            return;

        }

        if (purchase.quantity <= 0) {

            alert("Quantity should be greater than zero");

            return;

        }

        if (purchase.totalPrice <= 0) {

            alert("Total Price Required");

            return;

        }

        await addPurchase(purchase);

        alert("Purchase Added Successfully");

        setPurchase({

            supplierName: "",
            medicineName: "",
            quantity: "",
            totalPrice: "",
            purchaseDate: ""

        });

        loadPurchases();

    };

    const handleDelete = async (id) => {

        if (window.confirm("Delete Purchase?")) {

            await deletePurchase(id);

            loadPurchases();

        }

    };

    return (

        <>

            <Navbar />

            <div className="container mt-4">

                <h2>Purchase Orders</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        className="form-control mb-2"
                        placeholder="Supplier Name"
                        name="supplierName"
                        value={purchase.supplierName}
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        placeholder="Medicine Name"
                        name="medicineName"
                        value={purchase.medicineName}
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        type="number"
                        placeholder="Quantity"
                        name="quantity"
                        value={purchase.quantity}
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        type="number"
                        placeholder="Total Price"
                        name="totalPrice"
                        value={purchase.totalPrice}
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-3"
                        type="date"
                        name="purchaseDate"
                        value={purchase.purchaseDate}
                        onChange={handleChange}
                    />

                    <button className="btn btn-success">

                        Add Purchase

                    </button>

                </form>

                <hr />

                <table className="table table-bordered">

                    <thead>

                    <tr>

                        <th>ID</th>

                        <th>Supplier</th>

                        <th>Medicine</th>

                        <th>Quantity</th>

                        <th>Total</th>

                        <th>Date</th>

                        <th>Action</th>

                    </tr>

                    </thead>

                    <tbody>

                    {

                        purchases.map((p)=>(

                            <tr key={p.id}>

                                <td>{p.id}</td>

                                <td>{p.supplierName}</td>

                                <td>{p.medicineName}</td>

                                <td>{p.quantity}</td>

                                <td>{p.totalPrice}</td>

                                <td>{p.purchaseDate}</td>

                                <td>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={()=>handleDelete(p.id)}
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

export default PurchaseOrders;