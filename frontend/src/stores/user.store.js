import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import validator from "validator";

import { getTimeOfDayGreeting } from "../utils/greeting.js";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  authLoading: false,
  isAuthenticated: null,

  setNumberOfCartItems: (count) => set({ numberOfCartItems: count }),

  setLoading: (loading) => {
    set({ loading });
  },
  setIsAuthenticated: (isAuthenticated) => {
    set({ isAuthenticated });
  },
  setUser: (user) => set({ user }),

  signup: async ({ name, email, password, confirmPassword }, setFormData) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
    }
    if (!validator.isEmail(email)) {
      toast.error("Invalid email format");
      set({ loading: false });
      return;
    }

    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Signup failed");
      }
      set({ user: response.data.user, loading: false, isAuthenticated: true });
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      set({ loading: false, isAuthenticated: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Signup failed"
      );
    }
  },

  passwordVerification: async (email, password) => {
    set({ authLoading: true });
    try {
      const response = await axios.post("/auth/password-verification", {
        email,
        password,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Verification failed");
      }
      set({ authLoading: false, isAuthenticated: true });
    } catch (error) {
      set({ authLoading: false, isAuthenticated: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Verification failed"
      );
    }
  },

  adminlogin: async (email, password, setEmail, setPassword) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }
      if (
        !response?.data?.data?.role ||
        response?.data?.data?.role !== "admin"
      ) {
        set({
          loading: false,
          isAuthenticated: false,
        });
        return toast.error("Nice try but you are not an admin");
      }
      set({
        user: response?.data?.data,
        loading: false,
        isAuthenticated: true,
      });
      toast(
        `${getTimeOfDayGreeting()} Admin ${
          response?.data?.data?.name?.split(" ")[1] ||
          response?.data?.data?.name?.split(" ")[0]
        }!`,
        { icon: "👏" }
      );

      setEmail("");
      setPassword("");
    } catch (error) {
      set({ loading: false, isAuthenticated: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Login failed"
      );
    }
  },
  logout: async () => {
    try {
      const response = await axios.post("/auth/logout");
      if (!response.data.success) {
        throw new Error(response.data.message || "Logout failed");
      }
      set({ user: null, isAuthenticated: false });
      toast.success("Sucessfully logged out", { id: "session-expired" });
    } catch (error) {
      set({ isAuthenticated: false });
    }
  },
  checkAuthentication: async () => {
    set({ authLoading: true });
    try {
      const response = await axios.get("/auth/profile");
      set({
        authLoading: false,
        isAuthenticated: true,
        user: response?.data?.data,
      });
    } catch (error) {
      set({ authLoading: false, isAuthenticated: false });
      return;
    }
  },
  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
