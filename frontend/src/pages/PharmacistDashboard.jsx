import {
    useEffect,
    useState,
    useCallback
} from "react";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";


// ================= COMPONENTS =================

import DashboardCard from "../components/admin/DashboardCard";
import LowStockCard from "../components/admin/LowStockCard";
import ExpiryCard from "../components/admin/ExpiryCard";
import NotificationPanel from "../components/admin/NotificationPanel";


// =========================================================
// PHARMACIST DASHBOARD
// =========================================================

function PharmacistDashboard() {

    const navigate = useNavigate();

    const API = "http://localhost:8080";


    // ================= STATES =================

    const [dashboard, setDashboard] = useState({

        totalMedicines: 0,
        totalStock: 0,
        lowStockCount: 0,
        expiredCount: 0,
        salesToday: 0

    });


    const [lowStock, setLowStock] = useState([]);

    const [expiry, setExpiry] = useState([]);

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);


    // ================= TOKEN CONFIG =================

    const getConfig = () => {

        const token =
            localStorage.getItem("token");

        return {

            headers: {

                Authorization:
                    `Bearer ${token}`

            }

        };

    };


    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    const loadDashboard = useCallback(async () => {

        try {

            const config = getConfig();


            // ================= SUMMARY =================

            const summary = await axios.get(

                `${API}/api/dashboard/summary`,

                config

            );


            setDashboard({

                totalMedicines:
                    summary.data.totalMedicines || 0,

                totalStock:
                    summary.data.totalStock || 0,

                lowStockCount:
                    summary.data.lowStockCount || 0,

                expiredCount:
                    summary.data.expiredCount || 0,

                salesToday:
                    summary.data.salesToday || 0

            });


            // ================= LOW STOCK =================

            const lowResponse = await axios.get(

                `${API}/api/dashboard/low-stock`,

                config

            );


            setLowStock(

                lowResponse.data || []

            );


            // ================= EXPIRY =================

            const expiryResponse = await axios.get(

                `${API}/api/dashboard/expiry-alerts`,

                config

            );


            setExpiry(

                expiryResponse.data || []

            );


            // ================= NOTIFICATIONS =================

            const notificationResponse = await axios.get(

                `${API}/api/notifications`,

                config

            );


            setNotifications(

                notificationResponse.data || []

            );

        }

        catch (error) {

            console.log(

                "Pharmacist Dashboard Error",

                error.response?.data ||
                error.message

            );

        }

        finally {

            setLoading(false);

        }

    }, []);


    // =========================================================
    // AUTO REFRESH
    // =========================================================

    useEffect(() => {

        loadDashboard();


        const timer = setInterval(() => {

            loadDashboard();

        }, 10000);


        return () => {

            clearInterval(timer);

        };

    }, [loadDashboard]);


    // =========================================================
    // ACTIONS
    // =========================================================

    const openSell = () => {

        navigate("/pharmacist/sell");

    };


    const openStock = () => {

        navigate("/pharmacist/stock");

    };


    const openExpiry = () => {

        navigate("/pharmacist/expiry");

    };


    const openSales = () => {

        navigate("/pharmacist/sales");

    };


    // =========================================================
    // LOADING UI
    // =========================================================

    if (loading) {

        return (

            <div className="
                min-h-[calc(100vh-80px)]
                bg-slate-50
                flex
                items-center
                justify-center
            ">

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    border
                    border-slate-200
                    px-10
                    py-8
                    text-center
                ">

                    <div className="
                        w-12
                        h-12
                        mx-auto
                        mb-4
                        border-4
                        border-blue-100
                        border-t-blue-600
                        rounded-full
                        animate-spin
                    " />

                    <h2 className="
                        text-lg
                        font-bold
                        text-slate-800
                    ">

                        Loading Dashboard

                    </h2>


                    <p className="
                        text-sm
                        text-slate-500
                        mt-1
                    ">

                        Fetching pharmacy information...

                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="
            min-h-screen
            bg-slate-50
            p-5
            md:p-7
            lg:p-8
        ">


            <div className="
                max-w-[1500px]
                mx-auto
            ">


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-3xl
                    shadow-sm
                    px-6
                    py-6
                    md:px-8
                    md:py-7
                    mb-7
                ">

                    <div className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        gap-5
                    ">


                        {/* LEFT */}

                        <div className="
                            flex
                            items-center
                            gap-4
                        ">

                            <div className="
                                w-16
                                h-16
                                rounded-2xl
                                bg-blue-600
                                flex
                                items-center
                                justify-center
                                shadow-md
                                text-white
                                text-3xl
                            ">

                                💊

                            </div>


                            <div>

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                    uppercase
                                    tracking-wider
                                ">

                                    MediStock

                                </p>


                                <h1 className="
                                    text-2xl
                                    md:text-3xl
                                    font-extrabold
                                    text-slate-800
                                    mt-1
                                ">

                                    Pharmacist Dashboard

                                </h1>


                                <p className="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                ">

                                    Manage medicines, inventory,
                                    sales and expiry alerts.

                                </p>

                            </div>

                        </div>


                        {/* RIGHT */}

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                                bg-green-50
                                border
                                border-green-200
                                text-green-700
                                px-4
                                py-2
                                rounded-xl
                                text-sm
                                font-semibold
                            ">

                                <span className="
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-green-500
                                " />

                                System Active

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                ">


                    <DashboardCard

                        icon="medicine"

                        title="Total Medicines"

                        value={
                            dashboard.totalMedicines
                        }

                        color="bg-blue-600"

                    />


                    <DashboardCard

                        icon="box"

                        title="Available Stock"

                        value={
                            dashboard.totalStock
                        }

                        color="bg-purple-600"

                    />


                    <DashboardCard

                        icon="warning"

                        title="Low Stock"

                        value={
                            dashboard.lowStockCount
                        }

                        color="bg-orange-500"

                    />


                    <DashboardCard

                        icon="warning"

                        title="Expired Medicines"

                        value={
                            dashboard.expiredCount
                        }

                        color="bg-red-600"

                    />

                </div>


                {/* =================================================
                    ALERT SECTION
                ================================================= */}

                <div className="
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-6
                    mt-7
                ">


                    {/* LOW STOCK */}

                    <div className="
                        bg-white
                        rounded-3xl
                        border
                        border-slate-200
                        shadow-sm
                        overflow-hidden
                    ">

                        <LowStockCard

                            medicines={lowStock}

                        />

                    </div>


                    {/* EXPIRY */}

                    <div className="
                        bg-white
                        rounded-3xl
                        border
                        border-slate-200
                        shadow-sm
                        overflow-hidden
                    ">

                        <ExpiryCard

                            medicines={expiry}

                        />

                    </div>

                </div>


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <div className="mt-7">

                    <NotificationPanel

                        notifications={
                            notifications
                        }

                        refreshNotifications={
                            loadDashboard
                        }

                    />

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="
                    bg-white
                    rounded-3xl
                    border
                    border-slate-200
                    shadow-sm
                    p-6
                    md:p-7
                    mt-7
                    mb-8
                ">


                    <div className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-4
                        mb-6
                    ">


                        <div>

                            <h2 className="
                                text-xl
                                md:text-2xl
                                font-extrabold
                                text-slate-800
                            ">

                                Quick Actions

                            </h2>


                            <p className="
                                text-sm
                                text-slate-500
                                mt-1
                            ">

                                Quickly access common pharmacist tasks.

                            </p>

                        </div>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-4
                    ">


                        {/* SELL */}

                        <button

                            onClick={openSell}

                            className="
                                group
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                rounded-2xl
                                p-5
                                text-left
                                transition-all
                                duration-200
                                hover:-translate-y-1
                                hover:shadow-lg
                            "

                        >

                            <div className="
                                text-3xl
                                mb-4
                            ">

                                🛒

                            </div>


                            <h3 className="
                                font-bold
                                text-lg
                            ">

                                Sell Medicine

                            </h3>


                            <p className="
                                text-blue-100
                                text-sm
                                mt-1
                            ">

                                Process a new medicine sale

                            </p>

                        </button>


                        {/* STOCK */}

                        <button

                            onClick={openStock}

                            className="
                                group
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                rounded-2xl
                                p-5
                                text-left
                                transition-all
                                duration-200
                                hover:-translate-y-1
                                hover:shadow-lg
                            "

                        >

                            <div className="
                                text-3xl
                                mb-4
                            ">

                                📦

                            </div>


                            <h3 className="
                                font-bold
                                text-lg
                            ">

                                View Stock

                            </h3>


                            <p className="
                                text-green-100
                                text-sm
                                mt-1
                            ">

                                Check medicine inventory

                            </p>

                        </button>


                        {/* EXPIRY */}

                        <button

                            onClick={openExpiry}

                            className="
                                group
                                bg-red-600
                                hover:bg-red-700
                                text-white
                                rounded-2xl
                                p-5
                                text-left
                                transition-all
                                duration-200
                                hover:-translate-y-1
                                hover:shadow-lg
                            "

                        >

                            <div className="
                                text-3xl
                                mb-4
                            ">

                                ⚠️

                            </div>


                            <h3 className="
                                font-bold
                                text-lg
                            ">

                                Expiry Alerts

                            </h3>


                            <p className="
                                text-red-100
                                text-sm
                                mt-1
                            ">

                                Check medicines nearing expiry

                            </p>

                        </button>


                        {/* SALES */}

                        <button

                            onClick={openSales}

                            className="
                                group
                                bg-purple-600
                                hover:bg-purple-700
                                text-white
                                rounded-2xl
                                p-5
                                text-left
                                transition-all
                                duration-200
                                hover:-translate-y-1
                                hover:shadow-lg
                            "

                        >

                            <div className="
                                text-3xl
                                mb-4
                            ">

                                📄

                            </div>


                            <h3 className="
                                font-bold
                                text-lg
                            ">

                                Sales History

                            </h3>


                            <p className="
                                text-purple-100
                                text-sm
                                mt-1
                            ">

                                View previous medicine sales

                            </p>

                        </button>


                    </div>

                </div>


            </div>

        </div>

    );

}


export default PharmacistDashboard;