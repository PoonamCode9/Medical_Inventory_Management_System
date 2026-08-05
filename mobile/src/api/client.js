import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config';

export const TOKEN_KEY = 'om_token';

// One shared axios instance. Every request automatically gets the Bearer token.
export const api = axios.create({ baseURL: API_BASE });

// Called when the server rejects a token (expired / logged out).
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      onUnauthorized && onUnauthorized();
    }
    return Promise.reject(err);
  }
);

// Decode the middle part of a JWT (payload) without any library.
export const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const d = JSON.parse(json);
    return {
      username: d.sub || d.username || '',
      role: d.role || d.roles || '',
      exp: d.exp,
    };
  } catch (e) {
    return null;
  }
};

// Pull a human-readable error message out of an axios error.
export const getErrorMessage = (err, fallback) => {
  const data = err?.response?.data;
  if (data) {
    if (typeof data === 'object') {
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
    if (typeof data === 'string' && data.trim()) return data.trim();
  }
  if (err?.message) return err.message;
  return fallback;
};
