import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import { clearAuth, getToken } from '../storage/authStorage';

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  async config => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

http.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      await clearAuth();
    }
    return Promise.reject(error);
  },
);
