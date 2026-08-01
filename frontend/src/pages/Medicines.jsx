import "../css/Medicines.css";

import { useEffect, useState } from "react";
import API from "../services/api";

function Medicines() {

    const [medicines, setMedicines] = useState([]);

    const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] = useState("");
const [supplierFilter, setSupplierFilter] = useState("");
const [stockStatus, setStockStatus] = useState("");

    const [medicineName, setMedicineName] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [category, setCategory] = useState("");
const [batchNumber, setBatchNumber] = useState("");
const [manufacturingDate, setManufacturingDate] = useState("");
const [supplier, setSupplier] = useState("");

    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    const [editingId, setEditingId] = useState(null);

const [batchFilter, setBatchFilter] = useState("");
const [expiryFilter, setExpiryFilter] = useState("");

    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        loadMedicines();
    }, []);

    const loadMedicines = async () => {

        try {

            const response = await API.get("/medicines");

            setMedicines(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const addMedicine = async () => {

        try {

            if (editingId === null) {

                await API.post("/medicines", {

    medicineName,
    manufacturer,
    category,
    batchNumber,
    manufacturingDate,
    expiryDate,
    supplier,
    price,
    quantity

});

                alert("Medicine Added Successfully");

            } else {

                await API.put(`/medicines/${editingId}`, {

    medicineName,
    manufacturer,
    category,
    batchNumber,
    manufacturingDate,
    expiryDate,
    supplier,
    price,
    quantity

});

                alert("Medicine Updated Successfully");

                setEditingId(null);

            }

            setMedicineName("");
setManufacturer("");
setCategory("");
setBatchNumber("");
setManufacturingDate("");
setExpiryDate("");
setSupplier("");
setPrice("");
setQuantity("");

            loadMedicines();

        } catch (error) {

            console.log(error);

            alert("Operation Failed");

        }

    };

    const deleteMedicine = async (id) => {

        if (!window.confirm("Are you sure you want to delete this medicine?")) {
            return;
        }

        try {

            await API.delete(`/medicines/${id}`);

            alert("Medicine Deleted Successfully");

            loadMedicines();

        } catch (error) {

            console.log(error);

            alert("Failed to Delete Medicine");

        }

    };

    const editMedicine = (medicine) => {

        setEditingId(medicine.id);

        setMedicineName(medicine.medicineName);
setManufacturer(medicine.manufacturer);
setCategory(medicine.category);
setBatchNumber(medicine.batchNumber);
setManufacturingDate(medicine.manufacturingDate);
setExpiryDate(medicine.expiryDate);
setSupplier(medicine.supplier);
setPrice(medicine.price);
setQuantity(medicine.quantity);

    };

const today = new Date();
today.setHours(0, 0, 0, 0);


    return (
        
       

        <div className="medicine-page">

            <h2 className="page-title">
    💊 Medicines
</h2>

<p className="page-subtitle">
    Manage all medicines in one place
</p>

 <div className="row mb-3">

    <div className="col-md-3">

        <input
            className="form-control"
            placeholder="Search Medicine"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
        />

    </div>

    <div className="col-md-3">

        <input
            className="form-control"
            placeholder="Category"
            value={categoryFilter}
            onChange={(e)=>setCategoryFilter(e.target.value)}
        />

    </div>

    <div className="col-md-3">

        <input
            className="form-control"
            placeholder="Supplier"
            value={supplierFilter}
            onChange={(e)=>setSupplierFilter(e.target.value)}
        />

    </div>

        <div className="col-md-3">

    <input
        className="form-control"
        placeholder="Batch Number"
        value={batchFilter}
        onChange={(e)=>setBatchFilter(e.target.value)}
    />

</div>

<div className="col-md-3">

    <input
        type="date"
        className="form-control"
        value={expiryFilter}
        onChange={(e)=>setExpiryFilter(e.target.value)}
    />

</div>    

    <div className="col-md-3">

        <select
            className="form-select"
            value={stockStatus}
            onChange={(e)=>setStockStatus(e.target.value)}
        >

            <option value="">Stock Status</option>

            <option value="In Stock">In Stock</option>

            <option value="Low Stock">Low Stock</option>

            <option value="Out Of Stock">Out Of Stock</option>

        </select>

    </div>

</div>

            <div className="medicine-form">

                <h4>{editingId === null ? "Add Medicine" : "Update Medicine"}</h4>

                <input
                    className="form-control mb-2"
                    placeholder="Medicine Name"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Manufacturer"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />

                <input
                    className="form-control mb-3"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                />

                <input
    className="form-control mb-2"
    placeholder="Category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
/>

<input
    className="form-control mb-2"
    placeholder="Batch Number"
    value={batchNumber}
    onChange={(e) => setBatchNumber(e.target.value)}
/>

<input
    className="form-control mb-2"
    type="date"
    value={manufacturingDate}
    onChange={(e) => setManufacturingDate(e.target.value)}
/>

<input
    className="form-control mb-2"
    placeholder="Supplier"
    value={supplier}
    onChange={(e) => setSupplier(e.target.value)}
/>

                <button
    className="btn btn-primary px-4 py-2"
    onClick={addMedicine}
>
                    {editingId === null ? "Add Medicine" : "Update Medicine"}
                </button>

            </div>


            <div className="row mb-4">

                <div className="col-md-3">

                    <div className="stats-card bg-primary">

                        <div className="card-body">

                            <h5>Total Medicines</h5>

                            <h2>{medicines.length}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="stats-card bg-success">

                        <div className="card-body">

                            <h5>In Stock</h5>

                            <h2>{medicines.filter(m => m.quantity > 20).length}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="stats-card bg-warning">

                        <div className="card-body">

                            <h5>Low Stock</h5>

                            <h2>{medicines.filter(m => m.quantity > 0 && m.quantity <= 20).length}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="stats-card bg-danger">

                        <div className="card-body">

                            <h5>Notifications</h5>

                            <h2>{medicines.filter(m => m.quantity <= 20).length}</h2>

                        </div>

                    </div>

                </div>

            </div>

            {
                medicines.filter(m => m.quantity <= 20).length > 0 && (

                    <div className="low-stock-card">

                        <h5>⚠ Low Stock Alerts</h5>

                        {
                            medicines
                                .filter(m => m.quantity <= 20)
                                .map(m => (

                                    <div key={m.id}>

                                        • <b>{m.medicineName}</b> has only <b>{m.quantity}</b> units remaining.

                                    </div>

                                ))
                        }

                    </div>

                )
            }

            {
    medicines.filter(m => new Date(m.expiryDate) < today).length > 0 && (

        <div className="low-stock-card mt-3">

            <h5>❌ Expired Medicines</h5>

            {
                medicines
                    .filter(m => new Date(m.expiryDate) < today)
                    .map(m => (

                        <div key={m.id}>

                            • <b>{m.medicineName}</b> expired on <b>{m.expiryDate}</b>

                        </div>

                    ))
            }

        </div>

    )
}
            
                        <div className="table-card">

<table className="table table-hover align-middle">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Manufacturer</th>
                        <th>Category</th>
                        <th>Batch No.</th>
                        <th>Supplier</th>
                        <th>Mfg Date</th>
                        <th>Price</th>
                        <th>Stock Status</th>
                        <th>Expiry Date</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                {

                    medicines

                    .filter((medicine) => {

    const matchesSearch =
        search === "" ||
        medicine.medicineName.toLowerCase().includes(search.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
        categoryFilter === "" ||
        medicine.category.toLowerCase().includes(categoryFilter.toLowerCase());

    const matchesSupplier =
        supplierFilter === "" ||
        medicine.supplier.toLowerCase().includes(supplierFilter.toLowerCase());

    const matchesBatch =
        batchFilter === "" ||
        medicine.batchNumber.toLowerCase().includes(batchFilter.toLowerCase());

    const matchesExpiry =
        expiryFilter === "" ||
        medicine.expiryDate === expiryFilter;

    const matchesStock =
        stockStatus === "" ||

        (stockStatus === "In Stock" && medicine.quantity > 20) ||

        (stockStatus === "Low Stock" &&
            medicine.quantity > 0 &&
            medicine.quantity <= 20) ||

        (stockStatus === "Out Of Stock" &&
            medicine.quantity === 0);

    return (
        matchesSearch &&
        matchesCategory &&
        matchesSupplier &&
        matchesBatch &&
        matchesExpiry &&
        matchesStock
    );

})

                    .map((medicine) => (

                        <tr key={medicine.id}>

                            <td>{medicine.id}</td>

                            <td>{medicine.medicineName}</td>

                            <td>{medicine.manufacturer}</td>

                            <td>{medicine.category}</td>
                            <td>{medicine.batchNumber}</td>
                            <td>{medicine.supplier}</td>
                            <td>{medicine.manufacturingDate}</td>

                            <td>₹ {medicine.price}</td>

                            <td>

{(() => {

    const expiry = new Date(medicine.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    if (expiry < today) {
        return (
            <span className="badge bg-danger">
                Expired
            </span>
        );
    }

    if (medicine.quantity > 20) {
        return (
            <span className="badge bg-success">
                {medicine.quantity} - In Stock
            </span>
        );
    }

    if (medicine.quantity > 0 && medicine.quantity <= 20) {
        return (
            <span className="badge bg-warning text-dark">
                {medicine.quantity} - Low Stock
            </span>
        );
    }

    return (
        <span className="badge bg-danger">
            Out of Stock
        </span>
    );

})()}

</td>

                            <td>{medicine.expiryDate}</td>

                            <td>

                                <button
                                    className="btn btn-outline-primary btn-sm me-2"
                                    onClick={() => editMedicine(medicine)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => deleteMedicine(medicine.id)}
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

        </div>

    );

}

export default Medicines;