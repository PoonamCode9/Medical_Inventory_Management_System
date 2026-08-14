import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast"; 

function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate("/dashboard");
    } else {
      toast.error("Google Login Failed. Please try again.");
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex h-screen items-center justify-center text-slate-600 font-semibold bg-slate-50">
      <div className="flex items-center gap-3 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Authenticating with Google... Please wait.</span>
      </div>
    </div>
  );
}

export default OAuth2RedirectHandler;