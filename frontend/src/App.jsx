import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/home.page.jsx";
import LoginPage from "./pages/login.page.jsx";
import SignUpPage from "./pages/signup.page.jsx";
import Navbar from "./components/navbar.component.jsx";
import ShopSphereSpinner from "./components/loading.jsx";
import NotFoundPage from "./pages/not.found.page.jsx";

import { useUserStore } from "./stores/user.store.js";
import { useEffect } from "react";

export default function App() {
  const location = useLocation();
  const allowedPaths = ["/", "/login", "/signup"];
  const showNavbar = allowedPaths.includes(location.pathname);

  const navigate = useNavigate();

  const { checkAuthentication, isAuthenticated, authLoading } = useUserStore();

  useEffect(() => {
    checkAuthentication();
    if (!isAuthenticated && !authLoading) {
      navigate("/login");
      return;
    }
  }, [checkAuthentication, isAuthenticated]);


  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        {showNavbar && <Navbar />}
        {authLoading ? (
          <ShopSphereSpinner />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </div>
    </div>
  );
}
