import axios from "axios";

const AUTH_API = "http://localhost:8080/api/auth";
const ROLE_API = "http://localhost:8080/api/roles";

export const loginUser = async (loginData) => {
    const response = await axios.post(`${AUTH_API}/login`, loginData);
    return response.data;
};

export const registerUser = async (registerData) => {
    const response = await axios.post(`${AUTH_API}/register`, registerData);
    return response.data;
};

export const getRoles = async () => {
    const response = await axios.get(ROLE_API);
    return response.data;
};