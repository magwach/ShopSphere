
const ShopSphereLogo = ({ 
  size = 64, 
  className = "", 
  animate = false,
  showShadow = true 
}) => {
  return (
    <svg 
      viewBox="0 0 64 64" 
      width={size} 
      height={size}
      className={`${className} ${animate ? 'animate-pulse' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sphereGradient" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" style={{stopColor: '#6EE7B7', stopOpacity: 1}} />
          <stop offset="60%" style={{stopColor: '#10B981', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#047857', stopOpacity: 1}} />
        </radialGradient>
        
        <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#F9FAFB', stopOpacity: 0.9}} />
        </linearGradient>
        
        {showShadow && (
          <filter id="sphereShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
          </filter>
        )}
      </defs>
      
      <circle 
        cx="32" 
        cy="32" 
        r="28" 
        fill="url(#sphereGradient)" 
        filter={showShadow ? "url(#sphereShadow)" : "none"}
      />
      
      <ellipse 
        cx="26" 
        cy="24" 
        rx="8" 
        ry="6" 
        fill="rgba(255,255,255,0.4)" 
        opacity="0.8"
      />
      
      <g transform="translate(32, 32)">
        <rect 
          x="-8" 
          y="-4" 
          width="16" 
          height="16" 
          rx="1.5" 
          fill="url(#bagGradient)" 
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="0.5"
        />
        
        <path 
          d="M-4 -4 C-4 -8, 4 -8, 4 -4" 
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.9"
        />
        
        <rect 
          x="-6" 
          y="0" 
          width="12" 
          height="1" 
          fill="rgba(255,255,255,0.3)" 
          rx="0.5"
        />
      </g>
      
      <circle 
        cx="32" 
        cy="32" 
        r="28" 
        fill="none" 
        stroke="rgba(255,255,255,0.1)" 
        strokeWidth="1"
      />
    </svg>
  );
};

export default ShopSphereLogo;