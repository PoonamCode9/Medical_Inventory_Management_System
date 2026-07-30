import API from "./api";

export const getDashboardData = (token) => {
    return API.get("/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};