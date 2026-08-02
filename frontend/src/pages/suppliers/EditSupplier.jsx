import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/Api";

function EditSupplier() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [supplier, setSupplier] = useState({
        supplierName: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: ""
    });

    const handleValueChange = (e) => {
        setSupplier({...supplier, [e.target.name]: e.target.value});
    };

    const fetchSupplier = async () => {
        const res = await API.get(`/suppliers/${id}`);
        setSupplier({
            supplierName : res.data.supplierName,
            contactPerson: res.data.contactPerson,
            phone: res.data.phone,
            email : res.data.email,
            address : res.data.address
        });
    };

    useEffect(() => {
        fetchSupplier();
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!supplier.supplierName.trim() || !supplier.contactPerson.trim() || !supplier.phone.trim() || !supplier.email || !supplier.address.trim()) {
            alert("Please enter all field");
            return;
        }

        try {
            await API.put(`/suppliers/${id}`, supplier);
            alert("Supplier updated Successfully");
            navigate("/dashboard/suppliers");
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
                <button onClick={() => navigate("/dashboard/suppliers")} className="flex items-center gap-2 text-blue-600 mb-3 border px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer transition">
                    <ArrowLeft/>
                    Back
                </button>
                <div>
                    <h1 className="text-3xl font-bold">Edit Supplier</h1>
                    <p className="text-gray-500">Edit a supplier to the inventory</p>
                </div>
            </div>
            <div className="mt-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="supplierName" className="block w-max mb-2 font-medium">Supplier Name</label>
                            <input type="text" placeholder="Enter supplier name" id="supplierName" className="w-full border rounded-lg p-3" name="supplierName" value={supplier.supplierName} onChange={handleValueChange}/>
                        </div>
                        <div>
                            <label htmlFor="contactPerson" className="block w-max mb-2 font-medium">Contact Person</label>
                            <input type="text" placeholder="Enter contact-person name" id="contactPerson" className="w-full border rounded-lg p-3" name="contactPerson" value={supplier.contactPerson} onChange={handleValueChange}/>
                        </div>
                        <div>
                            <label htmlFor="PhoneNo" className="block w-max mb-2 font-medium">Phone Number</label>
                            <input type="text" placeholder="Enter phone number" id="PhoneNo" className="w-full border rounded-lg p-3" name="phone" value={supplier.phone} onChange={handleValueChange}/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block w-max mb-2 font-medium">Email</label>
                            <input type="email" placeholder="Enter email" id="email" className="w-full border rounded-lg p-3" name="email" value={supplier.email} onChange={handleValueChange}/>
                        </div>
                        <div>
                            <label htmlFor="address" className="block w-max mb-2 font-medium">Address</label>
                            <input type="text" placeholder="Enter address" id="address" className="w-full border rounded-lg p-3" name="address" value={supplier.address} onChange={handleValueChange}/>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition" >
                                Save Supplier
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditSupplier;