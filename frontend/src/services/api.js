import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 (token expired mid-session)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data and redirect to login
      ['token', 'username', 'email', 'role', 'tokenExpiry'].forEach((k) =>
        localStorage.removeItem(k)
      );
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ─── Medicines ────────────────────────────────────────────────────────────────
export const getMedicines = (params = {}) => api.get('/medicines', { params });
export const getMedicineById = (id) => api.get(`/medicines/${id}`);
export const createMedicine = (data) => api.post('/medicines', data);
export const updateMedicine = (id, data) => api.put(`/medicines/${id}`, data);
export const deleteMedicine = (id) => api.delete(`/medicines/${id}`);
export const adjustStock = (data) => api.post('/medicines/adjust-stock', data);
export const getLowStockMedicines = (threshold = 10) =>
  api.get('/medicines/low-stock', { params: { threshold } });
export const getExpiringMedicines = (days = 30) =>
  api.get('/medicines/expiring', { params: { days } });
export const getDashboardStats = (lowStockThreshold = 10, expiryDays = 30) =>
  api.get('/medicines/stats', { params: { lowStockThreshold, expiryDays } });

// ─── Categories ───────────────────────────────────────────────────────────────
export const getCategories = () => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ─── Suppliers ────────────────────────────────────────────────────────────────
export const getSuppliers = () => api.get('/suppliers');
export const getSupplierById = (id) => api.get(`/suppliers/${id}`);
export const createSupplier = (data) => api.post('/suppliers', data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`);

export default api;
