import React from 'react';
import { PlayerStats, AchievementItem } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../utils/storage';
import { soundManager } from '../utils/sound';
import { X, Trophy, CheckCircle2, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onClaimAchievement: (achievementId: string, rewardCoins: number, rewardStars: number) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onClaimAchievement,
}) => {
  if (!isOpen) return null;

  // Compute progress for each achievement based on actual stats
  const getAchievementProgress = (achId: string): number => {
    switch (achId) {
      case 'first_game':
        return stats.gamesPlayed;
      case 'word_master_5':
        return stats.wordsGuessed;
      case 'emoji_solver_5':
        return stats.emojisSolved;
      case 'puzzle_hero':
        return stats.puzzlesCompleted;
      case 'speedy_finger':
        return Math.max(stats.speedHighScores.mudah, stats.speedHighScores.sedang, stats.speedHighScores.sulit);
      case 'mystery_seeker':
        return stats.riddlesSolved;
      case 'fashion_icon':
        return stats.unlockedCostumes.length - 1; // excluding default
      case 'coin_hoarder':
        return stats.coins;
      default:
        return 0;
    }
  };

  const handleClaim = (ach: AchievementItem) => {
    soundManager.playFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c084fc', '#f472b6', '#38bdf8', '#fde047'],
    });
    onClaimAchievement(ach.id, ach.rewardCoins, ach.rewardStars);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="dreamy-card w-full max-w-lg rounded-3xl p-5 max-h-[90vh] flex flex-col shadow-2xl relative border-4 border-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-purple-900 leading-none">
                Pencapaian & Medali
              </h2>
              <span className="text-xs text-purple-600 font-semibold">
                Selesaikan misi & dapatkan hadiah berharga!
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

        {/* List of achievements */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-3">
          {INITIAL_ACHIEVEMENTS.map(ach => {
            const rawProgress = getAchievementProgress(ach.id);
            const currentProgress = Math.min(ach.target, rawProgress);
            const isCompleted = currentProgress >= ach.target;
            const isClaimed = stats.achievementsClaimed.includes(ach.id);
            const percent = Math.min(100, Math.round((currentProgress / ach.target) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                  isClaimed
                    ? 'border-emerald-200 bg-emerald-50/70 opacity-80'
                    : isCompleted
                    ? 'border-amber-300 bg-amber-50/90 shadow-sm ring-2 ring-amber-200'
                    : 'border-purple-200 bg-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0 border border-purple-100">
                    {ach.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-purple-950">
                      {ach.title}
                    </h4>
                    <p className="text-[11px] text-purple-700/90 font-medium">
                      {ach.description}
                    </p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-24 sm:w-32 h-2 bg-purple-200/80 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-purple-700">
                        {currentProgress}/{ach.target}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="shrink-0">
                  {isClaimed ? (
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Selesai</span>
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(ach)}
                      className="btn-3d btn-3d-yellow px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 animate-bounce"
                    >
                      <Gift className="w-4 h-4 text-amber-950" />
                      <span>Klaim!</span>
                    </button>
                  ) : (
                    <div className="text-[11px] font-bold text-purple-700/70 bg-purple-100/60 px-2 py-1 rounded-xl text-center">
                      <span>🪙 +{ach.rewardCoins}</span>
                      <br />
                      <span>⭐ +{ach.rewardStars}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
