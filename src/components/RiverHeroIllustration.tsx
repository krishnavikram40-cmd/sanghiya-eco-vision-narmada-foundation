import React from 'react';

export const RiverHeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200 ${className}`}
    >
      <svg
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>

          {/* Golden Sun Gradient */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Narmada Mountain Backdrop */}
          <linearGradient id="mountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#065f46" stopOpacity="0.6" />
          </linearGradient>

          {/* River Water Gradient */}
          <linearGradient id="narmadaWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="40%" stopColor="#0ea5e9" />
            <stop offset="80%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>

          {/* Green Bank Gradient */}
          <linearGradient id="greenBank" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="50%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          {/* Stone Ghat Gradient */}
          <linearGradient id="ghatStone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="800" height="500" fill="url(#skyGradient)" />

        {/* Golden Dawn Sun rising over sacred hills */}
        <circle cx="400" cy="190" r="110" fill="url(#sunGlow)" />
        <circle cx="400" cy="190" r="42" fill="#fffbeb" />

        {/* Distant Satpura & Vindhya Hills */}
        <path
          d="M0 240 Q150 180 300 220 T600 200 T800 230 L800 320 L0 320 Z"
          fill="url(#mountainFar)"
        />
        <path
          d="M0 260 Q180 220 380 250 T750 240 T800 260 L800 350 L0 350 Z"
          fill="#065f46"
          opacity="0.75"
        />

        {/* Sacred Narmada River Body */}
        <path
          d="M0 290 Q200 270 400 295 T800 290 L800 500 L0 500 Z"
          fill="url(#narmadaWater)"
        />

        {/* River Water Ripple Highlights */}
        <path
          d="M100 330 Q250 320 400 330 T700 330"
          stroke="#e0f2fe"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M50 360 Q300 345 550 360 T780 355"
          stroke="#bae6fd"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M150 400 Q400 385 650 400"
          stroke="#fef08a"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M80 435 Q350 420 720 435"
          stroke="#e0f2fe"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Lush Green Riverbank on Left with Trees */}
        <path
          d="M0 290 Q120 310 180 380 T200 500 L0 500 Z"
          fill="url(#greenBank)"
        />
        {/* Afforestation Tree Silhouettes on Left Bank */}
        <circle cx="60" cy="310" r="30" fill="#166534" />
        <circle cx="85" cy="325" r="24" fill="#15803d" />
        <circle cx="35" cy="335" r="28" fill="#14532d" />
        <circle cx="110" cy="355" r="32" fill="#15803d" />
        <circle cx="70" cy="385" r="38" fill="#166534" />
        <circle cx="130" cy="420" r="34" fill="#14532d" />
        {/* Tree Trunks */}
        <path d="M60 335 L60 360" stroke="#78350f" strokeWidth="4" />
        <path d="M110 380 L110 410" stroke="#78350f" strokeWidth="5" />
        <path d="M70 415 L70 450" stroke="#78350f" strokeWidth="5" />

        {/* Sacred Ghat Steps (Right Shore) */}
        <path
          d="M600 500 L800 500 L800 310 Q700 320 660 360 T600 500 Z"
          fill="#e2e8f0"
        />
        {/* Ghat Steps lines */}
        <path d="M670 360 L800 330" stroke="#94a3b8" strokeWidth="4" />
        <path d="M650 385 L800 360" stroke="#cbd5e1" strokeWidth="5" />
        <path d="M635 415 L800 395" stroke="#94a3b8" strokeWidth="5" />
        <path d="M620 445 L800 430" stroke="#cbd5e1" strokeWidth="6" />
        <path d="M605 475 L800 465" stroke="#94a3b8" strokeWidth="6" />

        {/* Temple Shikhara Silhouette on Ghat */}
        <path
          d="M740 330 L760 250 L780 330 Z"
          fill="#b45309"
          opacity="0.9"
        />
        <line x1="760" y1="250" x2="760" y2="238" stroke="#f59e0b" strokeWidth="3" />
        <polygon points="760,238 775,244 760,250" fill="#f97316" />

        {/* Floating Sacred Leaf Diya (Aarti Diya) of Reverence */}
        <g transform="translate(420, 375)">
          {/* Lotus / Leaf Bowl */}
          <path
            d="M-22 0 C-22 10 22 10 22 0 C15 -5 -15 -5 -22 0 Z"
            fill="#b45309"
          />
          {/* Flower Petals */}
          <path
            d="M-15 -3 C-10 -10 -5 -2 0 -8 C5 -2 10 -10 15 -3 Z"
            fill="#ea580c"
          />
          {/* Flame */}
          <path
            d="M0 -7 C-4 -14 0 -22 0 -22 C0 -22 4 -14 0 -7 Z"
            fill="#fbbf24"
          />
          <circle cx="0" cy="-12" r="2.5" fill="#ffffff" />
          {/* Water Glow Reflection */}
          <ellipse cx="0" cy="8" rx="16" ry="3" fill="#fef08a" opacity="0.6" />
        </g>

        {/* Clean White Water Birds (Egrets) in Flight */}
        <path
          d="M260 180 Q270 172 280 180 Q290 172 300 180 Q290 176 280 182 Q270 176 260 180 Z"
          fill="#ffffff"
          opacity="0.95"
        />
        <path
          d="M295 160 Q303 154 311 160 Q319 154 327 160 Q319 157 311 162 Q303 157 295 160 Z"
          fill="#ffffff"
          opacity="0.85"
        />
        <path
          d="M240 200 Q246 195 252 200 Q258 195 264 200 Q258 198 252 202 Q246 198 240 200 Z"
          fill="#ffffff"
          opacity="0.8"
        />
      </svg>

      {/* Floating Badge on bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white border border-emerald-400/40 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="font-medium text-emerald-200">
          पवित्र नर्मदा नदी, निर्मल जलधारा व पावन घाट — हमारा प्राकृतिक धरोहर
        </span>
      </div>
    </div>
  );
};
