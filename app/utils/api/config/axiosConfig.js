// axiosConfig.js
import axios from 'axios';

// Base URL from environment variables or fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Optionally, add interceptors here (e.g., for auth tokens)

export default axiosInstance;