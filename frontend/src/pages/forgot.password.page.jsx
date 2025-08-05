import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Check,
  Loader2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password, 4: success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  I;
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(180);

  const passwordRef = useRef(null);

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
    number: false,
  });

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

  const navigate = useNavigate();

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

  const validatePassword = () => {
    if (confirmPassword.length !== 0 && newPassword !== confirmPassword) {
      setPasswordError(true);
      return;
    }
    return setPasswordError(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (Object.values(passwordStrength).every(Boolean)) {
      handlePasswordReset();
    } else {
      setPasswordError(true);
      passwordRef.current?.focus();
      return;
    }
  };

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleEmailSubmit = async (resend) => {
    if (!email) return;
    if (resend) {
      setIsResending(true);
    } else {
      setIsLoading(true);
    }
    try {
      await axios.post("/auth/send-password-reset-code", { email });
      toast.success("Reset code sent successfully");
      if (!resend) {
        setStep(2);
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
      toast.error(error.response.data?.message || "Failed to send reset code");
    } finally {
      if (resend) {
        setIsResending(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    if (index === 5 && value !== "") {
      const fullCode = [...newCode.slice(0, 5), value].join("");
      if (fullCode.length === 6) {
        handleCodeVerification(fullCode);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pastedCode = paste.slice(0, 6);
    if (pastedCode.length === 6) {
      const newCode = pastedCode.split("");
      setCode(newCode);
      inputRefs[5].current?.focus();
      handleCodeVerification(pastedCode);
    }
  };

  const handleCodeVerification = async (token) => {
    setIsLoading(true);
    try {
      await axios.post("/auth/verify-password-reset-code", {
        token: token.toUpperCase(),
      });
      setStep(3);
    } catch (error) {
      toast.error(error.response.data?.message || "Code verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualCodeSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      handleCodeVerification(fullCode);
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("/auth/reset-password", {
        email,
        password: newPassword,
      });
      setStep(4);
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error(error.response.data?.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCanResend(false);
    setCountdown(180);
    handleEmailSubmit(true);
  };

  const handleBackToLogin = (complete) => {
    if (complete) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (step === 2 && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      if (countdown > 0 && !canResend) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else if (countdown === 0) {
        setCanResend(true);
      }
    }
    step === 4 && handleBackToLogin(true);
  }, [countdown, canResend, step]);

  useEffect(() => {
    validatePassword();
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    checkPasswordStrength(newPassword);
  }, [newPassword]);

  // Success screen
  if (step === 4) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-black/20 bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500 border-opacity-20 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Shop<span className="text-emerald-400">Sphere</span>
            </h1>

            <h2 className="text-2xl font-bold text-white mb-4">
              Password Reset Successfully!
            </h2>

            <p className="text-gray-300 mb-6">
              Your password has been updated. You can now sign in with your new
              password.
            </p>

            <p className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]">
              Redirecting to Login ....
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black/20 bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500 border-opacity-20 shadow-2xl">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-emerald-400" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">
                  Shop<span className="text-emerald-400">Sphere</span>
                </h1>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Forgot Password?
                </h2>
                <p className="text-gray-300">
                  No worries! Enter your email address and we'll send you a
                  reset code.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-200"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={() => handleEmailSubmit(false)}
                  disabled={isLoading || !email}
                  className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Reset Code
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                <button
                  onClick={() => handleBackToLogin(false)}
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              </div>
            </>
          )}

          {/* Step 2: Code Verification */}
          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-emerald-400" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">
                  Shop<span className="text-emerald-400">Sphere</span>
                </h1>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Enter Reset Code
                </h2>
                <p className="text-gray-300 mb-2">
                  We've sent a 6-digit reset code to
                </p>
                <p className="text-emerald-400 font-medium">{email}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                  Enter reset code
                </label>

                <div
                  className="flex gap-2 justify-center mb-4"
                  onPaste={handlePaste}
                >
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all duration-200"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleManualCodeSubmit}
                disabled={isLoading || code.join("").length !== 6}
                className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 mb-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isResending ? "Resending..." : "Verifying..."}
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Verify Code
                  </>
                )}
              </button>

              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-3">
                  Didn't receive the code?
                </p>

                {canResend ? (
                  <button
                    onClick={handleResendCode}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Resend Code
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Resend available in{" "}
                    {String(Math.floor(countdown / 60)).padStart(2, "0")} :
                    {String(countdown % 60).padStart(2, "0")}
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-gray-700 text-center">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Use Different Email
                </button>
              </div>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-emerald-400" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">
                  Shop<span className="text-emerald-400">Sphere</span>
                </h1>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Create New Password
                </h2>
                <p className="text-gray-300">Enter your new password below</p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
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
                    disabled={isLoading}
                    value={newPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`block w-full px-3 py-2 pl-10 pr-10 bg-gray-700 border ${
                      passwordError
                        ? "border-red-500"
                        : "border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                    } 
                                   rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
                                    sm:text-sm`}
                    placeholder="Enter your new password"
                    autoComplete="off"
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
                    <Lock
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
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
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full px-3 py-2 pl-10 pr-10 bg-gray-700 border ${
                      passwordError
                        ? "border-red-500"
                        : "border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                    } 
                                   rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
                                   sm:text-sm`}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                onClick={handlePasswordSubmit}
                className="w-full flex justify-center py-2 px-4 mt-10 border border-transparent 
                                            rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
                                             hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                              focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" aria-hidden="true" />
                    Update Password
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
