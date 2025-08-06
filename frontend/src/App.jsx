import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import HomePage from "./pages/home.page.jsx";
import LoginPage from "./pages/login.page.jsx";
import SignUpPage from "./pages/signup.page.jsx";
import Navbar from "./components/navbar.component.jsx";
import NotFoundPage from "./pages/not.found.page.jsx";
import AdminDashboard from "./pages/admin.page.jsx";
import AdminLoginPage from "./pages/admin.login.page.jsx";
import PurchaseSuccessPage from "./pages/purchase.success.page.jsx";
import PurchaseCancelPage from "./pages/purchase.cancel.page.jsx";

import { useUserStore } from "./stores/user.store.js";
import CategoryPage from "./pages/category.page.jsx";
import { useEffect } from "react";
import CartPage from "./pages/cart.page.jsx";
import { useCartStore } from "./stores/cart.store.js";
import ForgotPasswordPage from "./pages/forgot.password.page.jsx";

export default function App() {
  const location = useLocation();
  const allowedPaths = [
    "/",
    "/login",
    "/signup",
    "/admin-login",
    "/admin",
    "/cart",
    "/success",
    "/purchase-cancelled",
  ];
  const showNavbar =
    allowedPaths.includes(location.pathname) ||
    location.pathname.startsWith("/category/");

  const { user, checkAuthentication, isAuthenticated } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    getCartItems();
  }, [isAuthenticated]);
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        {showNavbar && <Navbar />}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/admin-login"
            element={
              user?.role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <AdminLoginPage />
              )
            }
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <SignUpPage />}
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin-login" />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ? <Navigate to="/" /> : <ForgotPasswordPage />
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/success" element={<PurchaseSuccessPage />} />
          <Route path="/purchase-cancelled" element={<PurchaseCancelPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}
