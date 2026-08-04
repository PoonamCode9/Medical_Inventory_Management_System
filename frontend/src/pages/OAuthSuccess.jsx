import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {

    const navigate = useNavigate();

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");

        if (token) {

            localStorage.setItem("token", token);

            navigate("/dashboard");

        } else {

            navigate("/");

        }

    }, []);

    return <h2>Signing you in...</h2>;
}

export default OAuthSuccess;