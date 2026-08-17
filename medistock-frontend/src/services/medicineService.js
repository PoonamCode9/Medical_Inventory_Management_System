import axios from "axios";

const API = "http://localhost:8081/api/medicines";

const authConfig = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

};

export const getMedicines = () =>
    axios.get(API, authConfig());

export const addMedicine = (medicine) =>
    axios.post(API, medicine, authConfig());

export const updateMedicine = (id, medicine) =>
    axios.put(
        `${API}/${id}`,
        medicine,
        authConfig()
    );

export const deleteMedicine = (id) =>
    axios.delete(
        `${API}/${id}`,
        authConfig()
    );

export const searchMedicine = (name) =>
    axios.get(
        `${API}/search?name=${encodeURIComponent(name)}`,
        authConfig()
    );

export const getLowStockMedicines = () =>
    axios.get(
        `${API}/low-stock`,
        authConfig()
    );

export const getOutOfStockMedicines = () =>
    axios.get(
        `${API}/out-of-stock`,
        authConfig()
    );

export const getNearExpiryMedicines = () =>
    axios.get(
        `${API}/near-expiry`,
        authConfig()
    );

export const getExpiredMedicines = () =>
    axios.get(
        `${API}/expired`,
        authConfig()
    );

export const searchByCategory = (category) =>
    axios.get(
        `${API}/search/category?category=${encodeURIComponent(category)}`,
        authConfig()
    );

export const searchByBatch = (batch) =>
    axios.get(
        `${API}/search/batch?batch=${encodeURIComponent(batch)}`,
        authConfig()
    );

export const getMedicineCount = () =>
    axios.get(
        `${API}/count`,
        authConfig()
    );

export const downloadExcel = () => {

    const token = localStorage.getItem("token");

    window.open(
        `${API}/excel?token=${token}`
    );

};

export const downloadPdf = () => {

    const token = localStorage.getItem("token");

    window.open(
        `${API}/pdf?token=${token}`
    );

};