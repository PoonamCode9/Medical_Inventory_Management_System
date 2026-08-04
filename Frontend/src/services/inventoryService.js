import axios from "axios";

const API_URL = "http://localhost:8080/api/inventory";

const getToken = () => {
    return localStorage.getItem("token");
};

const inventoryAPI = axios.create({
    baseURL: API_URL
});

inventoryAPI.interceptors.request.use((config) => {

    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export const getAllInventory = async () => {
    const response = await inventoryAPI.get("");
    return response.data;
};

export const getInventoryById = async (id) => {
    const response = await inventoryAPI.get(`/${id}`);
    return response.data;
};

export const addInventory = async (inventory) => {
    const response = await inventoryAPI.post("", inventory);
    return response.data;
};

export const updateInventory = async (id, inventory) => {
    const response = await inventoryAPI.put(`/${id}`, inventory);
    return response.data;
};

export const deleteInventory = async (id) => {
    await inventoryAPI.delete(`/${id}`);
};

export const getInventorySummary = async () => {
    const response = await inventoryAPI.get("/summary");
    return response.data;
};

export const searchMedicine = async (name) => {
    const response = await inventoryAPI.get(
        `/search/medicine?name=${name}`
    );
    return response.data;
};

export const searchCategory = async (category) => {
    const response = await inventoryAPI.get(
        `/search/category?category=${category}`
    );
    return response.data;
};