import { useState } from "react";
import API from "../api/Api";
import { useNavigate } from 'react-router-dom';

function Register() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPass, setConfirmPass] = useState("");
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!fullname.trim() || !email.trim() || !password || !confirmPass || !phone.trim()) {
            alert("Please enter all fields");
            return;
        }

        if(password != confirmPass) {
            alert("Passwords do not match");
            return;
        }
            
        const userData = {
            fullName: fullname, 
            email: email,
            password: password,
            phone: phone,
        };
        console.log(userData);

        try {
            const response = await API.post("/auth/register", userData);
            console.log(response.data);
            alert("Register Successfully");
            navigate("/");
        }
        catch(error) {
            console.log(error);

            if(error.response) {
                alert(error.response.data);
            }
            else {
                alert("Something went wrong");
            }
        }
    } 

    return (
        <div className="flex items-center justify-center h-screen overflow-hidden"> 
            {/* Left side */}
            <div className="w-1/2 relative">
                <img src="/medicine.jpg" alt="medicineImg" className="w-full h-screen object-cover"/>
                <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/70 to-white"></div>
                <div className="absolute bottom-20 left-12 text-white z-10">
                    <h2 className="text-4xl font-extrabold" style={{textShadow: "2px 2px 10px rgba(0,0,0,0.5)"}}>Manage Medicines Efficiently</h2>
                    <p className="mt-3 text-lg font-bold" style={{textShadow: "2px 2px 8px rgba(0,0,0,0.5)"}}>Track inventory, monitor expiry dates, and manage suppliers with ease.</p>
                </div>    
            </div>
            

            {/* Right side */}
            <div className="flex w-1/2 flex-col justify-center bg-white px-15 py-4 text-center">
                <h1 className="text-4xl font-extrabold text-blue-700">MediStock</h1>
                <p className="text-gray-500 mt-2">Medical Inventory Management Platform</p>
                <h2 className="text-2xl font-semibold mt-3">Create Account</h2>
                <p className="text-gray-500 mt-2">Register to get started</p>
                <form className="mt-5 space-y-2" onSubmit={handleRegister}>
                    <div>
                        <label className="block w-max mb-1 font-bold text-start text-sm" htmlFor="fullname">Full Name</label>
                        <input className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 shadow-sm" id="fullname" type="text" placeholder="Enter your full name" value={fullname} onChange={(e) => setFullname(e.target.value)}></input>
                    </div>
                    <div>
                        <label className="block w-max mb-1 font-bold text-start text-sm" htmlFor="email">Email Address</label>
                        <input className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 shadow-sm" id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div>
                        <label className="block w-max mb-1 font-bold text-start text-sm" htmlFor="password">Password</label>
                        <div className="relative">
                            <input 
                                className="w-full border rounded-lg pl-4 pr-12 py-2 focus:ring-blue-500 shadow-sm" 
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
                            >
                                {showPassword ? (
                                    <i className="fa-solid fa-eye-slash text-lg"></i> 
                                ) : (
                                    <i className="fa-solid fa-eye text-lg"></i>  
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block w-max mb-1 font-bold text-start text-sm" htmlFor="confirm_pass">Confirm Password</label>
                        <div className="relative">
                            <input type={showConfirmPass ? "text" : "password"} placeholder="Confirm your password" className="w-full border rounded-lg pl-4 pr-12 py-2 focus:ring-blue-500 shadow-sm" id="confirm_pass" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}/>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
                            >
                                {showConfirmPass ? (
                                    <i className="fa-solid fa-eye-slash text-lg"></i> 
                                ) : (
                                    <i className="fa-solid fa-eye text-lg"></i>  
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block w-max mb-1 font-bold text-start text-sm" htmlFor="phone">Phone Number</label>
                        <input className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 shadow-sm" id="phone" type="text" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg cursor-pointer">Register</button>
                </form>
                <div className="mt-2">
                    <p className="mb-2">or</p>
                    <button className="w-full border py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer flex justify-center items-center gap-3"><img src="/google-logo.png" alt="googleLogo" className="w-5"/>Signup with Google</button>
                </div>
                <div className="flex justify-between mt-2">
                    <p>Already have an account?</p>
                    <a href="/" className="text-blue-600 hover:underline font-medium">Login</a>
                </div>
            </div>
        </div>
    )
}

export default Register;