import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const error = searchParams.get("error");

    if (error === "pending") {
      hasProcessed.current = true;
      
      toast(
        (t) => (
          <div className="flex flex-col gap-1 p-1">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <span>⏳ Account Pending Approval</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your Google account was registered successfully! Please wait for the Admin to approve your account.
            </p>
          </div>
        ),
        {
          duration: 6000,
          position: "top-center",
          style: {
            border: "1px solid #fcd34d",
            background: "#fffbeb",
            padding: "12px",
            borderRadius: "12px",
          },
        }
      );

      navigate("/", { replace: true });
      return;
    }

    if (token && role) {
      hasProcessed.current = true;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      toast.success("Welcome! Logged in successfully.");
      navigate("/dashboard", { replace: true });
    } else if (error) {
      hasProcessed.current = true;
      toast.error("Google Login failed. Please try again.");
      navigate("/", { replace: true });
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