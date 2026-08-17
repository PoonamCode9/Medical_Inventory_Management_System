import axios from "axios";

const API = "http://localhost:8081/api/suppliers";

const authConfig = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

};

export const getSuppliers = () =>
    axios.get(API, authConfig());

export const addSupplier = (supplier) =>
    axios.post(
        API,
        supplier,
        authConfig()
    );

export const updateSupplier = (id, supplier) =>
    axios.put(
        `${API}/${id}`,
        supplier,
        authConfig()
    );

export const deleteSupplier = (id) =>
    axios.delete(
        `${API}/${id}`,
        authConfig()
    );

export const searchSupplier = (name) =>
    axios.get(
        `${API}/search?name=${encodeURIComponent(name)}`,
        authConfig()
    );

export const getSupplierCount = () =>
    axios.get(
        `${API}/count`,
        authConfig()
    );