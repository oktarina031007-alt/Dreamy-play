import React, { useState } from 'react';
import { BunnyAnimationState, CostumeId } from '../types/game';
import { soundManager } from '../utils/sound';

interface BunnyCharacterProps {
  state?: BunnyAnimationState;
  costumeId?: CostumeId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeech?: boolean;
  speechText?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const BunnyCharacter: React.FC<BunnyCharacterProps> = ({
  state = 'idle',
  costumeId = 'classic_purple',
  size = 'lg',
  showSpeech = false,
  speechText = '',
  onClick,
  interactive = true,
}) => {
  const [internalClickState, setInternalClickState] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Costume color palettes
  const costumeStyles: Record<CostumeId, {
    hoodie: string;
    hoodieShadow: string;
    hoodiePocket: string;
    drawstring: string;
    hoodRim: string;
    earColor: string;
    earInner: string;
    accessory?: string;
  }> = {
    classic_purple: {
      hoodie: '#a855f7',
      hoodieShadow: '#7e22ce',
      hoodiePocket: '#9333ea',
      drawstring: '#f3e8ff',
      hoodRim: '#c084fc',
      earColor: '#ffffff',
      earInner: '#fbcfe8',
      accessory: '⭐',
    },
    strawberry_pink: {
      hoodie: '#ec4899',
      hoodieShadow: '#be185d',
      hoodiePocket: '#db2777',
      drawstring: '#fdf2f8',
      hoodRim: '#f472b6',
      earColor: '#ffffff',
      earInner: '#fda4af',
      accessory: '🍓',
    },
    star_astronaut: {
      hoodie: '#0284c7',
      hoodieShadow: '#0369a1',
      hoodiePocket: '#0ea5e9',
      drawstring: '#e0f2fe',
      hoodRim: '#38bdf8',
      earColor: '#f0f9ff',
      earInner: '#bae6fd',
      accessory: '🚀',
    },
    pajama_cloud: {
      hoodie: '#60a5fa',
      hoodieShadow: '#3b82f6',
      hoodiePocket: '#93c5fd',
      drawstring: '#eff6ff',
      hoodRim: '#bfdbfe',
      earColor: '#ffffff',
      earInner: '#dbeafe',
      accessory: '☁️',
    },
    royal_crown: {
      hoodie: '#d97706',
      hoodieShadow: '#b45309',
      hoodiePocket: '#f59e0b',
      drawstring: '#fef3c7',
      hoodRim: '#fbbf24',
      earColor: '#fffbeb',
      earInner: '#fde68a',
      accessory: '👑',
    },
    magic_wizard: {
      hoodie: '#6366f1',
      hoodieShadow: '#4338ca',
      hoodiePocket: '#4f46e5',
      drawstring: '#e0e7ff',
      hoodRim: '#818cf8',
      earColor: '#ffffff',
      earInner: '#c7d2fe',
      accessory: '🪄',
    },
  };

  const style = costumeStyles[costumeId] || costumeStyles.classic_purple;

  const handleBunnyClick = () => {
    if (!interactive) return;
    soundManager.playGiggle();
    setInternalClickState('wink');
    
    // Spawn floating heart
    const newHeart = {
      id: Date.now(),
      x: Math.random() * 60 - 30,
      y: -20 - Math.random() * 20,
    };
    setHearts(prev => [...prev.slice(-3), newHeart]);

    setTimeout(() => {
      setInternalClickState(null);
    }, 1200);

    if (onClick) {
      onClick();
    }
  };

  // Determine current active animation class
  const activeState = internalClickState ? 'giggle' : state;

  const sizeClasses = {
    sm: 'w-24 h-28',
    md: 'w-36 h-44',
    lg: 'w-52 h-60',
    xl: 'w-64 h-72',
  }[size];

  return (
    <div className="relative inline-flex flex-col items-center justify-center select-none">
      {/* Speech bubble */}
      {showSpeech && speechText && (
        <div className="absolute -top-12 sm:-top-14 z-20 animate-bounce transition-all duration-300">
          <div className="relative bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border-2 border-purple-200 text-purple-900 font-semibold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5">
            <span>✨</span>
            <span>{speechText}</span>
            {/* Bubble arrow pointing down */}
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
          </div>
        </div>
      )}

      {/* Floating Hearts when touched */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute pointer-events-none text-pink-500 font-bold text-2xl animate-ping"
          style={{
            transform: `translate(${h.x}px, ${h.y}px)`,
            opacity: 0.8,
            transition: 'all 0.8s ease-out',
          }}
        >
          💖
        </div>
      ))}

      {/* Snooze Zzz bubbles if sleepy */}
      {activeState === 'sleepy' && (
        <div className="absolute -top-6 right-2 flex flex-col items-center pointer-events-none z-10">
          <span className="text-purple-400 font-black text-sm animate-pulse" style={{ animation: 'float-zzz 2s infinite 0s' }}>Z</span>
          <span className="text-purple-500 font-black text-base animate-pulse" style={{ animation: 'float-zzz 2s infinite 0.6s' }}>Z</span>
          <span className="text-purple-600 font-black text-xl animate-pulse" style={{ animation: 'float-zzz 2s infinite 1.2s' }}>Z</span>
        </div>
      )}

      {/* Confused Question Marks if confused */}
      {activeState === 'confused' && (
        <div className="absolute -top-6 right-4 flex items-center pointer-events-none z-10 animate-bounce">
          <span className="text-amber-500 font-extrabold text-2xl drop-shadow-md">❓</span>
          <span className="text-purple-400 font-extrabold text-lg drop-shadow-md">❔</span>
        </div>
      )}

      {/* Musical notes if dancing */}
      {activeState === 'dance' && (
        <div className="absolute -top-8 flex gap-4 pointer-events-none z-10 animate-bounce">
          <span className="text-pink-500 text-xl">🎵</span>
          <span className="text-amber-400 text-xl">✨</span>
          <span className="text-purple-500 text-xl">🎶</span>
        </div>
      )}

      {/* Main 3D Cartoon Bunny SVG */}
      <div 
        onClick={handleBunnyClick}
        className={`${sizeClasses} relative flex items-center justify-center transition-transform ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        }`}
        style={{
          animation: 
            activeState === 'jump' ? 'bunny-jump 0.8s ease-in-out infinite' :
            activeState === 'dance' ? 'bunny-dance 0.7s ease-in-out infinite' :
            activeState === 'confused' ? 'bunny-confused 1s ease-in-out infinite' :
            activeState === 'sleepy' ? 'sleep-breath 3s ease-in-out infinite' :
            activeState === 'giggle' ? 'bunny-jump 0.5s ease-out' :
            'gentle-float 4s ease-in-out infinite',
        }}
      >
        <svg 
          viewBox="0 0 200 240" 
          className="w-full h-full drop-shadow-[0_12px_18px_rgba(168,85,247,0.35)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft plush gradient for face */}
            <radialGradient id="faceGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#fdf4ff" />
              <stop offset="100%" stopColor="#fae8ff" />
            </radialGradient>

            {/* Hoodie 3D sphere gradient */}
            <radialGradient id="hoodieBodyGrad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor={style.hoodRim} />
              <stop offset="60%" stopColor={style.hoodie} />
              <stop offset="100%" stopColor={style.hoodieShadow} />
            </radialGradient>

            {/* Ear inner gradient */}
            <linearGradient id="earInnerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="100%" stopColor={style.earInner} />
            </linearGradient>

            {/* 3D Head highlight */}
            <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Filter for plush softness */}
            <filter id="plushGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(126, 34, 206, 0.25)" />
            </filter>
          </defs>

          {/* === EARS === */}
          {/* Left Ear */}
          <g 
            className="transition-transform origin-[65px_80px]"
            style={{
              animation: activeState === 'sleepy' ? 'none' : 'ear-wiggle 3s ease-in-out infinite',
              transform: activeState === 'sleepy' ? 'rotate(-25deg) translateY(12px)' : undefined,
            }}
          >
            {/* Outer Ear */}
            <ellipse cx="65" cy="48" rx="16" ry="42" fill={style.earColor} />
            {/* Inner Pink Plush */}
            <ellipse cx="65" cy="50" rx="9" ry="30" fill="url(#earInnerGrad)" />
            {/* Fluffy ear tip shine */}
            <ellipse cx="63" cy="24" rx="4" ry="10" fill="white" opacity="0.6" />
          </g>

          {/* Right Ear */}
          <g 
            className="transition-transform origin-[135px_80px]"
            style={{
              animation: activeState === 'sleepy' ? 'none' : 'ear-wiggle 3s ease-in-out infinite 0.5s',
              transform: activeState === 'sleepy' ? 'rotate(25deg) translateY(12px)' : undefined,
            }}
          >
            {/* Outer Ear */}
            <ellipse cx="135" cy="48" rx="16" ry="42" fill={style.earColor} />
            {/* Inner Pink Plush */}
            <ellipse cx="135" cy="50" rx="9" ry="30" fill="url(#earInnerGrad)" />
            {/* Fluffy ear tip shine */}
            <ellipse cx="133" cy="24" rx="4" ry="10" fill="white" opacity="0.6" />
          </g>

          {/* === HOODIE BACK / HOOD COLLAR === */}
          {/* Plush Hood wrapping around head */}
          <path
            d="M 46 112 C 34 70, 70 56, 100 56 C 130 56, 166 70, 154 112 C 160 136, 145 152, 100 152 C 55 152, 40 136, 46 112 Z"
            fill="url(#hoodieBodyGrad)"
            filter="url(#plushGlow)"
          />

          {/* === HEAD / FACE === */}
          <ellipse cx="100" cy="115" rx="46" ry="40" fill="url(#faceGrad)" />

          {/* White head highlight */}
          <path
            d="M 75 88 C 85 80, 115 80, 125 88 C 115 94, 85 94, 75 88 Z"
            fill="url(#shineGrad)"
          />

          {/* Rosy Pink Cheeks */}
          <ellipse cx="70" cy="126" rx="9" ry="6" fill="#f472b6" opacity="0.65" />
          <ellipse cx="130" cy="126" rx="9" ry="6" fill="#f472b6" opacity="0.65" />
          {/* Cute sparkle on cheek */}
          <circle cx="68" cy="124" r="1.5" fill="white" />
          <circle cx="132" cy="124" r="1.5" fill="white" />

          {/* === EYES === */}
          {activeState === 'sleepy' ? (
            /* Sleepy curved lines (closed eyes) */
            <g stroke="#4a154b" strokeWidth="3" strokeLinecap="round">
              <path d="M 74 116 Q 82 122 90 116" />
              <path d="M 110 116 Q 118 122 126 116" />
            </g>
          ) : activeState === 'confused' ? (
            /* Confused asymmetric eyes */
            <g>
              {/* Left eye spiral/small */}
              <circle cx="82" cy="114" r="6" fill="#4a154b" />
              <circle cx="80" cy="112" r="2.5" fill="white" />
              {/* Right eye squinted question mark line */}
              <path d="M 112 112 Q 120 106 126 114" stroke="#4a154b" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : activeState === 'jump' || activeState === 'dance' || internalClickState === 'wink' ? (
            /* Joyful closed curved eyes (^ ^) */
            <g stroke="#4a154b" strokeWidth="3.5" strokeLinecap="round">
              <path d="M 73 116 Q 81 108 89 116" />
              <path d="M 111 116 Q 119 108 127 116" />
            </g>
          ) : (
            /* Big, shiny 3D cartoon eyes */
            <g>
              {/* Left Eye */}
              <ellipse cx="82" cy="113" rx="7" ry="9" fill="#2e1065" />
              <circle cx="80" cy="110" r="3.2" fill="white" />
              <circle cx="85" cy="117" r="1.5" fill="white" />
              {/* Right Eye */}
              <ellipse cx="118" cy="113" rx="7" ry="9" fill="#2e1065" />
              <circle cx="116" cy="110" r="3.2" fill="white" />
              <circle cx="121" cy="117" r="1.5" fill="white" />
            </g>
          )}

          {/* Cute Little Pink Triangle Nose */}
          <path
            d="M 97 122 L 103 122 L 100 126 Z"
            fill="#ec4899"
          />

          {/* W-Shaped Bunny Mouth */}
          <path
            d="M 94 127 Q 97 131 100 128 Q 103 131 106 127"
            stroke="#4a154b"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tongue open for happy / giggle */}
          {(activeState === 'jump' || activeState === 'dance' || activeState === 'giggle') && (
            <path
              d="M 97 129 Q 100 135 103 129 Z"
              fill="#fb7185"
            />
          )}

          {/* Whiskers */}
          <g stroke="#d8b4fe" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
            <line x1="52" y1="122" x2="63" y2="124" />
            <line x1="53" y1="129" x2="64" y2="128" />
            <line x1="137" y1="124" x2="148" y2="122" />
            <line x1="136" y1="128" x2="147" y2="129" />
          </g>

          {/* === HOODIE BODY === */}
          {/* Main Torso */}
          <path
            d="M 64 150 Q 56 195 62 215 Q 100 224 138 215 Q 144 195 136 150 Q 100 156 64 150 Z"
            fill="url(#hoodieBodyGrad)"
            filter="url(#plushGlow)"
          />

          {/* Center Pocket / Belly pouch */}
          <path
            d="M 78 180 Q 100 176 122 180 Q 120 205 100 207 Q 80 205 78 180 Z"
            fill={style.hoodiePocket}
            opacity="0.95"
          />

          {/* Hoodie Drawstrings */}
          <g stroke={style.drawstring} strokeWidth="3" strokeLinecap="round">
            <line x1="90" y1="154" x2="88" y2="174" />
            <circle cx="88" cy="175" r="2.5" fill={style.hoodRim} stroke={style.drawstring} strokeWidth="1" />
            <line x1="110" y1="154" x2="112" y2="174" />
            <circle cx="112" cy="175" r="2.5" fill={style.hoodRim} stroke={style.drawstring} strokeWidth="1" />
          </g>

          {/* Hoodie Badge / Accessory */}
          <text x="100" y="196" fontSize="13" textAnchor="middle" dominantBaseline="middle">
            {style.accessory}
          </text>

          {/* === PAWS / HANDS === */}
          {/* Left Hand: Waves if wave state! */}
          <g 
            className="origin-[60px_165px]"
            style={{
              animation: (activeState === 'wave' || activeState === 'dance') 
                ? 'bunny-wave 0.5s ease-in-out infinite' 
                : undefined,
            }}
          >
            <ellipse cx="54" cy="170" rx="11" ry="12" fill={style.earColor} />
            {/* Paw pads */}
            <circle cx="53" cy="170" r="3.5" fill="#fbcfe8" />
            <circle cx="48" cy="166" r="1.5" fill="#fbcfe8" />
            <circle cx="53" cy="164" r="1.5" fill="#fbcfe8" />
            <circle cx="58" cy="166" r="1.5" fill="#fbcfe8" />
          </g>

          {/* Right Hand */}
          <g 
            className="origin-[140px_165px]"
            style={{
              animation: activeState === 'dance' 
                ? 'bunny-wave 0.5s ease-in-out infinite 0.25s' 
                : undefined,
            }}
          >
            <ellipse cx="146" cy="170" rx="11" ry="12" fill={style.earColor} />
            {/* Paw pads */}
            <circle cx="147" cy="170" r="3.5" fill="#fbcfe8" />
            <circle cx="142" cy="166" r="1.5" fill="#fbcfe8" />
            <circle cx="147" cy="164" r="1.5" fill="#fbcfe8" />
            <circle cx="152" cy="166" r="1.5" fill="#fbcfe8" />
          </g>

          {/* Feet */}
          <ellipse cx="78" cy="222" rx="14" ry="10" fill={style.earColor} />
          <ellipse cx="78" cy="223" rx="7" ry="5" fill="#fbcfe8" />
          <ellipse cx="122" cy="222" rx="14" ry="10" fill={style.earColor} />
          <ellipse cx="122" cy="223" rx="7" ry="5" fill="#fbcfe8" />

          {/* Crown accessory if royal */}
          {costumeId === 'royal_crown' && (
            <path
              d="M 85 58 L 92 68 L 100 52 L 108 68 L 115 58 L 113 72 L 87 72 Z"
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="1.5"
            />
          )}

          {/* Wizard hat if magic */}
          {costumeId === 'magic_wizard' && (
            <path
              d="M 68 64 L 100 18 L 132 64 Z"
              fill="#4338ca"
              stroke="#818cf8"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Tactile ground shadow */}
        <div className="absolute -bottom-2 w-32 h-4 bg-purple-900/15 rounded-full blur-sm" />
      </div>

      {interactive && (
        <span className="text-[11px] font-semibold text-purple-600/80 mt-1 bg-white/70 px-2 py-0.5 rounded-full shadow-xs">
          Sentuh Lumi! 🐾
        </span>
      )}
    </div>
  );
};
