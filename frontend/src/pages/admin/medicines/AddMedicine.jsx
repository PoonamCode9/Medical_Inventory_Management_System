import { useState } from "react";
import axios from "axios";
import InputField from "../../../components/InputField";

import {
    FaPills,
    FaCalendarAlt,
    FaSave,
    FaBoxOpen,
    FaTag,
    FaIndustry,
    FaTruck,
    FaHashtag,
    FaRupeeSign,
    FaExclamationTriangle,
    FaCheckCircle
} from "react-icons/fa";


function AddMedicine() {


    const initialState = {

        name: "",
        batchNumber: "",
        category: "",
        supplier: "",
        manufacturer: "",
        quantity: "",
        price: "",
        sellingPrice: "",
        minStockLevel: 10,
        manufactureDate: "",
        expiryDate: ""

    };


    const [medicine,setMedicine] =
        useState(initialState);


    const [loading,setLoading] =
        useState(false);


    const [errorMessage,setErrorMessage] =
        useState("");


    const [successMessage,setSuccessMessage] =
        useState("");



    // ================================
    // HANDLE INPUT
    // ================================

    const handleChange = (e)=>{


        const {
            name,
            value
        } = e.target;


        setMedicine(prev=>({

            ...prev,

            [name]:value

        }));


        setErrorMessage("");

        setSuccessMessage("");

    };





    // ================================
    // SUBMIT
    // ================================

    const handleSubmit = async(e)=>{


        e.preventDefault();


        setErrorMessage("");

        setSuccessMessage("");



        if(
            medicine.manufactureDate &&
            medicine.expiryDate &&
            medicine.manufactureDate >
            medicine.expiryDate
        ){

            setErrorMessage(
                "Manufacture date cannot be after expiry date."
            );

            return;

        }



        if(
            medicine.quantity === "" ||
            Number(medicine.quantity)<0
        ){

            setErrorMessage(
                "Please enter valid quantity."
            );

            return;

        }




        if(
            medicine.price === "" ||
            Number(medicine.price)<0
        ){

            setErrorMessage(
                "Please enter valid purchase price."
            );

            return;

        }




        try{


            setLoading(true);



            const token =
                localStorage.getItem("token");



            const payload={

                ...medicine,

                quantity:Number(
                    medicine.quantity
                ),


                price:Number(
                    medicine.price
                ),


                sellingPrice:Number(
                    medicine.sellingPrice || 0
                ),


                minStockLevel:Number(
                    medicine.minStockLevel
                )

            };




            await axios.post(

                "http://localhost:8080/api/medicines",

                payload,

                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );




            setSuccessMessage(
                "Medicine added successfully."
            );



            setMedicine(initialState);



        }
        catch(error){


            console.error(error);



            if(error.response){


                const data =
                    error.response.data;



                if(typeof data==="string"){

                    setErrorMessage(data);

                }

                else if(data?.message){

                    setErrorMessage(
                        data.message
                    );

                }

                else{

                    setErrorMessage(
                        "Unable to add medicine."
                    );

                }


            }
            else{


                setErrorMessage(
                    "Server not reachable."
                );


            }



        }
        finally{

            setLoading(false);

        }


    };




return (

<div
className="
min-h-screen
bg-gradient-to-br
from-slate-50
via-blue-50
to-white
p-4
md:p-8
"
>


<div
className="
max-w-6xl
mx-auto
"
>



{/* HEADER */}

<div
className="
bg-white
rounded-3xl
border
border-slate-200
shadow-sm
p-6
mb-6
"
>


<div
className="
flex
items-center
gap-4
"
>


<div
className="
w-14
h-14
rounded-2xl
bg-blue-600
text-white
flex
items-center
justify-center
"
>

<FaPills size={26}/>

</div>


<div>


<p
className="
text-xs
font-bold
uppercase
text-blue-600
"
>

Inventory Management

</p>


<h1
className="
text-3xl
font-extrabold
text-slate-800
"
>

Add Medicine

</h1>


</div>


</div>


</div>
{/* ================================
    ALERT MESSAGES
================================ */}


{
successMessage &&

<div
className="
mb-6
flex
items-center
gap-3
rounded-2xl
bg-emerald-50
border
border-emerald-200
px-5
py-4
text-emerald-700
font-semibold
"
>

<FaCheckCircle/>

{successMessage}

</div>

}



{
errorMessage &&

<div
className="
mb-6
flex
items-center
gap-3
rounded-2xl
bg-red-50
border
border-red-200
px-5
py-4
text-red-700
"
>

<FaExclamationTriangle/>

{errorMessage}

</div>

}




{/* ================================
    FORM
================================ */}


<form

onSubmit={handleSubmit}

className="
bg-white
rounded-3xl
border
border-slate-200
shadow-sm
overflow-hidden
"

>



{/* ================================
    MEDICINE INFORMATION
================================ */}



<div
className="
p-6
md:p-8
border-b
border-slate-100
"
>


<h2
className="
text-xl
font-bold
text-slate-800
mb-6
"
>

Medicine Information

</h2>



<div
className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
gap-5
"
>



<InputField

name="name"

label="Medicine Name"

icon={<FaPills/>}

value={medicine.name}

onChange={handleChange}

placeholder="e.g. Paracetamol"

required

/>



<InputField

name="batchNumber"

label="Batch Number"

icon={<FaHashtag/>}

value={medicine.batchNumber}

onChange={handleChange}

placeholder="e.g. BTH-2026-001"

required

/>



<InputField

name="category"

label="Category"

icon={<FaTag/>}

value={medicine.category}

onChange={handleChange}

placeholder="e.g. Tablets"

required

/>



<InputField

name="supplier"

label="Supplier Name"

icon={<FaTruck/>}

value={medicine.supplier}

onChange={handleChange}

placeholder="Supplier Name"

/>



<InputField

name="manufacturer"

label="Manufacturer"

icon={<FaIndustry/>}

value={medicine.manufacturer}

onChange={handleChange}

placeholder="Manufacturer Name"

/>



</div>


</div>





{/* ================================
    STOCK INFORMATION
================================ */}



<div

className="
p-6
md:p-8
bg-slate-50/40
border-b
border-slate-100
"

>


<h2

className="
text-xl
font-bold
text-slate-800
mb-6
"

>

Stock & Pricing

</h2>




<div

className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-5
"

>



<InputField

name="quantity"

label="Quantity"

icon={<FaBoxOpen/>}

type="number"

min="0"

step="1"

value={medicine.quantity}

onChange={handleChange}

placeholder="0"

required

/>



<InputField

name="price"

label="Purchase Price"

icon={<FaRupeeSign/>}

type="number"

min="0"

step="0.01"

value={medicine.price}

onChange={handleChange}

placeholder="0.00"

required

/>



<InputField

name="sellingPrice"

label="Selling Price"

icon={<FaRupeeSign/>}

type="number"

min="0"

step="0.01"

value={medicine.sellingPrice}

onChange={handleChange}

placeholder="0.00"

/>



<InputField

name="minStockLevel"

label="Minimum Stock Level"

icon={<FaExclamationTriangle/>}

type="number"

min="0"

step="1"

value={medicine.minStockLevel}

onChange={handleChange}

required

/>



</div>


</div>





{/* ================================
    DATE INFORMATION
================================ */}



<div

className="
p-6
md:p-8
"

>


<h2

className="
text-xl
font-bold
text-slate-800
mb-6
"

>

Medicine Dates

</h2>



<div

className="
grid
grid-cols-1
md:grid-cols-2
gap-5
"

>



<div>


<label

className="
block
text-sm
font-semibold
mb-2
text-slate-700
"

>

<FaCalendarAlt
className="inline mr-2 text-blue-600"
/>

Manufacture Date *

</label>



<input

type="date"

name="manufactureDate"

value={
medicine.manufactureDate
}

onChange={handleChange}

required

className="
w-full
h-12
px-4
rounded-xl
border
border-slate-200
bg-slate-50
outline-none
focus:ring-4
focus:ring-blue-100
focus:border-blue-500
"

/>


</div>





<div>


<label

className="
block
text-sm
font-semibold
mb-2
text-slate-700
"

>


<FaExclamationTriangle

className="
inline
mr-2
text-red-500
"

/>


Expiry Date *

</label>



<input

type="date"

name="expiryDate"

value={
medicine.expiryDate
}

onChange={handleChange}

required

className="
w-full
h-12
px-4
rounded-xl
border
border-slate-200
bg-slate-50
outline-none
focus:ring-4
focus:ring-blue-100
focus:border-blue-500
"

/>


</div>



</div>


</div>





{/* ================================
    BUTTON
================================ */}



<div

className="
p-6
bg-slate-50
border-t
flex
justify-end
"

>



<button

type="submit"

disabled={loading}

className="
px-8
h-12
rounded-xl
bg-blue-600
hover:bg-blue-700
text-white
font-bold
flex
items-center
gap-3
shadow-lg
disabled:opacity-60
"

>


{
loading ?

<>

<span
className="
w-5
h-5
border-2
border-white/40
border-t-white
rounded-full
animate-spin
"
/>

Saving...

</>

:

<>

<FaSave/>

Add Medicine

</>

}



</button>



</div>



</form>


</div>


</div>


);


}


export default AddMedicine;