import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-white opacity-20 select-none">
            404
          </h1>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Shop<span className="text-emerald-400">Sphere</span>
          </h2>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Oops! Page Not Found
          </h3>
          <p className="text-emerald-100 text-lg mb-2">
            The page you're looking for seems to have wandered off into the
            digital void.
          </p>
          <p className="text-emerald-200 text-base">
            Don't worry, even the best explorers sometimes take a wrong turn!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </button>
        </div>

        <div className="absolute top-20 left-10 w-4 h-4 bg-emerald-400 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-6 h-6 bg-emerald-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-emerald-500 rounded-full opacity-40 animate-bounce"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
