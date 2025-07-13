import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import validator from "validator";

import { getTimeOfDayGreeting } from "../utils/greeting.js";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  authLoading: false,
  isAuthenticated: false,

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
      set({ user: response.data.user, loading: false });
      toast.success("Signup successful");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Signup failed"
      );
    }
  },
  login: async (email, password, setEmail, setPassword) => {
    set({ loading: true });

    try {
      const response = await axios.post("/auth/login", { email, password });
      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }
      set({
        user: response?.data?.data,
        loading: false,
        isAuthenticated: response?.data?.data?.success,
      });
      toast(
        `${getTimeOfDayGreeting()} ${
          response?.data?.data?.name?.split(" ")[1] ||
          response?.data?.data?.name?.split(" ")[0]
        }`,
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
      toast.success("Sucessfully logged out");
    } catch (error) {
      set({ isAuthenticated: true });
      console.log(error);

      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Logout failed"
      );
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
      if (error?.response?.status === 401) {
        toast.error("Session expired, please login again", {
          id: "session-expired",
        });
        return;
      }
      toast.error("Server error, please try again later", {
        id: "server-error",
      });
    }
  },
}));
