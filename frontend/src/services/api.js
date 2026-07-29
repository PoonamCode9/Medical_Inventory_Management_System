import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Dispatch event on successful write operations to trigger instant notification/dashboard syncing
api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toUpperCase();
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      window.dispatchEvent(new CustomEvent('api-write-success', { detail: { method, url: response.config.url } }));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
