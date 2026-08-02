import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
    FaEye,
    FaEyeSlash,
    FaUserShield,
    FaUserNurse,
    FaUserTie,
    FaUserCircle,
    FaEnvelope,
    FaPhone,
    FaLock,
    FaHeartbeat,
    FaHospital,
    FaBoxes,
    FaChartLine,
    FaIdBadge,
    FaUserPlus,
    FaKey,
    FaMobileAlt
} from "react-icons/fa";
import registerBg from "../assets/register-bg.jpg";

import "./Register.css";


function Register(){


    const [showPassword,setShowPassword]=useState(false);

    const [loading,setLoading]=useState(false);



    const [data,setData]=useState({

        fullName:"",
        username:"",
        email:"",
        phone:"",
        password:"",
        role:"STAFF"

    });





    const handleChange=(e)=>{

        setData({

            ...data,

            [e.target.name]:e.target.value

        });

    };







    const handleRoleChange=(role)=>{

        setData({

            ...data,

            role

        });

    };







    const handleSubmit=async(e)=>{


        e.preventDefault();


        try{


            setLoading(true);



            const response = await axios.post(

                "http://localhost:8080/api/auth/register",

                data

            );



            console.log(response.data);



            alert(
                "Registration Successful!"
            );



            setData({

                fullName:"",
                username:"",
                email:"",
                phone:"",
                password:"",
                role:"STAFF"

            });



        }


        catch(error){


            console.log(error);



            alert(

                error.response?.data ||

                "Registration Failed"

            );


        }


        finally{


            setLoading(false);


        }


    };







return(



<div className="register-page">



<div


className="register-background"


style={{


backgroundImage:

`

linear-gradient(

135deg,

rgba(0,65,120,.90),

rgba(0,190,220,.70)

),

url(${registerBg})

`

}}



>






<div className="register-wrapper">







{/* ================= LEFT SECTION ================= */}




<div className="register-info">





<div className="brand-logo">


<div className="logo-circle">

<FaHeartbeat/>

</div>



<h1>

MediStock

</h1>



</div>







<h2>

Create Your Medical Account

</h2>





<p>

Manage medicines, suppliers and inventory

with a secure healthcare platform.

</p>








<div className="features">






<div className="feature-item">


<FaHospital/>


<span>

Hospital Inventory Management

</span>


</div>






<div className="feature-item">


<FaBoxes/>


<span>

Medicine Stock Tracking

</span>


</div>







<div className="feature-item">


<FaChartLine/>


<span>

Smart Analytics Dashboard

</span>


</div>





</div>





</div>









{/* ================= REGISTER CARD ================= */}




<div className="register-card">






<div className="card-header">



<div className="medical-symbol">

<FaUserPlus/>

</div>





<h1>

Create Account

</h1>




<p>

Join MediStock Healthcare System

</p>



</div>









<form onSubmit={handleSubmit}>









<div className="input-box">

<FaUserCircle/>


<input


type="text"


name="fullName"


placeholder="Full Name"


value={data.fullName}


onChange={handleChange}


required


/>



</div>









<div className="input-box">


<FaUserCircle/>


<input


type="text"


name="username"


placeholder="Username"


value={data.username}


onChange={handleChange}


required


/>



</div>










<div className="input-box">


<FaEnvelope/>


<input


type="email"


name="email"


placeholder="Email Address"


value={data.email}


onChange={handleChange}


required


/>



</div>









<div className="input-box">


<FaMobileAlt/>


<input


type="text"


name="phone"


placeholder="Mobile Number"


maxLength="10"


value={data.phone}


onChange={handleChange}


required


/>



</div>









<div className="input-box password-box">


<FaKey/>




<input


type={showPassword ? "text":"password"}


name="password"


placeholder="Password"


value={data.password}


onChange={handleChange}


required


/>





<button


type="button"


className="password-toggle"


onClick={()=>setShowPassword(!showPassword)}


>



{

showPassword

?

<FaEyeSlash/>

:

<FaEye/>

}


</button>



</div>









<h3 className="choose-title">

Select Account Type

</h3>








<div className="role-container">






<button


type="button"


className={

data.role==="ADMIN"

?

"role-card selected"

:

"role-card"

}



onClick={()=>handleRoleChange("ADMIN")}



>


<FaUserShield/>


<span>

Admin

</span>


</button>









<button


type="button"


className={

data.role==="PHARMACIST"

?

"role-card selected"

:

"role-card"

}



onClick={()=>handleRoleChange("PHARMACIST")}



>


<FaUserNurse/>


<span>

Pharmacist

</span>


</button>









<button


type="button"


className={

data.role==="STAFF"

?

"role-card selected"

:

"role-card"

}



onClick={()=>handleRoleChange("STAFF")}



>


<FaUserTie/>


<span>

Staff

</span>


</button>







</div>









<button


className="register-btn"


type="submit"


disabled={loading}



>



{

loading

?

"Creating Account..."

:

"Create Account"

}


</button>







</form>









<div className="login-link">


Already have an account?


<Link to="/">

Login

</Link>



</div>









</div>










</div>







</div>





</div>


);

}



export default Register;