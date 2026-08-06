import axios from "axios";

const API = "http://localhost:8081/api/suppliers";

export const getSuppliers = () => axios.get(API);

export const addSupplier = (supplier) =>
    axios.post(API, supplier);

export const updateSupplier = (id, supplier) =>
    axios.put(`${API}/${id}`, supplier);

export const deleteSupplier = (id) =>
    axios.delete(`${API}/${id}`);

export const searchSupplier = (name) =>
    axios.get(`${API}/search?name=${name}`);
export const getSupplierCount = () =>
    axios.get(`${API}/count`);