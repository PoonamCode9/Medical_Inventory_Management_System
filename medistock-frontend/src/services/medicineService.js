import axios from "axios";

const API = "http://localhost:8080/api/medicines";

export const getMedicines = () => axios.get(API);

export const addMedicine = (medicine) => axios.post(API, medicine);

export const updateMedicine = (id, medicine) =>
  axios.put(`${API}/${id}`, medicine);

export const deleteMedicine = (id) =>
  axios.delete(`${API}/${id}`);