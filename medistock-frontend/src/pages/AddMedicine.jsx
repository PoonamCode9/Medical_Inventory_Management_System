import { useState } from "react";
import { addMedicine } from "../services/medicineService";
import Navbar from "../components/Navbar";

function AddMedicine(){

const [medicine,setMedicine]=useState({

medicineName:"",
category:"",
batchNumber:"",
quantity:"",
price:"",
manufacturingDate:"",
expiryDate:""

});

const handleChange=(e)=>{

setMedicine({

...medicine,

[e.target.name]:e.target.value

});

};

const handleSubmit=async(e)=>{

e.preventDefault();

await addMedicine(medicine);

alert("Medicine Added Successfully");

};

return(

<>

<Navbar/>

<div className="container mt-4">

<h2>Add Medicine</h2>

<form onSubmit={handleSubmit}>

<input
className="form-control mb-2"
placeholder="Medicine Name"
name="medicineName"
onChange={handleChange}
/>

<input
className="form-control mb-2"
placeholder="Category"
name="category"
onChange={handleChange}
/>

<input
className="form-control mb-2"
placeholder="Batch Number"
name="batchNumber"
onChange={handleChange}
/>

<input
className="form-control mb-2"
placeholder="Quantity"
name="quantity"
onChange={handleChange}
/>

<input
className="form-control mb-2"
placeholder="Price"
name="price"
onChange={handleChange}
/>

<input
type="date"
className="form-control mb-2"
name="manufacturingDate"
onChange={handleChange}
/>

<input
type="date"
className="form-control mb-2"
name="expiryDate"
onChange={handleChange}
/>

<button className="btn btn-success">

Save

</button>

</form>

</div>

</>

);

}

export default AddMedicine;