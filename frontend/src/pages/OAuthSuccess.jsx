import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthSuccess() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {

        const token = searchParams.get("token");
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const role = searchParams.get("role");

        if (token) {

            localStorage.setItem("token", token);
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("role", role);

            navigate("/dashboard");
        } else {

            navigate("/");
        }

    }, [navigate, searchParams]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Logging in...</h2>
            <p>Please wait while MediStock completes your login.</p>
        </div>
    );
}

export default OAuthSuccess;