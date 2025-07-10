import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../stores/user.store.js";

export default function SignUpPage() {
  const { signup, loading } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
    number: false,
  });

  const validatePassword = () => {
    if (
      formData.confirmPassword.length !== 0 &&
      formData.password !== formData.confirmPassword
    ) {
      setPasswordError(true);
      return;
    }
    return setPasswordError(false);
  };

  const checkPasswordStrength = (password) => {
    const strength = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      number: /\d/.test(password),
    };
    setPasswordStrength(strength);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(passwordStrength).every(Boolean)) {
      signup(formData, setFormData);
    } else {
      setPasswordError(true);
      passwordRef.current?.focus();
      return;
    }
  };

  useEffect(() => {
    validatePassword();
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    checkPasswordStrength(formData.password);
  }, [formData.password]);

  const strengthRequirements = [
    {
      key: "length",
      label: "At least 6 characters",
      met: passwordStrength.length,
    },
    {
      key: "uppercase",
      label: "One uppercase letter",
      met: passwordStrength.uppercase,
    },
    {
      key: "lowercase",
      label: "One lowercase letter",
      met: passwordStrength.lowercase,
    },
    {
      key: "symbol",
      label: "One special symbol",
      met: passwordStrength.symbol,
    },
    {
      key: "number",
      label: "One number",
      met: passwordStrength.number,
    },
  ];

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 ">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Create your account
        </h2>
      </motion.div>
      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                                         placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className=" block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
                                        rounded-md shadow-sm
                                         placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
                                         focus:border-emerald-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

                <input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  className={`block w-full px-3 py-2 pl-10 pr-10 bg-gray-700 border ${
                    passwordError
                      ? "border-red-500"
                      : "border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                  } 
                       rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
                        sm:text-sm`}
                  placeholder="••••••••"
                  autoCom
                />
              </div>

              <AnimatePresence>
                {isPasswordFocused && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 p-3 bg-gray-700 rounded-md border border-gray-600"
                  >
                    <p className="text-sm text-gray-300 mb-2 font-medium">
                      Password requirements:
                    </p>
                    <div className="space-y-2">
                      {strengthRequirements.map((req, index) => (
                        <motion.div
                          key={req.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all duration-200 ${
                              req.met
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-gray-500 bg-gray-600"
                            }`}
                          >
                            {req.met && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-sm transition-colors duration-200 ${
                              req.met ? "text-emerald-400" : "text-gray-400"
                            }`}
                          >
                            {req.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                  }}
                  className={`block w-full px-3 py-2 pl-10 pr-10 bg-gray-700 border ${
                    passwordError
                      ? "border-red-500"
                      : "border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                  } 
                       rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
                       sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
                                rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
                                 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Sign up
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Login here <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
