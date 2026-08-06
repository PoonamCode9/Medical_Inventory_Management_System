import axios from "axios";

const API = axios.create({
    baseURL : "http://localhost:8080/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session expired! Redirecting to login...");

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");

            if (window.location.pathname !== "/") {
                alert("Session expired. Please login again.");
                window.location.href = "/"; 
            }
        }
        return Promise.reject(error);
    }
);

export default API;