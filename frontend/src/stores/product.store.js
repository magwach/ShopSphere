import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
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
      set({ loading: false });
      toast.success("Product created successfully");
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      console.log(error);
      set({ loading: false });
      toast.error(
        error?.response?.data?.error?.[0] ||
          error?.response?.data?.message ||
          "Product creation failed"
      );
    }
  },
}));
