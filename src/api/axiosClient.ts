import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";

const baseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api/v1";

export const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_KEY = "token";

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    let messageText =
      (error.response?.data as any)?.message ||
      (error.response?.data as any)?.error ||
      getErrorMessage(error) ||
      "Something went wrong";

    if (error.code === "ECONNABORTED") {
      messageText = "Request timed out. Please try again.";
    } else if (!error.response) {
      messageText = "Network error. Please check your connection.";
    }

    if (status && status >= 400) {
      toast.error(messageText);
    }

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    const normalizedError: any = new Error(messageText);
    normalizedError.status = status;
    normalizedError.data = error.response?.data;
    normalizedError.original = error;

    return Promise.reject(normalizedError);
  }
);

export { TOKEN_KEY };
