import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

import { loadStripe } from "@stripe/stripe-js";

export const useCartStore = create((set, get) => ({
  loading: false,
  fetchingItems: false,
  recommendationsLoading: false,
  cart: [],
  recommendations: [],
  coupon: [],
  appliedCoupon: null,
  total: 0,
  subtotal: 0,
  isappliedCoupon: false,
  stripePromise: loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY),
  processingPayment: false,
  paymentError: false,
  orderNumber: null,
  setOderNumber: () => {
    set({ orderNumber: null });
  },
  getCartItems: async () => {
    try {
      set({ fetchingItems: true });
      const res = await axios.get("/cart");
      set({ cart: res.data.data });
      get().calculateTotal();
      set({ fetchingItems: false });
    } catch (error) {
      set({ fetchingItems: false });
      set({ cart: [] });
    }
  },
  addToCart: async (product) => {
    set({ loading: true });

    try {
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
      get().fetchRecommendations();

      toast.success("Product added to cart successfully", {
        id: "add-to-cart",
      });
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  },
  removeFromCart: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item.product._id !== productId),
        loading: false,
      }));
      get().calculateTotal();
      get().fetchRecommendations();
      toast.success("Product removed from cart successfully", {
        id: "remove-from-cart",
      });
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.message || "An error occurred at cart removal"
      );
    }
  },
  updateQuantity: async (productId, quantity) => {
    set({ loading: true });
    try {
      await axios.put(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
        loading: false,
      }));
      get().calculateTotal();
    } catch (error) {
      console.error(error);
      set({ loading: false });
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  },
  clearCart: async () => {
    set({ loading: true });
    try {
      await axios.delete("/cart/all");
      set({ cart: [] });
      get().calculateTotal();
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while clearing cart"
      );
    }
  },
  fetchRecommendations: async () => {
    set({ recommendationsLoading: true });
    try {
      const res = await axios.get("/products/recommended");
      set({ recommendations: res?.data?.data });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred while fetching recommendations"
      );
    } finally {
      set({ recommendationsLoading: false });
    }
  },
  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response?.data?.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },
  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({
        appliedCoupon: response.data?.data,
        isappliedCoupon: true,
      });
      get().calculateTotal();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },
  removeCoupon: () => {
    set((prevData) => ({
      coupon: prevData.appliedCoupon
        ? Array.from(new Set([...prevData.coupon, prevData.appliedCoupon]))
        : prevData.coupon,
      appliedCoupon: null,
      isappliedCoupon: false,
    }));
    get().calculateTotal();
    toast.success("Coupon removed");
  },
  handlePayment: async (retry = false) => {
    try {
      const stripe = await get().stripePromise;
      const res = await axios.post("/payments/create-checkout-session", {
        products: get().cart,
        couponCode: get().appliedCoupon ? get().appliedCoupon.code : null,
        retry,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      const session = res.data;
      const result = await stripe.redirectToCheckout({
        sessionId: session.data.sessionId,
      });

      if (result.error) {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  },
  handlePaymentSuccess: async (sessionId) => {
    try {
      set({ isProcessing: true });
      const res = await axios.post("/payments/checkout-success", {
        sessionId,
      });
      set({ orderNumber: res.data.orderNumber });
      get().clearCart();
    } catch (error) {
      console.log(error);
      set({
        paymentError: true,
      });
    } finally {
      set({ isProcessing: false });
    }
  },
  calculateTotal: () => {
    const { cart, appliedCoupon } = get();
    const subtotal = cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    let total = subtotal;
    if (appliedCoupon && appliedCoupon.discountPercentage) {
      total -= (total * appliedCoupon.discountPercentage) / 100;
    }
    set({
      subtotal: parseFloat(subtotal.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    });
  },
}));
