import { ArrowLeft, Edit3, Pill, Tag, Barcode, IndianRupee, Calendar, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/Api";
import toast from "react-hot-toast";

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
        try {
            const res = await API.get(`/medicines/${id}`);
            setMedicine({
                medicineName : res.data.medicineName || "",
                category: res.data.category || "",
                batchNo: res.data.batchNo || "",
                manufactureDate : res.data.manufactureDate || "",
                expiryDate : res.data.expiryDate || "",
                price : res.data.price ? Number(res.data.price) : "",
                supplierId : res.data.supplier ? Number(res.data.supplier.supplierId) : ""
            });
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch medicine details");
        }
    };

    useEffect(() => {
        fetchMedicines();
        fetchSuppliers();
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!medicine.medicineName.trim() || !medicine.category || !medicine.batchNo.trim() || !medicine.manufactureDate || !medicine.expiryDate || !medicine.price || !medicine.supplierId) {
            toast.error("Please fill in all fields");
            return;
        }

        if(Number(medicine.price) <= 0) {
            toast.error("Please enter a valid price");
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
            toast.success("Medicine updated successfully");
            navigate("/dashboard/medicines");
        }
        catch(error) {
            console.log(error);
            if(error.response) {
                toast.error(error.response.data);
            }
            else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <div className="w-full pb-10 min-h-screen bg-slate-50/60 p-6">
            <div>
                <button 
                    onClick={() => navigate("/dashboard/medicines")} 
                    className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-4 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition shadow-xs"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
                        <Edit3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Medicine</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Update medicine details in inventory</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        <div>
                            <label htmlFor="medicineName" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Pill className="w-4 h-4 text-blue-600" />
                                Medicine Name
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter medicine name" 
                                id="medicineName" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                                name="medicineName" 
                                value={medicine.medicineName} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Tag className="w-4 h-4 text-blue-600" />
                                Category
                            </label>
                            <select 
                                id="category" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer" 
                                name="category" 
                                value={medicine.category} 
                                onChange={handleValueChange}
                            >
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
                            <label htmlFor="batchNo" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Barcode className="w-4 h-4 text-blue-600" />
                                Batch Number
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter batch number" 
                                id="batchNo" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                                name="batchNo" 
                                value={medicine.batchNo} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <IndianRupee className="w-4 h-4 text-blue-600" />
                                Price
                            </label>
                            <input 
                                type="number" 
                                placeholder="Enter price" 
                                id="price" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                                name="price" 
                                value={medicine.price} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="mDate" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                Manufacturing Date
                            </label>
                            <input 
                                type="date" 
                                id="mDate" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer" 
                                name="manufactureDate" 
                                value={medicine.manufactureDate} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="eDate" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                Expiry Date
                            </label>
                            <input 
                                type="date" 
                                id="eDate" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer" 
                                name="expiryDate" 
                                value={medicine.expiryDate} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="supplier" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Truck className="w-4 h-4 text-blue-600" />
                                Supplier
                            </label>
                            <select 
                                id="supplier" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer" 
                                name="supplierId" 
                                value={medicine.supplierId} 
                                onChange={handleValueChange}
                            >
                                <option value="" disabled>Select Supplier</option> 
                                {
                                    suppliers.map((supplier) => (
                                        <option key={supplier.supplierId} value={supplier.supplierId}>{supplier.supplierName}</option>
                                    ))
                                }
                            </select>
                        </div>

                    </div>

                    <div className="flex justify-end pt-6">
                        <button 
                            type="submit" 
                            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 cursor-pointer transition shadow-sm shadow-blue-500/20"
                        >
                            Update Medicine
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMedicine;