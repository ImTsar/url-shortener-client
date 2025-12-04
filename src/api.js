import axios from "axios";

const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("auth/login")
    ) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    login(data) {
      return http.post("/auth/login", data);
    },
  },

  urls: {
    getAll() {
      return http.get("/shorturl");
    },
    create(data) {
      return http.post("/shorturl", data);
    },
    getById(id) {
      return http.get(`/shorturl/${id}`);
    },
    delete(id) {
      return http.delete(`/shorturl/${id}`);
    },
  },

  about: {
    get() {
      return http.get("/about");
    },
    update(data) {
      return http.put("/about", data);
    },
  }
};