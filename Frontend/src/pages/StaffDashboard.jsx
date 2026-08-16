import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import {
    FaBoxOpen,
    FaPills,
    FaExclamationTriangle,
    FaBell,
    FaCalendarTimes,
    FaWarehouse,
    FaArrowRight,
    FaSyncAlt
} from "react-icons/fa";


function StaffDashboard() {

    const navigate = useNavigate();

    const API = "http://localhost:8080";


    // ==================================================
    // STATES
    // ==================================================

    const [dashboard, setDashboard] = useState({

        totalMedicines: 0,

        totalStock: 0,

        lowStockCount: 0,

        expiredCount: 0,

        nearExpiryCount: 0,

        notifications: 0

    });


    const [loading, setLoading] = useState(true);

    const [lastUpdated, setLastUpdated] = useState(null);



    // ==================================================
    // FETCH DASHBOARD
    // ==================================================

    const fetchDashboard = async () => {

        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                navigate("/");

                return;

            }


            const response = await axios.get(

                `${API}/api/dashboard/summary`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );


            console.log(
                "Staff Dashboard:",
                response.data
            );


            setDashboard({

                totalMedicines:
                    response.data.totalMedicines || 0,

                totalStock:
                    response.data.totalStock || 0,

                lowStockCount:
                    response.data.lowStockCount || 0,

                expiredCount:
                    response.data.expiredCount || 0,

                nearExpiryCount:
                    response.data.nearExpiryCount || 0,

                notifications:
                    response.data.notifications || 0

            });


            setLastUpdated(
                new Date()
            );


        }

        catch (error) {

            console.error(

                "Staff Dashboard Error:",

                error.response?.status,

                error.response?.data ||
                error.message

            );


            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                localStorage.removeItem("token");

                navigate("/");

            }

        }

        finally {

            setLoading(false);

        }

    };



    // ==================================================
    // LOAD + AUTO REFRESH
    // ==================================================

    useEffect(() => {

        fetchDashboard();


        const interval = setInterval(

            fetchDashboard,

            5000

        );


        return () => {

            clearInterval(interval);

        };

    }, []);



    // ==================================================
    // MANUAL REFRESH
    // ==================================================

    const handleRefresh = () => {

        setLoading(true);

        fetchDashboard();

    };



    // ==================================================
    // UPDATE STOCK
    // ==================================================

    const openUpdateStock = () => {

        navigate("/staff/update-stock");

    };



    // ==================================================
    // NOTIFICATIONS
    // ==================================================

    const openNotifications = () => {

        navigate("/staff/notifications");

    };



    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="
                min-h-[70vh]
                flex
                items-center
                justify-center
            ">

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-10
                    text-center
                    border
                    border-gray-100
                ">

                    <div className="
                        w-16
                        h-16
                        mx-auto
                        mb-5
                        rounded-full
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                    ">

                        <FaWarehouse className="
                            text-blue-600
                            text-2xl
                            animate-pulse
                        " />

                    </div>


                    <h2 className="
                        text-2xl
                        font-bold
                        text-blue-800
                    ">

                        Loading Staff Dashboard...

                    </h2>


                    <p className="
                        text-gray-500
                        mt-2
                    ">

                        Fetching inventory information

                    </p>

                </div>

            </div>

        );

    }



    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="w-full">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="
                mb-8
                bg-white
                rounded-3xl
                p-6
                md:p-8
                shadow-lg
                border
                border-gray-100
            ">

                <div className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-6
                ">


                    {/* LEFT */}

                    <div>

                        <div className="
                            flex
                            items-center
                            gap-4
                            mb-3
                        ">

                            <div className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-blue-100
                                flex
                                items-center
                                justify-center
                            ">

                                <FaWarehouse className="
                                    text-blue-600
                                    text-2xl
                                " />

                            </div>


                            <div>

                                <h1 className="
                                    text-3xl
                                    md:text-4xl
                                    font-bold
                                    text-blue-800
                                ">

                                    Staff Dashboard

                                </h1>


                                <p className="
                                    text-gray-500
                                    mt-1
                                ">

                                    Manage medicine stock and
                                    inventory operations

                                </p>

                            </div>

                        </div>

                    </div>



                    {/* RIGHT */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        items-start
                        sm:items-center
                        gap-3
                    ">


                        {/* STATUS */}

                        <div className="
                            bg-green-50
                            border
                            border-green-200
                            rounded-xl
                            px-5
                            py-3
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <span className="
                                    w-2.5
                                    h-2.5
                                    bg-green-500
                                    rounded-full
                                    animate-pulse
                                " />

                                <span className="
                                    text-sm
                                    font-semibold
                                    text-green-700
                                ">

                                    Inventory Active

                                </span>

                            </div>

                        </div>



                        {/* REFRESH */}

                        <button

                            onClick={handleRefresh}

                            className="
                                flex
                                items-center
                                gap-2
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                font-semibold
                                shadow-md
                                transition
                            "

                        >

                            <FaSyncAlt />

                            Refresh

                        </button>

                    </div>

                </div>



                {/* LAST UPDATED */}

                {lastUpdated && (

                    <div className="
                        mt-5
                        pt-4
                        border-t
                        border-gray-100
                        text-sm
                        text-gray-500
                    ">

                        Last updated:{" "}

                        {lastUpdated.toLocaleTimeString()}

                    </div>

                )}

            </div>



            {/* ==================================================
                DASHBOARD CARDS
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-6
            ">


                {/* TOTAL MEDICINES */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-lg
                    border
                    border-gray-100
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-gray-500
                                text-sm
                                font-medium
                            ">

                                Total Medicines

                            </p>


                            <h2 className="
                                text-3xl
                                font-bold
                                text-cyan-700
                                mt-2
                            ">

                                {dashboard.totalMedicines}

                            </h2>


                            <p className="
                                text-xs
                                text-gray-400
                                mt-2
                            ">

                                Medicine types

                            </p>

                        </div>


                        <div className="
                            w-14
                            h-14
                            rounded-xl
                            bg-cyan-100
                            flex
                            items-center
                            justify-center
                        ">

                            <FaPills className="
                                text-cyan-600
                                text-2xl
                            " />

                        </div>

                    </div>

                </div>



                {/* AVAILABLE STOCK */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-lg
                    border
                    border-gray-100
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-gray-500
                                text-sm
                                font-medium
                            ">

                                Available Stock

                            </p>


                            <h2 className="
                                text-3xl
                                font-bold
                                text-blue-700
                                mt-2
                            ">

                                {dashboard.totalStock}

                            </h2>


                            <p className="
                                text-xs
                                text-gray-400
                                mt-2
                            ">

                                Total units

                            </p>

                        </div>


                        <div className="
                            w-14
                            h-14
                            rounded-xl
                            bg-blue-100
                            flex
                            items-center
                            justify-center
                        ">

                            <FaBoxOpen className="
                                text-blue-600
                                text-2xl
                            " />

                        </div>

                    </div>

                </div>



                {/* LOW STOCK */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-lg
                    border
                    border-gray-100
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-gray-500
                                text-sm
                                font-medium
                            ">

                                Low Stock

                            </p>


                            <h2 className="
                                text-3xl
                                font-bold
                                text-orange-600
                                mt-2
                            ">

                                {dashboard.lowStockCount}

                            </h2>


                            <p className="
                                text-xs
                                text-gray-400
                                mt-2
                            ">

                                Need restocking

                            </p>

                        </div>


                        <div className="
                            w-14
                            h-14
                            rounded-xl
                            bg-orange-100
                            flex
                            items-center
                            justify-center
                        ">

                            <FaExclamationTriangle
                                className="
                                    text-orange-600
                                    text-2xl
                                "
                            />

                        </div>

                    </div>

                </div>



                {/* EXPIRED */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-lg
                    border
                    border-gray-100
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-gray-500
                                text-sm
                                font-medium
                            ">

                                Expired Medicines

                            </p>


                            <h2 className="
                                text-3xl
                                font-bold
                                text-red-600
                                mt-2
                            ">

                                {dashboard.expiredCount}

                            </h2>


                            <p className="
                                text-xs
                                text-gray-400
                                mt-2
                            ">

                                Require attention

                            </p>

                        </div>


                        <div className="
                            w-14
                            h-14
                            rounded-xl
                            bg-red-100
                            flex
                            items-center
                            justify-center
                        ">

                            <FaCalendarTimes
                                className="
                                    text-red-600
                                    text-2xl
                                "
                            />

                        </div>

                    </div>

                </div>

            </div>



            {/* ==================================================
                ALERTS
            ================================================== */}

            <div className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-6
                mt-8
            ">


                {/* LOW STOCK */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-lg
                    border
                    border-gray-100
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        mb-5
                    ">


                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-orange-100
                                flex
                                items-center
                                justify-center
                            ">

                                <FaExclamationTriangle
                                    className="
                                        text-orange-500
                                    "
                                />

                            </div>


                            <div>

                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-gray-800
                                ">

                                    Low Stock Alerts

                                </h2>


                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    Medicines that need restocking

                                </p>

                            </div>

                        </div>


                        <span className="
                            bg-orange-100
                            text-orange-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-semibold
                        ">

                            {dashboard.lowStockCount}

                        </span>

                    </div>


                    {dashboard.lowStockCount > 0 ? (

                        <div className="
                            p-4
                            rounded-xl
                            bg-orange-50
                            border
                            border-orange-100
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            ">

                                <p className="
                                    text-orange-700
                                    font-medium
                                ">

                                    ⚠️ Medicines require
                                    restocking.

                                </p>


                                <button

                                    onClick={openUpdateStock}

                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        bg-orange-500
                                        hover:bg-orange-600
                                        text-white
                                        px-4
                                        py-2
                                        rounded-lg
                                        text-sm
                                        font-semibold
                                        transition
                                    "

                                >

                                    Update Stock

                                    <FaArrowRight />

                                </button>

                            </div>

                        </div>

                    ) : (

                        <div className="
                            p-4
                            rounded-xl
                            bg-green-50
                            border
                            border-green-100
                            text-green-700
                            font-medium
                        ">

                            ✅ No Low Stock Medicines

                        </div>

                    )}

                </div>



                {/* EXPIRY */}

                <div className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-lg
                    border
                    border-gray-100
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        mb-5
                    ">


                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-red-100
                                flex
                                items-center
                                justify-center
                            ">

                                <FaCalendarTimes
                                    className="
                                        text-red-500
                                    "
                                />

                            </div>


                            <div>

                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-gray-800
                                ">

                                    Expiry Alerts

                                </h2>


                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    Medicines requiring attention

                                </p>

                            </div>

                        </div>


                        <span className="
                            bg-red-100
                            text-red-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-semibold
                        ">

                            {dashboard.expiredCount}

                        </span>

                    </div>


                    {dashboard.expiredCount > 0 ? (

                        <div className="
                            p-4
                            rounded-xl
                            bg-red-50
                            border
                            border-red-100
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            ">

                                <p className="
                                    text-red-700
                                    font-medium
                                ">

                                    ⚠️ Expired medicines
                                    require attention.

                                </p>


                                <button

                                    onClick={() =>
                                        navigate("/pharmacist/expiry")
                                    }

                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        px-4
                                        py-2
                                        rounded-lg
                                        text-sm
                                        font-semibold
                                        transition
                                    "

                                >

                                    Check

                                    <FaArrowRight />

                                </button>

                            </div>

                        </div>

                    ) : (

                        <div className="
                            p-4
                            rounded-xl
                            bg-green-50
                            border
                            border-green-100
                            text-green-700
                            font-medium
                        ">

                            ✅ No Expiry Alerts

                        </div>

                    )}

                </div>

            </div>



            {/* ==================================================
                STAFF ACTIONS
            ================================================== */}

            <div className="mt-8">


                <div className="
                    flex
                    items-center
                    justify-between
                    mb-5
                ">

                    <div>

                        <h2 className="
                            text-2xl
                            font-bold
                            text-gray-800
                        ">

                            Staff Actions

                        </h2>


                        <p className="
                            text-gray-500
                            text-sm
                            mt-1
                        ">

                            Manage inventory operations

                        </p>

                    </div>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                ">


                    {/* UPDATE STOCK */}

                    <button

                        onClick={openUpdateStock}

                        className="
                            bg-white
                            rounded-2xl
                            p-6
                            shadow-lg
                            border
                            border-gray-100
                            hover:shadow-xl
                            hover:-translate-y-1
                            transition-all
                            duration-300
                            text-left
                            group
                        "

                    >

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">


                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-14
                                    h-14
                                    rounded-xl
                                    bg-blue-100
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <FaWarehouse
                                        className="
                                            text-blue-600
                                            text-2xl
                                        "
                                    />

                                </div>


                                <div>

                                    <h3 className="
                                        text-lg
                                        font-bold
                                        text-gray-800
                                    ">

                                        Update Stock

                                    </h3>


                                    <p className="
                                        text-sm
                                        text-gray-500
                                        mt-1
                                    ">

                                        Add or update medicine stock

                                    </p>

                                </div>

                            </div>


                            <FaArrowRight className="
                                text-gray-400
                                group-hover:text-blue-600
                                group-hover:translate-x-1
                                transition
                            " />

                        </div>

                    </button>



                    {/* NOTIFICATIONS */}

                    <button

                        onClick={openNotifications}

                        className="
                            bg-white
                            rounded-2xl
                            p-6
                            shadow-lg
                            border
                            border-gray-100
                            hover:shadow-xl
                            hover:-translate-y-1
                            transition-all
                            duration-300
                            text-left
                            group
                        "

                    >

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">


                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-14
                                    h-14
                                    rounded-xl
                                    bg-purple-100
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <FaBell className="
                                        text-purple-600
                                        text-2xl
                                    " />

                                </div>


                                <div>

                                    <h3 className="
                                        text-lg
                                        font-bold
                                        text-gray-800
                                    ">

                                        Notifications

                                    </h3>


                                    <p className="
                                        text-sm
                                        text-gray-500
                                        mt-1
                                    ">

                                        View inventory notifications

                                    </p>

                                </div>

                            </div>


                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <span className="
                                    min-w-8
                                    h-8
                                    px-2
                                    rounded-full
                                    bg-purple-100
                                    text-purple-700
                                    flex
                                    items-center
                                    justify-center
                                    font-bold
                                ">

                                    {dashboard.notifications}

                                </span>


                                <FaArrowRight className="
                                    text-gray-400
                                    group-hover:text-purple-600
                                    group-hover:translate-x-1
                                    transition
                                " />

                            </div>

                        </div>

                    </button>



                    {/* STOCK OVERVIEW */}

                    <button

                        onClick={openUpdateStock}

                        className="
                            bg-white
                            rounded-2xl
                            p-6
                            shadow-lg
                            border
                            border-gray-100
                            hover:shadow-xl
                            hover:-translate-y-1
                            transition-all
                            duration-300
                            text-left
                            group
                        "

                    >

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">


                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-14
                                    h-14
                                    rounded-xl
                                    bg-green-100
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <FaBoxOpen className="
                                        text-green-600
                                        text-2xl
                                    " />

                                </div>


                                <div>

                                    <h3 className="
                                        text-lg
                                        font-bold
                                        text-gray-800
                                    ">

                                        Stock Overview

                                    </h3>


                                    <p className="
                                        text-sm
                                        text-gray-500
                                        mt-1
                                    ">

                                        View and manage inventory

                                    </p>

                                </div>

                            </div>


                            <FaArrowRight className="
                                text-gray-400
                                group-hover:text-green-600
                                group-hover:translate-x-1
                                transition
                            " />

                        </div>

                    </button>

                </div>

            </div>



            {/* ==================================================
                NOTIFICATION SUMMARY
            ================================================== */}

            <div className="
                mt-8
                mb-8
                bg-white
                rounded-2xl
                p-6
                shadow-lg
                border
                border-gray-100
            ">


                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-5
                ">


                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            w-12
                            h-12
                            rounded-xl
                            bg-purple-100
                            flex
                            items-center
                            justify-center
                        ">

                            <FaBell className="
                                text-purple-600
                                text-xl
                            " />

                        </div>


                        <div>

                            <h2 className="
                                text-xl
                                font-bold
                                text-gray-800
                            ">

                                Notifications

                            </h2>


                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Pending inventory notifications

                            </p>

                        </div>

                    </div>


                    <button

                        onClick={openNotifications}

                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                            transition
                        "

                    >

                        <span>

                            {dashboard.notifications}

                        </span>

                        View Notifications

                        <FaArrowRight />

                    </button>

                </div>

            </div>

        </div>

    );

}


export default StaffDashboard;