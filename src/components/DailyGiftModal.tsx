import React, { useState } from 'react';
import { soundManager } from '../utils/sound';
import { X, Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimDaily: (coins: number, stars: number, xp: number) => void;
  isAlreadyClaimedToday: boolean;
}

export const DailyGiftModal: React.FC<DailyGiftModalProps> = ({
  isOpen,
  onClose,
  onClaimDaily,
  isAlreadyClaimedToday,
}) => {
  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState<{ coins: number; stars: number; xp: number } | null>(null);

  if (!isOpen) return null;

  const handleOpenGift = () => {
    if (isAlreadyClaimedToday || opened) return;
    soundManager.playFanfare();

    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#c084fc', '#f472b6', '#38bdf8', '#fde047'],
    });

    const earnedCoins = Math.floor(Math.random() * 40) + 40;
    const earnedStars = 2;
    const earnedXP = 60;

    setReward({ coins: earnedCoins, stars: earnedStars, xp: earnedXP });
    setOpened(true);
    onClaimDaily(earnedCoins, earnedStars, earnedXP);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="dreamy-card w-full max-w-sm rounded-3xl p-5 flex flex-col items-center text-center shadow-2xl relative border-4 border-white">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h2 className="text-lg font-black text-purple-950">
            Hadiah Harian Lumi
          </h2>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <p className="text-xs text-purple-600 font-semibold mb-4">
          Buka kotak kejutan setiap hari untuk bonus koin & bintang!
        </p>

        {/* Gift Box Interactive Canvas */}
        <div className="my-3 flex flex-col items-center">
          {opened && reward ? (
            <div className="flex flex-col items-center animate-bounce">
              <div className="text-6xl mb-2">🎉</div>
              <div className="bg-amber-100/90 border-2 border-amber-300 rounded-2xl p-3 my-2 w-full max-w-xs shadow-xs">
                <span className="text-xs font-bold text-amber-900 block mb-1">Hadiah Kamu:</span>
                <div className="text-base font-black text-amber-950 flex flex-col gap-0.5">
                  <span>🪙 +{reward.coins} Koin</span>
                  <span>⭐ +{reward.stars} Bintang</span>
                  <span>✨ +{reward.xp} XP</span>
                </div>
              </div>
            </div>
          ) : isAlreadyClaimedToday ? (
            <div className="flex flex-col items-center py-4">
              <div className="text-5xl mb-2">🎁</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hadiah hari ini sudah kamu ambil!</span>
              </div>
              <span className="text-[11px] text-purple-600 mt-2">
                Kembali lagi besok untuk hadiah baru ya! ✨
              </span>
            </div>
          ) : (
            <button
              onClick={handleOpenGift}
              className="group relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 flex items-center justify-center text-5xl shadow-lg border-4 border-white animate-bounce group-hover:scale-105 transition-all">
                🎁
              </div>
              <span className="btn-3d btn-3d-yellow mt-3 px-4 py-1.5 rounded-xl text-xs font-black text-amber-950 flex items-center gap-1">
                <span>Ketuk Untuk Buka!</span>
              </span>
            </button>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="btn-3d btn-3d-white w-full p-2.5 rounded-2xl text-xs font-bold text-purple-800 mt-2"
        >
          {opened ? 'Tutup & Mainkan' : 'Nanti Saja'}
        </button>
      </div>
    </div>
  );
};
