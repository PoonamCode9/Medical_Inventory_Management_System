import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
      alert("Google Login Failed. Please try again.");
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex h-screen items-center justify-center text-slate-600 font-semibold">
      Authenticating with Google... Please wait.
    </div>
  );
}

export default OAuth2RedirectHandler;
