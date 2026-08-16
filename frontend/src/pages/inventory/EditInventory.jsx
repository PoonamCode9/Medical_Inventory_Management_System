import { ArrowLeft, Edit3, PackageSearch, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/Api";
import toast from "react-hot-toast";

function EditInventory() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [inventory, setInventory] = useState({
        medicine: {},
        quantity: ""
    });

    const handleValueChange = (e) => {
        setInventory({ ...inventory, quantity: e.target.value });
    };

    const fetchInventory = async () => {
        try {
            const res = await API.get(`/inventory/${id}`);
            setInventory(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inventory.quantity || Number(inventory.quantity) < 0) {
            toast.error("Please enter valid quantity");
            return;
        }

        try {
            await API.put(`/inventory/${id}`, { quantity: Number(inventory.quantity) });
            toast.success("Inventory updated successfully");
            navigate("/dashboard/inventory");
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    useEffect(() => {
        fetchInventory();
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
                        <Edit3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Inventory</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Update medicine quantity</p>
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
                            <input 
                                type="text" 
                                id="medicine"
                                className="w-full text-sm border border-slate-200 rounded-xl p-3 bg-slate-100 text-slate-600 font-medium cursor-not-allowed select-none" 
                                value={
                                    inventory.medicine?.medicineName 
                                        ? `${inventory.medicine.medicineName} ${inventory.medicine.batchNo ? `(${inventory.medicine.batchNo})` : ""}`
                                        : ""
                                } 
                                disabled
                            />
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
                                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 cursor-pointer transition shadow-sm shadow-blue-500/20"
                            >
                                Update Inventory
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditInventory;