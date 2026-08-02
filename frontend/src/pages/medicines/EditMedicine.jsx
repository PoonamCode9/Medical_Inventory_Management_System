import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/Api";

function EditMedicine() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const { id } = useParams();

    const fetchSuppliers = async() => {
        try {
            const response = await API.get("/suppliers");
            setSuppliers(response.data);
        }
        catch(err) {
            console.log(err);
        }
    };

    const [medicine, setMedicine] = useState({
        medicineName : "",
        category: "",
        batchNo: "",
        manufactureDate : "",
        expiryDate : "",
        price : "",
        supplierId : ""  
    });

    const handleValueChange = (e) => {
        setMedicine({...medicine, [e.target.name]: e.target.value});
    };

    const fetchMedicines = async () => {
        const res = await API.get(`/medicines/${id}`);
        setMedicine({
            medicineName : res.data.medicineName,
            category: res.data.category,
            batchNo: res.data.batchNo,
            manufactureDate : res.data.manufactureDate,
            expiryDate : res.data.expiryDate,
            price : Number(res.data.price),
            supplierId : res.data.supplier ? Number(res.data.supplier.supplierId) : ""
        });
    };

    useEffect(() => {
        fetchMedicines();
        fetchSuppliers();
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!medicine.medicineName.trim() || !medicine.category || !medicine.batchNo.trim() || !medicine.manufactureDate || !medicine.expiryDate || !medicine.price || !medicine.supplierId) {
            alert("Please enter all fields");
            return;
        }

        if(Number(medicine.price) <= 0) {
            alert("Please enter valid price");
            return;
        }

        const requestBody = {
            medicineName : medicine.medicineName,
            category: medicine.category,
            batchNo: medicine.batchNo,
            manufactureDate : medicine.manufactureDate,
            expiryDate : medicine.expiryDate,
            price : Number(medicine.price),
            supplier: {
                supplierId : Number(medicine.supplierId) 
            }
        };

        try {
            await API.put(`/medicines/${id}`, requestBody);
            alert("Medicine updated Successfully");
            navigate("/dashboard/medicines");
        }
        catch(error) {
            console.log(error);
            if(error.response) {
                alert(error.response.data);
            }
            else {
                alert("Something went wrong");
            }
        }
    };


    return (
        <div className="p-6">
            <div>
                <button onClick={() => navigate("/dashboard/medicines")} className="flex items-center gap-2 text-blue-600 mb-3 border px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer transition">
                    <ArrowLeft/>
                    Back
                </button>
                <div>
                    <h1 className="text-3xl font-bold">Edit Medicine</h1>
                    <p className="text-gray-500">Edit a medicine to inventory</p>
                </div>
            </div>
            <div className="mt-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="medicineName" className="block w-max mb-2 font-medium">Medicine Name</label>
                            <input type="text" placeholder="Enter medicine name" id="medicineName" className="w-full border rounded-lg p-3" name="medicineName" value={medicine.medicineName} onChange={handleValueChange}/>
                        </div>
                        <div>
                            <label htmlFor="category" className="block w-max mb-2 font-medium">Category</label>
                            <select id="category" className="w-full border rounded-lg p-3" name="category" value={medicine.category} onChange={handleValueChange}>
                                <option value="" disabled>Select category</option>
                                <option>Tablet</option>
                                <option>Capsule</option>
                                <option>Syrup</option>
                                <option>Injection</option>
                                <option>Cream</option>
                                <option>Ointment</option>
                                <option>Drops</option>
                                <option>Gel</option>
                                <option>Lotion</option>
                                <option>Powder</option>
                                <option>Spray</option>
                                <option>Inhaler</option>
                                <option>Suspension</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="batchNo" className="block w-max mb-2 font-medium">Batch Number</label>
                            <input type="text" placeholder="Enter batch number" id="batchNo" className="w-full border rounded-lg p-3" name="batchNo" value={medicine.batchNo} onChange={handleValueChange}/>
                        </div>
                        <div>
                            <label htmlFor="price" className="block w-max mb-2 font-medium">Price</label>
                            <input type="number" placeholder="Enter price" id="price" className="w-full border rounded-lg p-3" name="price" value={medicine.price} onChange={handleValueChange}/>
                        </div>
                        <div>
                            <label htmlFor="mDate" className="block w-max mb-2 font-medium">Manufacturing Date</label>
                            <input type="date" id="mDate" className="w-full border rounded-lg p-3" name="manufactureDate" value={medicine.manufactureDate} onChange={handleValueChange}/>
                        </div>
                        <div>
                            <label htmlFor="eDate" className="block w-max mb-2 font-medium">Expiry Date</label>
                            <input type="date" id="eDate" className="w-full border rounded-lg p-3" name="expiryDate" value={medicine.expiryDate} onChange={handleValueChange}/>
                        </div>
                        <div>
                            <label htmlFor="supplier" className="block w-max mb-2 font-medium">Supplier</label>
                            <select id="supplier" className="w-full border rounded-lg p-3" name="supplierId" value={medicine.supplierId} onChange={handleValueChange}>
                                <option value="" disabled>Select Supplier</option> 
                                {
                                    suppliers.map((supplier) => (
                                        <option key={supplier.supplierId} value={supplier.supplierId}>{supplier.supplierName}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition">
                                Save Medicine
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditMedicine;