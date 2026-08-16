import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/Api";
import { ArrowLeft, PackagePlus, PackageSearch, Hash } from "lucide-react";
import toast from "react-hot-toast";

function AddInventory() {
    const navigate = useNavigate();
    const location = useLocation();

    const [medicines, setMedicines] = useState([]);
    const [inventory, setInventory] = useState({
        medicineId: "", 
        quantity: ""
    });

    const fetchMedicines = async () => {
        try {
            const response = await API.get("/inventory/available-medicines");
            setMedicines(response.data);
            
            if (location.state?.autoSelectMedicineId) {
                setInventory((prev) => ({
                    ...prev,
                    medicineId: String(location.state.autoSelectMedicineId),
                }));
            }
        } 
        catch(error) {
            console.log(error);
        }
    };

    const handleValueChange = (e) => {
        setInventory({...inventory, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!inventory.medicineId) {
            toast.error("Please select medicine");
            return;
        }

        if(!inventory.quantity || Number(inventory.quantity) < 0) {
            toast.error("Please enter valid quantity");
            return;
        }

        const requestBody = {
            medicine : {
                medicineId: inventory.medicineId
            },
            quantity: Number(inventory.quantity)
        };

        try {
            await API.post("/inventory", requestBody);
            toast.success("Inventory added successfully");
            navigate("/dashboard/inventory");
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

    useEffect(() => {
        fetchMedicines();
    }, []);

    return (
        <div className="w-full pb-10 min-h-screen bg-slate-50/60 p-6">
            <div>
                <button 
                    onClick={() => navigate("/dashboard/inventory")} 
                    className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-4 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition shadow-xs"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
                        <PackagePlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add Inventory</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Add medicine stock</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="medicine" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <PackageSearch className="w-4 h-4 text-blue-600" />
                                Medicine
                            </label>
                            <select 
                                id="medicine" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer" 
                                name="medicineId" 
                                value={inventory.medicineId} 
                                onChange={handleValueChange}
                            >
                                <option value="" disabled>Select Medicine</option>
                                {
                                    medicines.map((medicine) => (
                                        <option key={medicine.medicineId} value={medicine.medicineId}>
                                            {medicine.medicineName} {medicine.batchNo ? `(${medicine.batchNo})` : ""}
                                        </option>
                                    ))
                                }
                            </select>
                            {medicines.length === 0 && (
                                <p className="text-rose-500 text-xs mt-2 font-medium">No medicines available to add inventory</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="quantity" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Hash className="w-4 h-4 text-blue-600" />
                                Quantity
                            </label>
                            <input 
                                type="number" 
                                placeholder="Enter quantity" 
                                id="quantity" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                                name="quantity" 
                                value={inventory.quantity} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div className="flex justify-end pt-3">
                            <button 
                                type="submit" 
                                className={`px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition shadow-sm ${
                                    medicines.length === 0 
                                    ? "bg-slate-300 cursor-not-allowed" 
                                    : "bg-blue-600 hover:bg-blue-700 active:scale-98 cursor-pointer shadow-blue-500/20"
                                }`} 
                                disabled={medicines.length === 0}
                            >
                                Save Inventory
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddInventory;