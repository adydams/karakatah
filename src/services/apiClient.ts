import axios from "axios";
import toast from "react-hot-toast";

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || error.message || "An unexpected error occurred";
    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
