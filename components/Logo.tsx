// components/Logo.tsx
// 🌿 BOLEH MAKAN INTELLIGENCE - Premium Brand Logo
// Design: Leaf shape with digital circuit nodes - Health meets Technology

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({ 
  className = 'h-8 w-8', 
  showText = false,
  textClassName = 'text-lg font-bold text-slate-900'
}: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Gradient Definitions */}
        <defs>
          {/* Primary gradient - Teal to Emerald */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" /> {/* Teal-500 */}
            <stop offset="50%" stopColor="#10B981" /> {/* Emerald-500 */}
            <stop offset="100%" stopColor="#059669" /> {/* Emerald-600 */}
          </linearGradient>
          
          {/* Secondary gradient for accent */}
          <linearGradient id="logoGradientLight" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5EEAD4" /> {/* Teal-300 */}
            <stop offset="100%" stopColor="#6EE7B7" /> {/* Emerald-300 */}
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background Circle - Subtle */}
        <circle 
          cx="24" 
          cy="24" 
          r="22" 
          fill="url(#logoGradient)"
          opacity="0.1"
        />
        
        {/* Main Leaf Shape - Organic curve */}
        <path
          d="M24 6C24 6 12 14 12 26C12 34 17 40 24 42C31 40 36 34 36 26C36 14 24 6 24 6Z"
          fill="url(#logoGradient)"
          filter="url(#logoGlow)"
        />
        
        {/* Leaf Vein - Center line */}
        <path
          d="M24 12V36"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        
        {/* Circuit Nodes - Digital/Tech element */}
        {/* Top node */}
        <circle cx="24" cy="14" r="2.5" fill="white" />
        
        {/* Middle nodes - branching */}
        <circle cx="19" cy="22" r="2" fill="white" opacity="0.9" />
        <circle cx="29" cy="22" r="2" fill="white" opacity="0.9" />
        
        {/* Lower nodes */}
        <circle cx="17" cy="29" r="1.5" fill="white" opacity="0.8" />
        <circle cx="31" cy="29" r="1.5" fill="white" opacity="0.8" />
        
        {/* Center node - main */}
        <circle cx="24" cy="26" r="3" fill="white" />
        <circle cx="24" cy="26" r="1.5" fill="url(#logoGradient)" />
        
        {/* Bottom node */}
        <circle cx="24" cy="34" r="2" fill="white" opacity="0.9" />
        
        {/* Circuit Lines - connecting nodes */}
        {/* Top to sides */}
        <path
          d="M24 14L19 22M24 14L29 22"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
        
        {/* Sides to center */}
        <path
          d="M19 22L24 26M29 22L24 26"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
        
        {/* Outer branches */}
        <path
          d="M19 22L17 29M29 22L31 29"
          stroke="white"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.4"
        />
        
        {/* Center to bottom */}
        <path
          d="M24 26L24 34"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
        
        {/* Pulse ring animation hint - outer glow ring */}
        <circle 
          cx="24" 
          cy="24" 
          r="20" 
          stroke="url(#logoGradient)"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
      </svg>
      
      {showText && (
        <span className={textClassName}>
          Boleh Makan Intelligence
        </span>
      )}
    </div>
  );
}

// Compact version for smaller spaces (nav icons, favicons)
export function LogoMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoMarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      {/* Simplified leaf + circuit */}
      <path
        d="M24 4C24 4 10 14 10 28C10 38 16 44 24 44C32 44 38 38 38 28C38 14 24 4 24 4Z"
        fill="url(#logoMarkGradient)"
      />
      
      {/* Central circuit node */}
      <circle cx="24" cy="24" r="4" fill="white" />
      <circle cx="24" cy="24" r="2" fill="url(#logoMarkGradient)" />
      
      {/* Top node */}
      <circle cx="24" cy="14" r="2.5" fill="white" />
      
      {/* Side nodes */}
      <circle cx="18" cy="24" r="2" fill="white" opacity="0.9" />
      <circle cx="30" cy="24" r="2" fill="white" opacity="0.9" />
      
      {/* Bottom node */}
      <circle cx="24" cy="34" r="2.5" fill="white" />
      
      {/* Connection lines */}
      <path
        d="M24 14V20M24 28V34M18 24H20M28 24H30"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

