import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export const registerUser = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = (loginData) => {
    return axios.post(`${API_URL}/login`, loginData);
};