import api from "./api";

export const getSuppliers = async () => {
    const response = await api.get("/suppliers");
    return response.data;
};

export const getSupplierById = async (supplierId) => {
    const response = await api.get(`/suppliers/${supplierId}`);
    return response.data;
};

export const addSupplier = async (supplierData) => {
    const response = await api.post("/suppliers", supplierData);
    return response.data;
};

export const updateSupplier = async (supplierId, supplierData) => {
    const response = await api.put(`/suppliers/${supplierId}`, supplierData);
    return response.data;
};

export const deleteSupplier = async (supplierId) => {
    await api.delete(`/suppliers/${supplierId}`);
};