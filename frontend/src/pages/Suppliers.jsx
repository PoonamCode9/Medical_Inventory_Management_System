import "../css/Suppliers.css";

import { useEffect, useState } from "react";
import API from "../services/api";

function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);

    const [supplierName, setSupplierName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [suppliedMedicines, setSuppliedMedicines] = useState("");
   
    const [contactPerson,setContactPerson]=useState("");
const [totalPurchases,setTotalPurchases]=useState("");
const [rating,setRating]=useState("");
const [status,setStatus]=useState("Active");
const [search, setSearch] = useState("");

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {

        try {

            const response = await API.get("/suppliers");

            setSuppliers(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const addSupplier = async () => {

        try {

            if (editingId === null) {

                await API.post("/suppliers",{

supplierName,
contactPerson,
contactNumber,
email,
address,
suppliedMedicines,
totalPurchases,
rating,
status

});

                alert("Supplier Added Successfully");

            } else {

                await API.put(`/suppliers/${editingId}`, {

    supplierName,
contactPerson,
contactNumber,
email,
address,
suppliedMedicines,
totalPurchases,
rating,
status

});

                alert("Supplier Updated Successfully");

                setEditingId(null);

            }

            setSupplierName("");
            setContactNumber("");
            setEmail("");
            setAddress("");
            setSuppliedMedicines("");
            setContactPerson("");
setTotalPurchases("");
setRating("");
setStatus("Active");

            loadSuppliers();

        } catch (error) {

            console.log(error);

            alert("Operation Failed");

        }

    };

    const editSupplier = (supplier) => {

        setEditingId(supplier.id);

        setSupplierName(supplier.supplierName);
        setContactNumber(supplier.contactNumber);
        setEmail(supplier.email);
        setAddress(supplier.address);
        setSuppliedMedicines(supplier.suppliedMedicines);
        setContactPerson(supplier.contactPerson);
setTotalPurchases(supplier.totalPurchases);
setRating(supplier.rating);
setStatus(supplier.status);

    };

    const deleteSupplier = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this supplier?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await API.delete(`/suppliers/${id}`);

            alert("Supplier Deleted Successfully");

            loadSuppliers();

        } catch (error) {

            console.log(error);

            alert("Failed to Delete Supplier");

        }

    };

    return (

        <div className="supplier-page">

            <h2 className="page-title">
    🚚 Suppliers
</h2>

<p className="page-subtitle">
    Manage all suppliers in one place
</p>

            <div className="supplier-form">

                <div className="row mb-4">

    <div className="col-md-3">

<div className="stats-card bg-primary">

<h5>Total Suppliers</h5>

<h2>{suppliers.length}</h2>

</div>

</div>

<div className="col-md-3">

<div className="stats-card bg-success">

<h5>Active</h5>

<h2>

{suppliers.filter(s=>s.status==="Active").length}

</h2>

</div>

</div>

<div className="col-md-3">

<div className="stats-card bg-danger">

<h5>Inactive</h5>

<h2>

{suppliers.filter(s=>s.status==="Inactive").length}

</h2>

</div>

</div>

<div className="col-md-3">

<div className="stats-card bg-warning">

<h5>Medicines</h5>

<h2>

{suppliers.length}

</h2>

</div>

</div>

</div>

                <h4>Add Supplier</h4>

                <input
                    className="form-control mb-2"
                    placeholder="Supplier Name"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                />

                <input
className="form-control mb-2"
placeholder="Contact Person"
value={contactPerson}
onChange={(e)=>setContactPerson(e.target.value)}
/>

                <input
                    className="form-control mb-2"
                    placeholder="Contact Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <textarea
                    className="form-control mb-3"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <input
className="form-control mb-3"
placeholder="Supplied Medicines"
value={suppliedMedicines}
onChange={(e)=>setSuppliedMedicines(e.target.value)}
/>

<input
className="form-control mb-2"
type="number"
placeholder="Total Purchases"
value={totalPurchases}
onChange={(e)=>setTotalPurchases(e.target.value)}
/>

<input
className="form-control mb-2"
type="number"
step="0.1"
min="0"
max="5"
placeholder="Supplier Rating"
value={rating}
onChange={(e)=>setRating(e.target.value)}
/>

<select
className="form-control mb-3"
value={status}
onChange={(e)=>setStatus(e.target.value)}
>
<option>Active</option>
<option>Inactive</option>
</select>

                <button
                    className="btn btn-primary px-4"
                    onClick={addSupplier}
                >
                    {editingId === null ? "Add Supplier" : "Update Supplier"}
                </button>

            </div>

            <div className="search-card mb-4">

    <input
type="text"
className="form-control"
placeholder="🔍 Search Supplier..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

            <div className="table-card">

<table className="table table-hover align-middle">

                <thead>

                    <tr>

                        <th>ID</th>
<th>Name</th>
<th>Person</th>
<th>Phone</th>
<th>Email</th>
<th>Address</th>
<th>Medicines</th>
<th>Purchases</th>
<th>Rating</th>
<th>Status</th>
<th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        suppliers
.filter((supplier)=>
supplier.supplierName.toLowerCase().includes(search.toLowerCase())
)
.map((supplier)=>(

                            <tr key={supplier.id}>

    <td>{supplier.id}</td>

    <td>{supplier.supplierName}</td>

    <td>{supplier.contactPerson}</td>

    <td>{supplier.contactNumber}</td>

    <td>{supplier.email}</td>

    <td>{supplier.address}</td>

    <td>{supplier.suppliedMedicines}</td>

    <td>{supplier.totalPurchases}</td>

    <td>⭐ {supplier.rating}</td>

    <td>
        <span className="badge bg-success">
            {supplier.status}
        </span>
    </td>

    <td>
        <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={() => editSupplier(supplier)}
        >
            Edit
        </button>

        <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => deleteSupplier(supplier.id)}
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

export default Suppliers;