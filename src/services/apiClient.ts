import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_ROOT,
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        if (!config.headers) config.headers = {} as any;
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
