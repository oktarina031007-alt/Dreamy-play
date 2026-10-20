import React, { useState } from 'react';
import { CostumeId, BackgroundId, CostumeItem, BackgroundThemeItem } from '../types/game';
import { INITIAL_COSTUMES, INITIAL_BACKGROUNDS } from '../utils/storage';
import { soundManager } from '../utils/sound';
import { BunnyCharacter } from './BunnyCharacter';
import { X, Check, Lock, Sparkles, Shirt, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  equippedCostume: CostumeId;
  equippedBackground: BackgroundId;
  unlockedCostumes: CostumeId[];
  unlockedBackgrounds: BackgroundId[];
  onEquipCostume: (id: CostumeId) => void;
  onEquipBackground: (id: BackgroundId) => void;
  onUnlockCostume: (id: CostumeId, price: number) => void;
  onUnlockBackground: (id: BackgroundId, price: number) => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  onClose,
  coins,
  equippedCostume,
  equippedBackground,
  unlockedCostumes,
  unlockedBackgrounds,
  onEquipCostume,
  onEquipBackground,
  onUnlockCostume,
  onUnlockBackground,
}) => {
  const [tab, setTab] = useState<'costumes' | 'backgrounds'>('costumes');
  const [previewCostume, setPreviewCostume] = useState<CostumeId>(equippedCostume);

  if (!isOpen) return null;

  const handleBuyCostume = (costume: CostumeItem) => {
    if (coins < costume.price) {
      soundManager.playWrong();
      return;
    }
    soundManager.playFanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onUnlockCostume(costume.id, costume.price);
    onEquipCostume(costume.id);
    setPreviewCostume(costume.id);
  };

  const handleBuyBackground = (bg: BackgroundThemeItem) => {
    if (coins < bg.price) {
      soundManager.playWrong();
      return;
    }
    soundManager.playFanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onUnlockBackground(bg.id, bg.price);
    onEquipBackground(bg.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="dreamy-card w-full max-w-lg rounded-3xl p-5 max-h-[90vh] flex flex-col shadow-2xl relative border-4 border-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎀</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-purple-900 leading-none">
                Koleksi & Lemari Ajaib
              </h2>
              <span className="text-xs text-purple-600 font-semibold">
                Koin Tersedia: <span className="text-amber-700 font-black">🪙 {coins}</span>
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

        {/* Live Bunny Preview in center */}
        <div className="my-2 py-2 bg-gradient-to-b from-purple-100/50 to-pink-100/50 rounded-2xl flex flex-col items-center justify-center border border-purple-200">
          <BunnyCharacter
            costumeId={previewCostume}
            state="dance"
            size="md"
            showSpeech={true}
            speechText="Bagaimana penampilanku? Cantik kan? ✨"
          />
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1 bg-purple-100/80 rounded-2xl mb-3">
          <button
            onClick={() => {
              soundManager.playClick();
              setTab('costumes');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'costumes' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Kostum Boneka</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setTab('backgrounds');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'backgrounds' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Latar Fantasi</span>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pb-2">
          {tab === 'costumes' ? (
            INITIAL_COSTUMES.map(costume => {
              const isUnlocked = unlockedCostumes.includes(costume.id);
              const isEquipped = equippedCostume === costume.id;
              const canAfford = coins >= costume.price;

              return (
                <div
                  key={costume.id}
                  onClick={() => setPreviewCostume(costume.id)}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    previewCostume === costume.id
                      ? 'border-purple-500 bg-purple-50/90 shadow-sm'
                      : 'border-purple-200 bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-xs"
                      style={{ backgroundColor: costume.color }}
                    >
                      {costume.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-xs sm:text-sm text-purple-950">
                          {costume.name}
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                          {costume.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-700 line-clamp-1">
                        {costume.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isEquipped ? (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Dipakai</span>
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          soundManager.playClick();
                          onEquipCostume(costume.id);
                          setPreviewCostume(costume.id);
                        }}
                        className="btn-3d btn-3d-purple px-3 py-1.5 rounded-xl text-xs font-bold"
                      >
                        Pakai
                      </button>
                    ) : (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleBuyCostume(costume);
                        }}
                        disabled={!canAfford}
                        className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 ${
                          canAfford ? 'btn-3d-yellow' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>🪙 {costume.price}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            INITIAL_BACKGROUNDS.map(bg => {
              const isUnlocked = unlockedBackgrounds.includes(bg.id);
              const isEquipped = equippedBackground === bg.id;
              const canAfford = coins >= bg.price;

              return (
                <div
                  key={bg.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                    isEquipped
                      ? 'border-purple-500 bg-purple-50/90 shadow-sm'
                      : 'border-purple-200 bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-200 to-pink-200 flex items-center justify-center text-2xl shadow-xs border border-purple-200">
                      {bg.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-purple-950">
                        {bg.name}
                      </h4>
                      <p className="text-[11px] text-purple-700 line-clamp-1">
                        {bg.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isEquipped ? (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Aktif</span>
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onEquipBackground(bg.id);
                        }}
                        className="btn-3d btn-3d-purple px-3 py-1.5 rounded-xl text-xs font-bold"
                      >
                        Pasang
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyBackground(bg)}
                        disabled={!canAfford}
                        className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 ${
                          canAfford ? 'btn-3d-yellow' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>🪙 {bg.price}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
