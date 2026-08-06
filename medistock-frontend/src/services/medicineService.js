import axios from "axios";

const API = "http://localhost:8081/api/medicines";

export const getMedicines = () => axios.get(API);

export const addMedicine = (medicine) =>
    axios.post(API, medicine);

export const updateMedicine = (id, medicine) =>
    axios.put(`${API}/${id}`, medicine);

export const deleteMedicine = (id) =>
    axios.delete(`${API}/${id}`);

export const searchMedicine = (name) =>
    axios.get(`${API}/search?name=${name}`);

export const getLowStockMedicines = () =>
    axios.get(`${API}/low-stock`);

export const getOutOfStockMedicines = () =>
    axios.get(`${API}/out-of-stock`);

export const getNearExpiryMedicines = () =>
    axios.get(`${API}/near-expiry`);

export const getExpiredMedicines = () =>
    axios.get(`${API}/expired`);

export const searchByCategory = (category) =>
    axios.get(`${API}/search/category?category=${category}`);

export const searchByBatch = (batch) =>
    axios.get(`${API}/search/batch?batch=${batch}`);

export const getMedicineCount = () =>
    axios.get(`${API}/count`);

export const downloadExcel = () => {
    window.open(`${API}/excel`);
};

export const downloadPdf = () => {
    window.open(`${API}/pdf`);
};