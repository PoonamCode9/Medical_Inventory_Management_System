import axios from "axios";

// Public APIs
const AUTH_API = axios.create({
    baseURL: "http://localhost:8080/api/auth",
});

// Protected APIs
const PROTECTED_API = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const registerUser = (userData) => {
    return AUTH_API.post("/register", userData);
};

export const loginUser = (loginData) => {
    return AUTH_API.post("/login", loginData);
};

export const getProtectedData = (token) => {
    return PROTECTED_API.get("/test", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// ✅ Dashboard API
export const getDashboardData = (token) => {
    return PROTECTED_API.get("/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};