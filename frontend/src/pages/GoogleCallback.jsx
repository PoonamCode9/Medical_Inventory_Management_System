import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function GoogleCallback(){


    const navigate = useNavigate();



    useEffect(()=>{


        const loginWithGoogle = async()=>{


            try{


                // Google credential from GIS
                const token =
                    localStorage.getItem(
                        "google_token"
                    );



                if(!token){

                    alert(
                        "Google authentication failed"
                    );

                    navigate("/");

                    return;

                }




                const response =
                    await axios.post(

                        "http://localhost:8080/api/auth/google",

                        {
                            token:token
                        }

                    );





                localStorage.setItem(
                    "token",
                    response.data.token
                );



                localStorage.setItem(
                    "role",
                    response.data.role
                );



                localStorage.setItem(
                    "userId",
                    response.data.userId
                );



                redirectUser(
                    response.data.role
                );



            }
            catch(error){


                console.log(
                    error
                );


                alert(
                    "Google Login Failed"
                );


                navigate("/");


            }


        };



        loginWithGoogle();



    },[]);






    const redirectUser=(role)=>{


        switch(role){


            case "ADMIN":

                navigate(
                    "/admin/dashboard"
                );

                break;




            case "PHARMACIST":

                navigate(
                    "/pharmacist/dashboard"
                );

                break;




            case "STAFF":

                navigate(
                    "/staff/dashboard"
                );

                break;




            default:

                navigate("/");


        }


    };







    return(

        <div
            style={{
                height:"100vh",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                fontSize:"22px",
                fontWeight:"600"
            }}
        >

            Authenticating Google Account...

        </div>

    );


}


export default GoogleCallback;