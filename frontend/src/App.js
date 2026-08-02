import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import "./App.css";



/* =========================================================
   AUTH
========================================================= */

import Login from "./pages/Login";
import Register from "./pages/Register";

import GoogleCallback from "./pages/GoogleCallback";



/* =========================================================
   ADMIN
========================================================= */

import AdminLayout from "./layouts/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AddSupplier from "./pages/admin/AddSupplier";
import ViewSuppliers from "./pages/admin/ViewSuppliers";

import AddMedicine from "./pages/admin/medicines/AddMedicine";
import ViewMedicines from "./pages/admin/medicines/ViewMedicines";
import EditMedicine from "./pages/admin/medicines/EditMedicine";
import UpdateStock from "./pages/admin/medicines/UpdateStock";

import ManageUsers from "./pages/admin/ManageUsers";

import Reports from "./pages/admin/Reports";

import Settings from "./pages/admin/Settings";

import NotificationPage from "./pages/admin/NotificationPage";



/* =========================================================
   STAFF
========================================================= */

import StaffLayout from "./layouts/StaffLayout";

import StaffDashboard from "./pages/StaffDashboard";

import ViewStock from "./pages/pharmacist/ViewStock";



/* =========================================================
   PHARMACIST
========================================================= */


import PharmacistLayout from "./layouts/PharmacistLayout";

import PharmacistDashboard 
from "./pages/PharmacistDashboard";


import SellMedicine 
from "./pages/pharmacist/SellMedicine";


import ExpiryCheck 
from "./pages/pharmacist/ExpiryCheck";


import SalesHistory 
from "./pages/pharmacist/SalesHistory";





/* =========================================================
   PROTECTED ROUTE
========================================================= */


function ProtectedRoute({

    children,

    allowedRoles

}) {


    const token =
        localStorage.getItem("token");


    const role =
        localStorage.getItem("role");



    if(!token){

        return (

            <Navigate
                to="/"
                replace
            />

        );

    }



    if(!allowedRoles.includes(role)){


        return (

            <Navigate
                to="/unauthorized"
                replace
            />

        );


    }



    return children;


}






/* =========================================================
   UNAUTHORIZED
========================================================= */


function Unauthorized(){


return(


<div className="
min-h-screen
flex
items-center
justify-center
bg-red-50
">


<div className="
bg-white
p-10
rounded-3xl
shadow-xl
text-center
">


<h1 className="
text-4xl
font-bold
text-red-600
">

Access Denied

</h1>



<p className="
mt-3
text-gray-600
">

You don't have permission.

</p>



<button

className="
mt-6
px-6
py-3
bg-blue-600
text-white
rounded-xl
"

onClick={()=>window.history.back()}

>

Go Back

</button>


</div>


</div>


);


}







/* =========================================================
   404
========================================================= */


function NotFound(){


return(


<div className="
min-h-screen
flex
items-center
justify-center
">


<h1 className="
text-7xl
font-bold
text-blue-600
">

404

</h1>


</div>


);


}







/* =========================================================
   APP
========================================================= */


function App(){



return(


<GoogleOAuthProvider

clientId="478953468894-13dgsudp8csff06megqc50cs1sbcr6q4.apps.googleusercontent.com"

>


<BrowserRouter>


<Routes>



{/* ================= AUTH ================= */}



<Route

path="/"

element={<Login/>}

/>



<Route

path="/register"

element={<Register/>}

/>



{/* Google callback */}

<Route

path="/google/callback"

element={<GoogleCallback/>}

/>






{/* ================= ADMIN ================= */}



<Route


path="/admin"


element={


<ProtectedRoute

allowedRoles={[
"ADMIN"
]}

>


<AdminLayout/>


</ProtectedRoute>


}



>


<Route

path="dashboard"

element={<AdminDashboard/>}

/>



<Route

path="add-medicine"

element={<AddMedicine/>}

/>



<Route

path="view-medicines"

element={<ViewMedicines/>}

/>



<Route

path="edit-medicine/:id"

element={<EditMedicine/>}

/>



<Route

path="update-stock"

element={<UpdateStock/>}

/>



<Route

path="add-supplier"

element={<AddSupplier/>}

/>



<Route

path="view-suppliers"

element={<ViewSuppliers/>}

/>



<Route

path="users"

element={<ManageUsers/>}

/>



<Route

path="reports"

element={<Reports/>}

/>



<Route

path="settings"

element={<Settings/>}

/>



<Route

path="notifications"

element={<NotificationPage/>}

/>



</Route>






/* ================= STAFF ================= */



<Route


path="/staff"


element={


<ProtectedRoute

allowedRoles={[
    "STAFF"
]}

>


<StaffLayout/>


</ProtectedRoute>


}


>


<Route

path="dashboard"

element={<StaffDashboard/>}

/>



{/* VIEW ONLY MEDICINES */}

<Route

path="medicines"

element={<ViewMedicines/>}

/>





{/* VIEW ONLY SUPPLIERS */}

<Route

path="suppliers"

element={<ViewSuppliers/>}

/>





{/* VIEW ONLY REPORTS */}

<Route

path="reports"

element={<Reports/>}

/>





{/* STOCK VIEW ONLY */}

<Route

path="stock"

element={<ViewStock/>}

/>





{/* NOTIFICATIONS */}

<Route

path="notifications"

element={<NotificationPage/>}

/>


</Route>

{/* ================= PHARMACIST ================= */}




<Route


path="/pharmacist"


element={


<ProtectedRoute

allowedRoles={[
"PHARMACIST"
]}

>


<PharmacistLayout/>


</ProtectedRoute>


}



>



<Route

path="dashboard"

element={<PharmacistDashboard/>}

/>



<Route

path="sell"

element={<SellMedicine/>}

/>



<Route

path="stock"

element={<ViewStock/>}

/>



<Route

path="expiry"

element={<ExpiryCheck/>}

/>



<Route

path="sales"

element={<SalesHistory/>}

/>



<Route

path="notifications"

element={<NotificationPage/>}

/>



</Route>







<Route

path="/unauthorized"

element={<Unauthorized/>}

/>




<Route

path="*"

element={<NotFound/>}

/>



</Routes>


</BrowserRouter>


</GoogleOAuthProvider>


);



}


export default App;