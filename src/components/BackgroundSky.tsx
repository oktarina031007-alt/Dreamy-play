import React, { useState } from 'react';
import { BackgroundId } from '../types/game';
import { soundManager } from '../utils/sound';

interface BackgroundSkyProps {
  themeId?: BackgroundId;
  children: React.ReactNode;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

export const BackgroundSky: React.FC<BackgroundSkyProps> = ({
  themeId = 'lavender_dream',
  children,
}) => {
  // Theme gradients and styles
  const themes: Record<BackgroundId, {
    bgGradient: string;
    cloudFill: string;
    cloudOpacity: number;
    starColor: string;
    bubbleColors: string[];
    isNight: boolean;
  }> = {
    lavender_dream: {
      bgGradient: 'bg-gradient-to-b from-[#f3e8ff] via-[#e9d5ff] to-[#fce7f3]',
      cloudFill: '#ffffff',
      cloudOpacity: 0.65,
      starColor: '#e9d5ff',
      bubbleColors: ['#d8b4fe', '#fbcfe8', '#bae6fd', '#ffffff'],
      isNight: false,
    },
    cotton_candy: {
      bgGradient: 'bg-gradient-to-b from-[#fff1f2] via-[#fce7f3] to-[#fbcfe8]',
      cloudFill: '#ffffff',
      cloudOpacity: 0.7,
      starColor: '#f472b6',
      bubbleColors: ['#f472b6', '#fb7185', '#fde047', '#ffffff'],
      isNight: false,
    },
    starry_midnight: {
      bgGradient: 'bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81]',
      cloudFill: '#4338ca',
      cloudOpacity: 0.35,
      starColor: '#fef08a',
      bubbleColors: ['#38bdf8', '#818cf8', '#c084fc', '#fef08a'],
      isNight: true,
    },
    rainbow_kingdom: {
      bgGradient: 'bg-gradient-to-b from-[#e0f2fe] via-[#fef9c3] to-[#fce7f3]',
      cloudFill: '#ffffff',
      cloudOpacity: 0.75,
      starColor: '#38bdf8',
      bubbleColors: ['#38bdf8', '#4ade80', '#f472b6', '#fbbf24'],
      isNight: false,
    },
  };

  const currentTheme = themes[themeId] || themes.lavender_dream;

  // Dynamic interactive bubbles that can be popped
  const [bubbles, setBubbles] = useState<Bubble[]>([
    { id: 1, x: 15, y: 35, size: 42, speed: 18, color: '#d8b4fe' },
    { id: 2, x: 82, y: 20, size: 55, speed: 22, color: '#fbcfe8' },
    { id: 3, x: 45, y: 70, size: 36, speed: 15, color: '#bae6fd' },
    { id: 4, x: 25, y: 85, size: 48, speed: 20, color: '#ffffff' },
    { id: 5, x: 75, y: 60, size: 40, speed: 17, color: '#d8b4fe' },
  ]);

  const [poppedBubbles, setPoppedBubbles] = useState<{ id: number; x: number; y: number }[]>([]);

  const popBubble = (b: Bubble, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    soundManager.playPop();

    // Spawn pop sparkle
    setPoppedBubbles(prev => [...prev, { id: Date.now(), x: b.x, y: b.y }]);
    setTimeout(() => {
      setPoppedBubbles(prev => prev.filter(p => Date.now() - p.id < 600));
    }, 600);

    // Reset bubble position to bottom
    setBubbles(prev =>
      prev.map(item =>
        item.id === b.id
          ? {
              ...item,
              y: 105,
              x: Math.floor(Math.random() * 80) + 10,
              size: Math.floor(Math.random() * 25) + 32,
            }
          : item
      )
    );
  };

  return (
    <div className={`relative min-h-screen w-full ${currentTheme.bgGradient} overflow-hidden transition-colors duration-700`}>
      {/* Background Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating Clouds */}
        <div 
          className="absolute top-6 left-0 w-64 h-24 opacity-75"
          style={{
            animation: 'cloud-drift 38s linear infinite',
          }}
        >
          <svg viewBox="0 0 160 80" fill={currentTheme.cloudFill} opacity={currentTheme.cloudOpacity}>
            <circle cx="50" cy="50" r="30" />
            <circle cx="85" cy="40" r="35" />
            <circle cx="120" cy="50" r="28" />
            <rect x="35" y="50" width="100" height="25" rx="10" />
          </svg>
        </div>

        <div 
          className="absolute top-28 left-0 w-48 h-18 opacity-60"
          style={{
            animation: 'cloud-drift 50s linear infinite -15s',
          }}
        >
          <svg viewBox="0 0 160 80" fill={currentTheme.cloudFill} opacity={currentTheme.cloudOpacity}>
            <circle cx="50" cy="50" r="25" />
            <circle cx="85" cy="40" r="30" />
            <circle cx="120" cy="50" r="22" />
            <rect x="35" y="50" width="95" height="20" rx="10" />
          </svg>
        </div>

        <div 
          className="absolute top-72 left-0 w-80 h-28 opacity-40"
          style={{
            animation: 'cloud-drift 45s linear infinite -28s',
          }}
        >
          <svg viewBox="0 0 160 80" fill={currentTheme.cloudFill} opacity={currentTheme.cloudOpacity}>
            <circle cx="45" cy="45" r="35" />
            <circle cx="90" cy="35" r="40" />
            <circle cx="130" cy="45" r="30" />
            <rect x="30" y="45" width="115" height="30" rx="12" />
          </svg>
        </div>

        {/* Twinkling Stars */}
        {[
          { top: '8%', left: '15%', delay: '0s', size: 16 },
          { top: '14%', left: '80%', delay: '1.2s', size: 20 },
          { top: '22%', left: '35%', delay: '0.6s', size: 14 },
          { top: '30%', left: '88%', delay: '2s', size: 18 },
          { top: '45%', left: '8%', delay: '1.5s', size: 14 },
          { top: '65%', left: '92%', delay: '0.8s', size: 16 },
          { top: '80%', left: '18%', delay: '2.5s', size: 22 },
        ].map((star, idx) => (
          <div
            key={idx}
            className="absolute animate-twinkle pointer-events-none"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
            }}
          >
            <svg width={star.size} height={star.size} viewBox="0 0 24 24" fill={currentTheme.starColor}>
              <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2Z" opacity="0.85" />
            </svg>
          </div>
        ))}
      </div>

      {/* Interactive Floating Poppable Bubbles */}
      <div className="absolute inset-0 pointer-events-auto z-1 overflow-hidden">
        {bubbles.map(b => (
          <div
            key={b.id}
            onClick={(e) => popBubble(b, e)}
            onTouchStart={(e) => popBubble(b, e)}
            className="absolute rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-90 flex items-center justify-center select-none"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              background: `radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9), ${b.color} 55%, rgba(255, 255, 255, 0.1) 100%)`,
              boxShadow: 'inset -2px -2px 6px rgba(126, 34, 206, 0.2), 0 4px 10px rgba(0, 0, 0, 0.05)',
              border: '1.5px solid rgba(255, 255, 255, 0.7)',
              animation: `gentle-float ${b.speed / 4}s ease-in-out infinite`,
            }}
            title="Pecahkan gelembung!"
          >
            {/* Glossy bubble glare */}
            <div className="absolute top-1.5 left-2 w-2.5 h-2.5 rounded-full bg-white opacity-80" />
            <div className="absolute top-4 left-1.5 w-1 h-1 rounded-full bg-white opacity-60" />
          </div>
        ))}

        {/* Popped Sparkle Flash */}
        {poppedBubbles.map(p => (
          <div
            key={p.id}
            className="absolute pointer-events-none text-xl animate-ping flex items-center justify-center font-bold text-purple-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Foreground Interactive Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
