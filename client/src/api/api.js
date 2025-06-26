import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// You can add interceptors here if needed
export default API;
