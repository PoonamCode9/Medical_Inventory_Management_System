import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/Api";
import { 
    ArrowLeft, 
    Truck, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    PlusCircle 
} from "lucide-react";
import toast from "react-hot-toast";

function AddSupplier() {
    const navigate = useNavigate();

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

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!supplier.supplierName.trim() || !supplier.contactPerson.trim() || !supplier.phone.trim() || !supplier.email.trim() || !supplier.address.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            await API.post("/suppliers", supplier);
            toast.success("Supplier added successfully");
            navigate("/dashboard/suppliers");
        }
        catch(error) {
            console.log(error);
            if(error.response) {
                toast.error(typeof error.response.data === "string" ? error.response.data : "Failed to add supplier");
            }
            else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <div className="w-full pb-10 min-h-screen bg-slate-50/60 p-6 font-sans antialiased">
            <div>
                <button 
                    onClick={() => navigate("/dashboard/suppliers")} 
                    className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-4 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition shadow-xs"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add Supplier</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Add a new supplier to the inventory</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="mt-6 w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        <div>
                            <label htmlFor="supplierName" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Truck className="w-4 h-4 text-blue-600" />
                                Supplier Name
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter supplier name" 
                                id="supplierName" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                                name="supplierName" 
                                value={supplier.supplierName} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="contactPerson" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <User className="w-4 h-4 text-blue-600" />
                                Contact Person
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter contact person name" 
                                id="contactPerson" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                                name="contactPerson" 
                                value={supplier.contactPerson} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="PhoneNo" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Phone className="w-4 h-4 text-blue-600" />
                                Phone Number
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter phone number" 
                                id="PhoneNo" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                                name="phone" 
                                value={supplier.phone} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                placeholder="Enter email address" 
                                id="email" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                                name="email" 
                                value={supplier.email} 
                                onChange={handleValueChange}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="address" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Address
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter full address" 
                                id="address" 
                                className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                                name="address" 
                                value={supplier.address} 
                                onChange={handleValueChange}
                            />
                        </div>

                    </div>

                    <div className="flex justify-end pt-6">
                        <button 
                            type="submit" 
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 cursor-pointer transition shadow-sm shadow-blue-500/20"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Save Supplier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSupplier;