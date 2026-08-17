import axios from "axios";

const API = "http://localhost:8081/auth";

export const loginUser = async (email, password) => {

    const response = await axios.post(
        `${API}/login`,
        {
            email: email,
            password: password
        }
    );

    // Save JWT information
    localStorage.setItem(
        "token",
        response.data.token
    );

    localStorage.setItem(
        "user",
        JSON.stringify({
            name: response.data.name,
            email: response.data.email,
            role: response.data.role
        })
    );

    return response.data;
};

export const registerUser = async (
    name,
    email,
    password,
    role
) => {

    const response = await axios.post(
        `${API}/register`,
        {
            name,
            email,
            password,
            role
        }
    );

    return response.data;
};

export const logoutUser = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

};

export const getToken = () => {

    return localStorage.getItem("token");

};

export const getUser = () => {

    const user = localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;

};

export const isLoggedIn = () => {

    return !!localStorage.getItem("token");

};