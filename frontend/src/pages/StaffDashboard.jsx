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
    FaSyncAlt,
    FaClipboardList
} from "react-icons/fa";



function StaffDashboard(){


    const navigate = useNavigate();


    const API = "http://localhost:8080";



    // ==================================================
    // DASHBOARD STATE
    // ==================================================

    const [dashboard,setDashboard] = useState({

        totalMedicines:0,

        totalStock:0,

        lowStockCount:0,

        expiredCount:0,

        nearExpiryCount:0,

        notifications:0

    });



    const [loading,setLoading] = useState(true);


    const [lastUpdated,setLastUpdated] = useState(null);





    // ==================================================
    // FETCH DASHBOARD DATA
    // ==================================================

    const fetchDashboard = async()=>{


        try{


            const token =
                localStorage.getItem("token");



            if(!token){

                navigate("/");

                return;

            }




            const response =
                await axios.get(

                    `${API}/api/dashboard/summary`,

                    {

                        headers:{

                            Authorization:
                            `Bearer ${token}`

                        }

                    }

                );



            console.log(
                "Staff Dashboard Data",
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


        catch(error){


            console.error(

                "Staff Dashboard Error",

                error.response?.data ||
                error.message

            );



            if(

                error.response?.status===401 ||

                error.response?.status===403

            ){

                localStorage.removeItem("token");

                navigate("/");

            }


        }


        finally{


            setLoading(false);


        }


    };






    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(()=>{


        fetchDashboard();



        const interval =
            setInterval(

                fetchDashboard,

                10000

            );



        return()=>{


            clearInterval(interval);


        };


    },[]);






    // ==================================================
    // REFRESH
    // ==================================================

    const refreshDashboard = ()=>{


        setLoading(true);


        fetchDashboard();


    };






    // ==================================================
    // NAVIGATION
    // ==================================================

    const viewMedicines = ()=>{

        navigate("/staff/medicines");

    };



    const viewNotifications = ()=>{

        navigate("/staff/notifications");

    };







    // ==================================================
    // LOADING UI
    // ==================================================

    if(loading){


        return(

            <div className="
                min-h-[70vh]
                flex
                justify-center
                items-center
            ">


                <div className="
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-10
                    text-center
                ">


                    <FaWarehouse

                        className="
                        mx-auto
                        text-blue-600
                        text-4xl
                        animate-pulse
                        "

                    />



                    <h2 className="
                        mt-5
                        text-2xl
                        font-bold
                        text-blue-800
                    ">

                        Loading Staff Dashboard

                    </h2>



                    <p className="
                        text-gray-500
                        mt-2
                    ">

                        Fetching inventory status

                    </p>



                </div>



            </div>


        );


    }






    // ==================================================
    // MAIN UI
    // ==================================================

    return(


        <div className="w-full">



            {/* HEADER */}


            <div className="
                bg-white
                rounded-3xl
                shadow-lg
                border
                p-6
                mb-8
            ">



                <div className="
                    flex
                    flex-col
                    lg:flex-row
                    justify-between
                    gap-5
                ">



                    <div className="
                        flex
                        items-center
                        gap-4
                    ">



                        <div className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-blue-100
                            flex
                            items-center
                            justify-center
                        ">


                            <FaWarehouse

                                className="
                                text-blue-600
                                text-3xl
                                "

                            />


                        </div>




                        <div>


                            <h1 className="
                                text-4xl
                                font-bold
                                text-blue-800
                            ">


                                Staff Dashboard


                            </h1>



                            <p className="
                                text-gray-500
                                mt-1
                            ">


                                View inventory information only


                            </p>



                        </div>




                    </div>





                    <button

                        onClick={refreshDashboard}

                        className="
                            flex
                            items-center
                            gap-2
                            bg-blue-600
                            text-white
                            px-5
                            py-3
                            rounded-xl
                            font-semibold
                            hover:bg-blue-700
                        "

                    >

                        <FaSyncAlt/>

                        Refresh

                    </button>




                </div>





                {
                    lastUpdated &&

                    <p className="
                        mt-5
                        text-sm
                        text-gray-500
                        border-t
                        pt-4
                    ">

                        Last Updated :
                        {" "}
                        {lastUpdated.toLocaleTimeString()}

                    </p>

                }



            </div>
                        {/* ==================================================
                STATISTICS CARDS
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
                    hover:shadow-xl
                    transition
                ">


                    <div className="
                        flex
                        justify-between
                        items-center
                    ">


                        <div>


                            <p className="
                                text-gray-500
                                text-sm
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

                                Available medicine types

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
                            "/>


                        </div>


                    </div>


                </div>







                {/* TOTAL STOCK */}


                <div className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-lg
                    border
                    hover:shadow-xl
                    transition
                ">


                    <div className="
                        flex
                        justify-between
                        items-center
                    ">



                        <div>


                            <p className="
                                text-gray-500
                                text-sm
                            ">

                                Stock Quantity

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

                                Total available units

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
                            "/>


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
                    hover:shadow-xl
                    transition
                ">



                    <div className="
                        flex
                        justify-between
                        items-center
                    ">


                        <div>


                            <p className="
                                text-gray-500
                                text-sm
                            ">

                                Low Stock Alerts

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

                                Medicines requiring attention

                            </p>


                        </div>




                        <div className="
                            w-14
                            h-14
                            rounded-xl
                            bg-orange-100
                            flex
                            justify-center
                            items-center
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








                {/* EXPIRY */}


                <div className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-lg
                    border
                    hover:shadow-xl
                    transition
                ">


                    <div className="
                        flex
                        justify-between
                        items-center
                    ">



                        <div>


                            <p className="
                                text-gray-500
                                text-sm
                            ">

                                Expiry Alerts

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

                                Expired medicines

                            </p>



                        </div>




                        <div className="
                            w-14
                            h-14
                            rounded-xl
                            bg-red-100
                            flex
                            justify-center
                            items-center
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
                ALERT SUMMARY
            ================================================== */}



            <div className="
                grid
                lg:grid-cols-2
                gap-6
                mt-8
            ">





                {/* LOW STOCK ALERT */}


                <div className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    border
                    p-6
                ">



                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-4
                    ">



                        <div className="
                            w-12
                            h-12
                            bg-orange-100
                            rounded-xl
                            flex
                            items-center
                            justify-center
                        ">


                            <FaExclamationTriangle

                                className="
                                text-orange-600
                                "

                            />


                        </div>




                        <div>


                            <h2 className="
                                font-bold
                                text-xl
                            ">


                                Low Stock Alerts


                            </h2>



                            <p className="
                                text-sm
                                text-gray-500
                            ">


                                Monitoring required


                            </p>


                        </div>



                    </div>





                    {
                        dashboard.lowStockCount > 0 ?

                        (

                            <div className="
                                bg-orange-50
                                border
                                border-orange-200
                                rounded-xl
                                p-4
                                text-orange-700
                                font-medium
                            ">


                                ⚠️ {dashboard.lowStockCount}
                                medicines have low stock.


                            </div>

                        )

                        :

                        (

                            <div className="
                                bg-green-50
                                border
                                border-green-200
                                rounded-xl
                                p-4
                                text-green-700
                            ">


                                ✅ No low stock medicines


                            </div>

                        )

                    }


                </div>
                



                {/* EXPIRY ALERT */}


                <div className="
                    bg-white
                    rounded-2xl
                    shadow-lg
                    border
                    p-6
                ">



                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-4
                    ">


                        <div className="
                            w-12
                            h-12
                            bg-red-100
                            rounded-xl
                            flex
                            items-center
                            justify-center
                        ">


                            <FaCalendarTimes

                                className="
                                text-red-600
                                "

                            />


                        </div>




                        <div>


                            <h2 className="
                                font-bold
                                text-xl
                            ">


                                Expiry Alerts


                            </h2>



                            <p className="
                                text-sm
                                text-gray-500
                            ">


                                Medicine expiry monitoring


                            </p>


                        </div>



                    </div>





                    {
                        dashboard.expiredCount > 0 ?

                        (

                            <div className="
                                bg-red-50
                                border
                                border-red-200
                                rounded-xl
                                p-4
                                text-red-700
                                font-medium
                            ">


                                ⚠️ {dashboard.expiredCount}
                                expired medicines detected.


                            </div>

                        )

                        :

                        (

                            <div className="
                                bg-green-50
                                border
                                border-green-200
                                rounded-xl
                                p-4
                                text-green-700
                            ">


                                ✅ No expiry alerts


                            </div>

                        )

                    }


                </div>



            </div>









            {/* ==================================================
                STAFF VIEW ONLY MODULES
            ================================================== */}



            <div className="mt-8">



                <div className="mb-5">


                    <h2 className="
                        text-2xl
                        font-bold
                        text-gray-800
                    ">

                        Staff Access

                    </h2>



                    <p className="
                        text-gray-500
                        text-sm
                        mt-1
                    ">

                        View inventory information and notifications

                    </p>


                </div>






                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-6
                ">





                    {/* MEDICINES */}


                    <button

                        onClick={viewMedicines}

                        className="
                            bg-white
                            rounded-2xl
                            p-6
                            shadow-lg
                            border
                            hover:shadow-xl
                            hover:-translate-y-1
                            transition
                            text-left
                            group
                        "

                    >



                        <div className="
                            flex
                            justify-between
                            items-center
                        ">



                            <div className="
                                flex
                                gap-4
                                items-center
                            ">



                                <div className="
                                    w-14
                                    h-14
                                    rounded-xl
                                    bg-cyan-100
                                    flex
                                    items-center
                                    justify-center
                                ">



                                    <FaPills

                                        className="
                                        text-cyan-600
                                        text-2xl
                                        "

                                    />


                                </div>





                                <div>


                                    <h3 className="
                                        font-bold
                                        text-lg
                                    ">


                                        Medicines


                                    </h3>



                                    <p className="
                                        text-sm
                                        text-gray-500
                                    ">


                                        View medicine inventory


                                    </p>


                                </div>



                            </div>




                            <FaArrowRight

                                className="
                                text-gray-400
                                group-hover:text-cyan-600
                                "

                            />


                        </div>


                    </button>









                    {/* NOTIFICATIONS */}


                    <button

                        onClick={viewNotifications}

                        className="
                            bg-white
                            rounded-2xl
                            p-6
                            shadow-lg
                            border
                            hover:shadow-xl
                            hover:-translate-y-1
                            transition
                            text-left
                            group
                        "

                    >




                        <div className="
                            flex
                            justify-between
                            items-center
                        ">




                            <div className="
                                flex
                                gap-4
                                items-center
                            ">




                                <div className="
                                    w-14
                                    h-14
                                    rounded-xl
                                    bg-yellow-100
                                    flex
                                    items-center
                                    justify-center
                                ">



                                    <FaBell

                                        className="
                                        text-yellow-600
                                        text-2xl
                                        "

                                    />


                                </div>






                                <div>


                                    <h3 className="
                                        font-bold
                                        text-lg
                                    ">


                                        Notifications


                                    </h3>



                                    <p className="
                                        text-sm
                                        text-gray-500
                                    ">


                                        View system alerts


                                    </p>


                                </div>



                            </div>






                            <span className="
                                bg-yellow-100
                                text-yellow-700
                                px-3
                                py-1
                                rounded-full
                                font-bold
                            ">


                                {dashboard.notifications}


                            </span>




                        </div>



                    </button>





                </div>



            </div>









            {/* ==================================================
                STAFF PERMISSION
            ================================================== */}



            <div className="
                mt-8
                mb-8
                bg-blue-50
                border
                border-blue-200
                rounded-2xl
                p-6
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
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                    ">



                        <FaClipboardList

                            className="
                            text-blue-600
                            text-xl
                            "

                        />


                    </div>






                    <div>


                        <h3 className="
                            text-lg
                            font-bold
                            text-blue-800
                        ">


                            Staff Permission


                        </h3>



                        <p className="
                            text-blue-700
                            text-sm
                        ">


                            Staff users have read-only access.
                            Adding, editing, deleting medicines,
                            stock updates and sales are restricted.


                        </p>



                    </div>




                </div>



            </div>






        </div>


    );


}



export default StaffDashboard;