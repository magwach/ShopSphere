import { Check, Loader2, Mail } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getTimeOfDayGreeting } from "../utils/greeting.js";
import { useState } from "react";
import { useUserStore } from "../stores/user.store.js";
import { useRef } from "react";
import axios from "../lib/axios.js";

export default function TwoFactorAuthenticationPage({
  email,
  handleSubmit,
  setEmail,
  setPassword,
}) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(180);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser, setIsAuthenticated } = useUserStore();

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

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
        handleCodeVerification(fullCode);
      }
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

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleManualCodeSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      handleCodeVerification(fullCode);
    }
  };

  const handleResendCode = async () => {
    setCanResend(false);
    setCountdown(180);
    toast.promise(handleSubmit(true), {
      loading: "Sending code...",
      success: "Code resent",
      error: "Code resend failed",
    });
  };

  const handleCodeVerification = async (token) => {
    setIsLoading(true);
    console.log("hit");
    try {
      const response = await axios.post("/auth/login", {
        token: token.toUpperCase(),
      });
      setUser(response?.data?.data);
      setIsAuthenticated(true);
      setIsLoading(false);
      setEmail("");
      setPassword("");
      toast(
        <span>
          {getTimeOfDayGreeting()}{" "}
          <b>
            {response?.data?.data?.name?.split(" ")[1] ||
              response?.data?.data?.name?.split(" ")[0]}
          </b>
        </span>,
        { icon: "👏" }
      );
    } catch (error) {
      setCodeError(true);
      console.log(error);
      toast.error(error.response?.data?.message || "Code verification failed");
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black/20 bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500 border-opacity-20 shadow-2xl">
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-emerald-400" />
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Shop<span className="text-emerald-400">Sphere</span>
              </h1>

              <h2 className="text-2xl font-bold text-white mb-4">Enter OTP</h2>
              <p className="text-gray-300 mb-2">We've sent a 6-digit OTP to</p>
              <p className="text-emerald-400 font-medium">{email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                Enter otp
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
                    className={`w-12 h-12 text-center text-xl font-bold ${
                      codeError
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                    } border  bg-gray-700 rounded-lg focus:outline-none focus:ring-2}  text-white transition-all duration-200`}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleManualCodeSubmit}
              disabled={isLoading || code.join("").length !== 6}
              className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 mb-6 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
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
                  className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
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
          </>
        </div>
      </div>
    </div>
  );
}
