import axios from "axios";
import { ENDPOINTS } from "./endpoints";

const api = axios.create({
  baseURL: ENDPOINTS.BASE_URL.BASE_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;