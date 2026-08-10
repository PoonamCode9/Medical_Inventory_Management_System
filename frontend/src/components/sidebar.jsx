import { Bell, Boxes, FileText, History, LayoutDashboard, LogOut, Pill, Settings, ShoppingBag, ShoppingCart, TriangleAlert, Truck, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={19} className="text-blue-500" />,
            roles: ["Admin", "Pharmacist", "Staff"]
        },
        {
            name: "Medicines",
            path: "/dashboard/medicines",
            icon: <Pill size={19} className="text-emerald-500" />,
            roles: ["Admin", "Pharmacist", "Staff"]
        },
        {
            name: "Suppliers",
            path: "/dashboard/suppliers",
            icon: <Truck size={19} className="text-amber-500" />,
            roles: ["Admin", "Pharmacist", "Staff"]
        },
        {
            name: "Purchase Orders",
            path: "/dashboard/purchase-orders",
            icon: <ShoppingCart size={19} className="text-orange-500" />,
            roles: ["Admin", "Pharmacist"]
        },
        {
            name: "Inventory",
            path: "/dashboard/inventory",
            icon: <Boxes size={19} className="text-indigo-500" />,
            roles: ["Admin", "Pharmacist", "Staff"]
        },
        {
            name: "Expiry Tracker",
            path: "/dashboard/expiry-tracker",
            icon: <TriangleAlert size={19} className="text-rose-500" />,
            roles: ["Admin", "Pharmacist", "Staff"]
        },
        {
            name: "Dispense / Sale",
            path: "/dashboard/sales",
            icon: <ShoppingBag size={19} className="text-teal-500" />,
            roles: ["Admin", "Pharmacist", "Staff"]
        },
        {
            name: "Stock Logs",
            path: "/dashboard/stock-logs",
            icon: <History size={19} className="text-purple-500" />,
            roles: ["Admin", "Pharmacist", "Staff"]
        },
        {
            name: "Notifications",
            path: "/dashboard/notifications",
            icon: <Bell size={19} className="text-yellow-500" />,
            roles: ["Admin", "Pharmacist", "Staff"]
        },
        {
            name: "Reports",
            path: "/dashboard/reports",
            icon: <FileText size={19} className="text-cyan-500" />,
            roles: ["Admin", "Pharmacist"]
        },
        {
            name: "Users",
            path: "/dashboard/users",
            icon: <Users size={19} className="text-violet-500" />,
            roles: ["Admin"]
        },
        {
            name: "Settings",
            path: "/dashboard/settings",
            icon: <Settings size={19} className="text-slate-500" />,
            roles: ["Admin", "Pharmacist", "Staff"]
        }
    ];

    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");
    const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        navigate("/");
    };

    return (
        <aside className="w-67 bg-white border-r border-gray-100 h-screen flex flex-col justify-between shadow-lg shrink-0 select-none">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2.5">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                    <Pill size={22} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-none">
                        Medi<span className="text-blue-600">stock</span>
                    </h1>
                    <span className="text-[12px] text-gray-400 font-medium tracking-wide">
                        INVENTORY MANAGEMENT
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
                {filteredMenuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                                isActive
                                    ? "bg-blue-100 text-blue-700 font-bold"
                                    : "text-slate-800 hover:bg-blue-50/60 hover:text-blue-600"
                            }`}
                        >
                            <span>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 p-3">
                <button
                    className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors duration-150 cursor-pointer"
                    onClick={handleLogout}
                >
                    <LogOut size={19} className="text-rose-500" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;