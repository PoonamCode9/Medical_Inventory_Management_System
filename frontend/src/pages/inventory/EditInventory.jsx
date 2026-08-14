import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/Api";
import toast from "react-hot-toast";

function EditInventory() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [inventory, setInventory] = useState({
        medicine: {},
        quantity: ""
    });

    const handleValueChange = (e) => {
        setInventory({...inventory, quantity: e.target.value});
    }

    const fetchInventory = async() => {
        try {
            const res = await API.get(`/inventory/${id}`);
            setInventory(res.data);
        }
        catch(error) {
            console.log(error);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if(!inventory.quantity || Number(inventory.quantity) < 0) {
            toast.error("Please enter valid quantity");
            return;
        }

        try {
            await API.put(`/inventory/${id}`, { quantity: Number(inventory.quantity) });
            toast.success("Inventory updated successfully");
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
    }

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <div className="p-6">
            <div>
                <button onClick={() => navigate("/dashboard/inventory")} className="flex items-center gap-2 text-blue-600 mb-3 border px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer transition">
                    <ArrowLeft/>
                    Back
                </button>
                <div>
                    <h1 className="text-3xl font-bold">Edit Inventory</h1>
                    <p className="text-gray-500">Update medicine quantity</p>
                </div>
            </div>
            <div className="mt-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="medicine" className="block w-max mb-2 font-medium">Medicine</label>
                            <input type="text" className="w-full border rounded-lg p-3" value={inventory.medicine?.medicineName || ""} disabled></input>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block w-max mb-2 font-medium">Quantity</label>
                            <input type="number" placeholder="Enter quantity" id="quantity" className="w-full border rounded-lg p-3" name="quantity" value={inventory.quantity} onChange={handleValueChange}/>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition">
                                Update Inventory
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditInventory;