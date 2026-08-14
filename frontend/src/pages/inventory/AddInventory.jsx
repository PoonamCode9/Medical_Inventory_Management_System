import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/Api";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

function AddInventory() {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [inventory, setInventory] = useState({
        medicineId: "", 
        quantity: ""
    });

    const fetchMedicines =  async () => {
        try {
            const response = await API.get("/inventory/available-medicines");
            setMedicines(response.data);
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
        <div className="p-6">
            <div>
                <button onClick={() => navigate("/dashboard/inventory")} className="flex items-center gap-2 text-blue-600 mb-3 border px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer transition">
                    <ArrowLeft/>
                    Back
                </button>
                <div>
                    <h1 className="text-3xl font-bold">Add Inventory</h1>
                    <p className="text-gray-500">Add medicine stock</p>
                </div>
            </div>
            <div className="mt-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="medicine" className="block w-max mb-2 font-medium">Medicine</label>
                            <select id="medicine" className="w-full border rounded-lg p-3" name="medicineId" value={inventory.medicineId} onChange={handleValueChange}>
                                <option value="" disabled>Select Medicine</option>
                                {
                                    medicines.map((medicine) => (
                                        <option key={medicine.medicineId} value={medicine.medicineId}>{medicine.medicineName}</option>
                                    ))
                                }
                            </select>
                            {medicines.length === 0 && (
                                <p className="text-red-500 mt-2">No medicines available to add inventory</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block w-max mb-2 font-medium">Quantity</label>
                            <input type="number" placeholder="Enter quantity" id="quantity" className="w-full border rounded-lg p-3" name="quantity" value={inventory.quantity} onChange={handleValueChange}/>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className={`px-6 py-3 rounded-lg text-white font-medium transition ${medicines.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-70 cursor-pointer"}`} disabled={medicines.length === 0}>
                                Save Inventory
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddInventory;