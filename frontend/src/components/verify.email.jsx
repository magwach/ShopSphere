import { useState, useRef, useEffect } from "react";
import { Mail, RotateCcw, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useUserStore } from "../stores/user.store.js";

export default function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(180);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const { user } = useUserStore();

  const userEmail = user?.email;

  const handleInputChange = (index, value) => {
    setCodeError(false);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    if (index === 5 && value !== "") {
      const fullCode = [...newCode.slice(0, 5), value].join("");
      if (fullCode.length === 6) {
        handleVerification(fullCode);
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
      handleVerification(pastedCode);
    }
  };

  const handleVerification = async (verificationCode) => {
    setIsLoading(true);
    try {
      await axios.post("/auth/verify-email-code", {
        token: verificationCode,
      });
      setIsVerified(true);
      toast.success("Account created successfully");
      handleRedirect();
    } catch (error) {
      console.log(error);
      setCodeError(true);
      toast.error(error.response.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    async function resendCode() {
      try {
        await axios.post("/auth/resend-verification-email", {
          email: userEmail,
        });
        toast.success("Code Resent");
      } catch (err) {
        console.log(err);
        toast.error(err.response.data?.message || "Code Resend Failed");
      }
    }
    setCanResend(false);
    setCountdown(180);
    toast.promise(resendCode(), {
      loading: "Sending code...",
      success: "Code resent",
      error: "Code resend failed",
    });
  };

  const handleManualSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      handleVerification(fullCode);
    } else {
      toast.error("Please enter all 6 digits.");
    }
  };

  const handleRedirect = () => {
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };

  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  if (isVerified) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-black/20 bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500 border-opacity-20 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Shop<span className="text-emerald-400">Sphere</span>
            </h1>

            <h2 className="text-2xl font-bold text-white mb-4">
              Email Verified!
            </h2>

            <p className="text-gray-300 mb-6">
              Your email has been successfully verified. You can now access all
              ShopSphere features.
            </p>

            <p className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]">
              Redirecting ...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-black/20 bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500 border-opacity-20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-emerald-400" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Shop<span className="text-emerald-400">Sphere</span>
            </h1>

            <h2 className="text-2xl font-bold text-white mb-4">
              Verify Your Email
            </h2>
            <p className="text-gray-300 mb-2">To complete your account setup</p>

            <p className="text-gray-300 mb-2">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-emerald-400 font-medium">{userEmail}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
              Enter verification code
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
                  className={`w-12 h-12 text-center text-xl font-bold bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                    codeError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                  } text-white transition-all duration-200`}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleManualSubmit}
            disabled={isLoading || code.join("").length !== 6}
            className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 mb-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Verify Email
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-3">
              Didn't receive the code?
            </p>

            {canResend ? (
              <button
                onClick={handleResendCode}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
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

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-xs text-center">
              Check your spam folder if you don't see the email.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
