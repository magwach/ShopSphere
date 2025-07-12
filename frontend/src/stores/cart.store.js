import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  loading: false,
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get.calculateTotal();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  addToCart: async (product) => {
    try {
      set({ loading: true });
      const res = await axios.post("/cart", { productId: product._id });
      set((prev) => {
        const existingIndex = prev.cart.findIndex(
          (item) => item.product._id === product._id
        );

        let updatedCart;

        if (existingIndex !== -1) {
          updatedCart = prev.cart.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart = [...prev.cart, { product, quantity: 1 }];
        }

        return { cart: updatedCart };
      });
      get().calculateTotal();
      toast.success("Product added to cart successfully", {
        id: "add-to-cart",
      });
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  },
  calculateTotal: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    let total = subtotal;
    if (coupon && coupon.discountPercentage) {
      total -= (total * coupon.discountPercentage) / 100;
    }
    set({
      subtotal: parseFloat(subtotal.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    });
  },
}));
