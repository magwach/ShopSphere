const ShopSphereSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-200 border-opacity-30"></div>
          
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 border-r-emerald-400 animate-spin"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
            Shop<span className="text-emerald-400">Sphere</span>
          </h1>
        </div>
        
        <div className="text-emerald-100 text-lg font-medium">
          Loading<span className="loading-dots">...</span>
        </div>
        
        <div className="w-48 h-1 bg-emerald-900 bg-opacity-30 rounded-full mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes dots {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        .loading-dots span:nth-child(1) { animation: dots 1.5s infinite; }
        .loading-dots span:nth-child(2) { animation: dots 1.5s 0.5s infinite; }
        .loading-dots span:nth-child(3) { animation: dots 1.5s 1s infinite; }
      `}</style>
    </div>
  );
};

export default ShopSphereSpinner;