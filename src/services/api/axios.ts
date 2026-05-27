import axios, { type AxiosAdapter } from "axios";
import { ENDPOINTS } from "./endpoints";

const cache = new Map<string, { data: any; headers: any; status: number; statusText: string; timestamp: number }>();
const CACHE_TTL_MS = 15000; // 15 seconds cache expiration

const api = axios.create({
  baseURL: ENDPOINTS.BASE_URL.BASE_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.method === "get" && config.url) {
      const cacheKey = config.url + (config.params ? JSON.stringify(config.params) : "");
      const cached = cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        const adapter: AxiosAdapter = () => {
          return Promise.resolve({
            data: cached.data,
            status: cached.status,
            statusText: cached.statusText,
            headers: cached.headers,
            config,
          });
        };
        config.adapter = adapter;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response.config.method === "get" && response.config.url) {
      const cacheKey = response.config.url + (response.config.params ? JSON.stringify(response.config.params) : "");
      cache.set(cacheKey, {
        data: response.data,
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
