import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");    
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;