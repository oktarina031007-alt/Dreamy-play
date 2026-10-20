import React from 'react';
import { PlayerStats } from '../types/game';
import { soundManager } from '../utils/sound';
import { Volume2, VolumeX, Music, Settings, ArrowLeft } from 'lucide-react';

interface HeaderBarProps {
  stats: PlayerStats;
  onOpenSettings: () => void;
  onBackToHome?: () => void;
  inGameTitle?: string;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  stats,
  onOpenSettings,
  onBackToHome,
  inGameTitle,
  onToggleSound,
  onToggleMusic,
}) => {
  const xpPercent = Math.min(100, Math.round((stats.xp / stats.xpToNextLevel) * 100));

  return (
    <header className="w-full px-3 py-2.5 sm:px-5 sm:py-3 sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b-2 border-purple-200/60 shadow-xs">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Back button or Player Profile */}
        {inGameTitle && onBackToHome ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onBackToHome();
              }}
              className="btn-3d btn-3d-white p-2 rounded-2xl flex items-center gap-1.5 font-bold text-xs sm:text-sm text-purple-800"
              title="Kembali ke Menu Utama"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Menu</span>
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-purple-600 font-semibold uppercase tracking-wider">Mini Game</span>
              <h2 className="text-sm sm:text-base font-extrabold text-purple-900 leading-tight line-clamp-1">{inGameTitle}</h2>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 active:scale-95 transition-transform"
            title="Klik untuk ubah profil"
          >
            {/* Avatar Pill */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-400 to-pink-300 flex items-center justify-center text-lg shadow-sm border-2 border-white">
              <span>{stats.avatar}</span>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-[10px] font-black text-amber-950 px-1 rounded-md shadow-xs border border-white">
                {stats.level}
              </div>
            </div>

            {/* Name & XP Bar */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold text-purple-900 leading-none">
                {stats.name}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-16 sm:w-24 h-2 bg-purple-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-purple-600">
                  {stats.xp}/{stats.xpToNextLevel} XP
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Right: Currency Counters & Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Coin Badge */}
          <div className="flex items-center gap-1 bg-amber-100/90 border border-amber-300 px-2 py-1 rounded-full shadow-xs">
            <span className="text-sm animate-bounce" style={{ animationDuration: '3s' }}>🪙</span>
            <span className="text-xs sm:text-sm font-black text-amber-900 tracking-tight">
              {stats.coins}
            </span>
          </div>

          {/* Star Badge */}
          <div className="flex items-center gap-1 bg-purple-100/90 border border-purple-300 px-2 py-1 rounded-full shadow-xs">
            <span className="text-sm animate-pulse" style={{ animationDuration: '2s' }}>⭐</span>
            <span className="text-xs sm:text-sm font-black text-purple-900 tracking-tight">
              {stats.stars}
            </span>
          </div>

          {/* Sound Effect Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundManager.playClick();
            }}
            className={`p-1.5 rounded-xl border transition-all ${
              stats.soundEnabled
                ? 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
                : 'bg-gray-100 text-gray-400 border-gray-300'
            }`}
            title={stats.soundEnabled ? 'Matikan Suara SFX' : 'Nyalakan Suara SFX'}
          >
            {stats.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Music Toggle */}
          <button
            onClick={() => {
              onToggleMusic();
              soundManager.playClick();
            }}
            className={`p-1.5 rounded-xl border transition-all ${
              stats.musicEnabled
                ? 'bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200'
                : 'bg-gray-100 text-gray-400 border-gray-300'
            }`}
            title={stats.musicEnabled ? 'Matikan Musik Latar' : 'Nyalakan Musik Latar'}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="p-1.5 rounded-xl bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200 transition-all"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
