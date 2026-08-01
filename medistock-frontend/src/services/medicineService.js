import axios from "axios";

const API = "http://localhost:8080/api/medicines";

export const getMedicines = () => axios.get(API);

export const addMedicine = (medicine) => axios.post(API, medicine);

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