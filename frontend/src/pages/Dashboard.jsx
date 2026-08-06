import { useEffect, useState } from "react";
import { AlertTriangle, Building2, Pill, Users, PackageX } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ExpiryAlertsCard from "../components/dashboard/ExpiryAlertsCard";
import LowStockAlerts from "../components/dashboard/LowStockAlerts";
import InventoryChart from "../components/dashboard/InventoryChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import API from "../api/Api";

function Dashboard() {
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");
    const [stats, setStats] = useState({
        totalMedicines: 0,
        totalSuppliers: 0,
        totalUsers: 0,
        lowStock: 0,
        outOfStock: 0 
    });

    const loadDashboardStats = async () => {
        try {
            const res = await API.get("/dashboard/stats");
            setStats(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadDashboardStats();
    }, []);

    return (
        <div className="w-full">
            <div className="mx-6 mt-6 mb-4 p-6 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-100 rounded-2xl shadow-xs flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Welcome Back, <span className="text-blue-600">{role}</span>!
                        </h1>
                        <span className="bg-blue-100 text-blue-700 border border-blue-200 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                            {role}
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                        Manage your medical inventory efficiently.
                    </p>
                </div>
            </div>
            
            {role === "Admin" && (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-7 py-3">
                        <StatCard 
                            title="Total Medicines" 
                            value={stats.totalMedicines} 
                            icon={<Pill size={20} className="text-blue-600" />}
                            iconBg="bg-blue-100"
                            cardBg="from-blue-50/60 to-white"
                            borderColor="border-blue-200"
                        /> 
                        <StatCard 
                            title="Total Suppliers" 
                            value={stats.totalSuppliers} 
                            icon={<Building2 size={20} className="text-emerald-600" />}
                            iconBg="bg-emerald-100"
                            cardBg="from-emerald-50/60 to-white"
                            borderColor="border-emerald-200"
                        />
                        <StatCard 
                            title="Total Users" 
                            value={stats.totalUsers} 
                            icon={<Users size={20} className="text-indigo-600" />}
                            iconBg="bg-indigo-100"
                            cardBg="from-indigo-50/60 to-white"
                            borderColor="border-indigo-200"
                        />
                        <StatCard 
                            title="Low Stock" 
                            value={stats.lowStock} 
                            icon={<AlertTriangle size={20} className="text-amber-600" />}
                            iconBg="bg-amber-100"
                            cardBg="from-amber-50/60 to-white"
                            borderColor="border-amber-200"
                        />
                        <StatCard 
                            title="Out of Stock" 
                            value={stats.outOfStock} 
                            icon={<PackageX size={20} className="text-rose-600" />}
                            iconBg="bg-rose-100"
                            cardBg="from-rose-50/60 to-white"
                            borderColor="border-rose-200"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-6">
                        <InventoryChart/>
                        <CategoryChart/>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-6 p-6">
                        <div className="col-span-3">
                            <ExpiryAlertsCard/>
                        </div>
                        <div className="col-span-2">
                            <LowStockAlerts/>
                        </div>
                    </div>
                </div> 
            )}

            {(role === "Pharmacist" || role === "Staff") && (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-7 py-3">
                        <StatCard 
                            title="Total Medicines" 
                            value={stats.totalMedicines} 
                            icon={<Pill size={20} className="text-blue-600" />}
                            iconBg="bg-blue-100"
                            cardBg="from-blue-50/60 to-white"
                            borderColor="border-blue-200"
                        /> 
                        <StatCard 
                            title="Total Suppliers" 
                            value={stats.totalSuppliers} 
                            icon={<Building2 size={20} className="text-emerald-600" />}
                            iconBg="bg-emerald-100"
                            cardBg="from-emerald-50/60 to-white"
                            borderColor="border-emerald-200"
                        />
                        <StatCard 
                            title="Low Stock" 
                            value={stats.lowStock} 
                            icon={<AlertTriangle size={20} className="text-amber-600" />}
                            iconBg="bg-amber-100"
                            cardBg="from-amber-50/60 to-white"
                            borderColor="border-amber-200"
                        />
                        <StatCard 
                            title="Out of Stock" 
                            value={stats.outOfStock} 
                            icon={<PackageX size={20} className="text-rose-600" />}
                            iconBg="bg-rose-100"
                            cardBg="from-rose-50/60 to-white"
                            borderColor="border-rose-200"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-6">
                        <InventoryChart/>
                        <CategoryChart/>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-6 p-6">
                        <div className="col-span-3">
                            <ExpiryAlertsCard/>
                        </div>
                        <div className="col-span-2">
                            <LowStockAlerts/>
                        </div>
                    </div>
                </div> 
            )}
        </div>
    );
}

export default Dashboard;