import React, { useState } from 'react';
import { PlayerStats } from '../types/game';
import { soundManager } from '../utils/sound';
import { X, Volume2, VolumeX, Music, RotateCcw, User, Info, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onResetProgress: () => void;
}

const AVATAR_OPTIONS = ['🐰', '🐻', '🐱', '🦊', '🐼', '🦄', '🐶', '🐨'];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
  onResetProgress,
}) => {
  const [playerName, setPlayerName] = useState(stats.name);
  const [selectedAvatar, setSelectedAvatar] = useState(stats.avatar);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    onUpdateStats({
      name: playerName.trim() || 'Petualang Mimpi',
      avatar: selectedAvatar,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleToggleSound = () => {
    const next = !stats.soundEnabled;
    soundManager.setSoundEnabled(next);
    onUpdateStats({ soundEnabled: next });
    if (next) soundManager.playClick();
  };

  const handleToggleMusic = () => {
    const next = !stats.musicEnabled;
    soundManager.setMusicEnabled(next);
    onUpdateStats({ musicEnabled: next });
    if (next) soundManager.playClick();
  };

  const handleVolumeChange = (val: number) => {
    soundManager.setVolume(val);
    onUpdateStats({ soundVolume: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="dreamy-card w-full max-w-lg rounded-3xl p-5 max-h-[90vh] flex flex-col shadow-2xl relative border-4 border-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-purple-900 leading-none">
                Pengaturan Permainan
              </h2>
              <span className="text-xs text-purple-600 font-semibold">
                Sesuaikan profil dan efek audio sesukamu
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-4">
          {/* Profile Section */}
          <div className="bg-white/90 border-2 border-purple-200 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs sm:text-sm font-extrabold text-purple-900">
                Profil Pemain
              </h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-purple-700 block mb-1">
                  Nama Panggilan:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={18}
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-purple-200 text-purple-950 font-bold text-xs sm:text-sm focus:outline-none focus:border-purple-500 bg-purple-50/50"
                    placeholder="Masukkan namamu..."
                  />
                  <button
                    type="submit"
                    className="btn-3d btn-3d-purple px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1"
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <span>Simpan</span>}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-purple-700 block mb-1">
                  Pilih Avatar:
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all ${
                        selectedAvatar === emoji
                          ? 'bg-purple-600 text-white scale-110 shadow-sm ring-2 ring-purple-300'
                          : 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Audio Controls */}
          <div className="bg-white/90 border-2 border-purple-200 rounded-2xl p-3.5 shadow-xs space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-purple-900 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>Suara & Musik Fantasi</span>
            </h3>

            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-900 block">Efek Suara (SFX)</span>
                <span className="text-[11px] text-purple-600">Suara klik, lonceng, dan reaksi boneka</span>
              </div>
              <button
                onClick={handleToggleSound}
                className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                  stats.soundEnabled ? 'btn-3d-green' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stats.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{stats.soundEnabled ? 'Aktif' : 'Mati'}</span>
              </button>
            </div>

            {/* Music BGM Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-900 block">Musik Latar (BGM)</span>
                <span className="text-[11px] text-purple-600">Melodi lembut dunia mimpi santai</span>
              </div>
              <button
                onClick={handleToggleMusic}
                className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                  stats.musicEnabled ? 'btn-3d-pink' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>{stats.musicEnabled ? 'Aktif' : 'Mati'}</span>
              </button>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-bold text-purple-700 mb-1">
                <span>Tingkat Volume:</span>
                <span>{Math.round(stats.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={stats.soundVolume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          {/* About Dreamy Play */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3 text-xs text-purple-800 space-y-1">
            <div className="flex items-center gap-1 font-bold text-purple-950">
              <Info className="w-3.5 h-3.5 text-purple-600" />
              <span>DREAMY PLAY v1.0</span>
            </div>
            <p className="italic text-purple-700">"Play, Laugh, and Discover!"</p>
            <p className="text-[11px] leading-relaxed">
              Didesain khusus untuk smartphone Android dan tablet dengan tampilan ceria, ramah anak, dan bebas stres. Semua progres permainan tersimpan aman di perambanmu.
            </p>
          </div>

          {/* Reset Progress Section */}
          <div className="pt-2">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full text-xs font-bold text-rose-500 hover:text-rose-600 py-1.5 underline text-center"
              >
                Reset Semua Data & Progres Permainan
              </button>
            ) : (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 text-center space-y-2">
                <span className="text-xs font-bold text-rose-800 block">
                  Yakin ingin menghapus semua koin, bintang, dan kostum?
                </span>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      onResetProgress();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="bg-rose-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs"
                  >
                    Ya, Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-gray-200 text-gray-700 font-bold text-xs px-3 py-1.5 rounded-xl"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
