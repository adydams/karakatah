import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

const getApiBaseUrl = () => {
  const envValue = import.meta.env.VITE_API_URL?.trim();
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const productionFallback = "https://karakatanodebe.onrender.com";

  if (envValue) {
    const normalized = envValue.replace(/\/$/, "");
    if (host !== "localhost" && normalized.includes("localhost")) {
      return productionFallback;
    }
    return normalized;
  }

  return host === "localhost" ? "http://localhost:5000" : productionFallback;
};

const API_ROOT = getApiBaseUrl();

const axiosInstance = axios.create({
  baseURL: API_ROOT,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Unable to attach auth token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
      }
      return Promise.reject(error);
    }

    const payload = error.response?.data;
    const message =
      typeof payload === "object" && payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : error.message || "An unexpected error occurred";

    toast.error(message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
