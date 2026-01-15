import axios from "axios";
import { store } from "../store/store";
import { clearUser } from "../store/slices/user_slice";

export const authAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URI,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, success = false) => {
  failedQueue.forEach((prom) => {
    success ? prom.resolve(true) : prom.reject(error);
  });
  failedQueue = [];
};

authAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => authAxiosInstance(originalRequest));
      }

      isRefreshing = true;

      try {
        await axios.get(
          `${import.meta.env.VITE_AUTH_API_URI}/refresh-session`,
          { withCredentials: true }
        );

        processQueue(null, true);
        return authAxiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, false);
        store.dispatch(clearUser());
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
