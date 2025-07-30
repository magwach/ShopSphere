import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  fetchingProducts: false,
  setProducts: (products) => set({ products }),
  createProduct: async (productData, setProductData) => {
    set({ loading: true });
    try {
      if (!productData.image) {
        set({ loading: false });
        toast.error("Product image is required");
        return;
      }
      const response = await axios.post("/products", productData);
      if (!response.data.success) {
        throw new Error(response.data.message || "Product creation failed");
      }
      set((prevState) => ({
        products: [...prevState.products, response.data.data],
        loading: false,
      }));
      toast.success("Product created successfully");
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Product creation failed"
      );
    }
  },
  fetchProducts: async () => {
    set({ fetchingProducts: true });
    try {
      const response = await axios.get("/products");
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch products");
      }
      set({ products: response.data.data, fetchingProducts: false });
    } catch (error) {
      set({ fetchingProducts: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Failed to fetch products"
      );
    }
  },
  fetchFeaturedProducts: async () => {
    set({ fetchingProducts: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data?.data , fetchingProducts: false });
    } catch (error) {
      set({ error: "Failed to fetch products", fetchingProducts: false });
      console.log("Error fetching featured products:", error);
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.delete(`/products/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Product deletion failed");
      }
      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Product deletion failed"
      );
    }
  },
  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${id}/toggle-featured`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to toggle featured status"
        );
      }
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: !product.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Failed to toggle featured status"
      );
    }
  },
  fetchByCategory: async (category) => {
    set({ fetchingProducts: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.data, fetchingProducts: false });
    } catch (error) {
      set({ fetchingProducts: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Failed to fetch products by category"
      );
    }
  },
}));
