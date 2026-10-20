import React from 'react';
import { GameType } from '../types/game';
import { soundManager } from '../utils/sound';
import { X, Play, Sparkles, BookOpen, Smile, Puzzle, Zap, HelpCircle } from 'lucide-react';

interface GamePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (game: GameType) => void;
}

const GAMES_LIST: {
  id: GameType;
  title: string;
  slogan: string;
  description: string;
  icon: string;
  lucideIcon: React.ReactNode;
  badge: string;
  bgGradient: string;
  borderColor: string;
}[] = [
  {
    id: 'tebak_kata',
    title: 'Tebak Kata',
    slogan: 'Susun huruf & temukan kata rahasia!',
    description: 'Pecahkan teka-teki kata bertema alam, camilan, dan petualangan dengan menyusun gelembung huruf.',
    icon: '🔤',
    lucideIcon: <BookOpen className="w-6 h-6 text-purple-600" />,
    badge: 'Kreatif',
    bgGradient: 'from-purple-100 to-indigo-100',
    borderColor: 'border-purple-300',
  },
  {
    id: 'tebak_emoji',
    title: 'Tebak Emoji',
    slogan: 'Kombinasi emoji penuh kejutan!',
    description: 'Tebak arti dari gabungan emoji lucu dan menggemaskan untuk mengasah imajinasimu.',
    icon: '😍',
    lucideIcon: <Smile className="w-6 h-6 text-pink-600" />,
    badge: 'Populer',
    bgGradient: 'from-pink-100 to-rose-100',
    borderColor: 'border-pink-300',
  },
  {
    id: 'puzzle',
    title: 'Puzzle Ajaib',
    slogan: 'Tukar gambar & pasangkan kartu!',
    description: 'Dua mode seru: puzzle geser kotak gambar 3x3 dan kartu memori berpasangan dengan animasi 3D.',
    icon: '🧩',
    lucideIcon: <Puzzle className="w-6 h-6 text-cyan-600" />,
    badge: 'Logika',
    bgGradient: 'from-cyan-100 to-blue-100',
    borderColor: 'border-cyan-300',
  },
  {
    id: 'tantangan_cepat',
    title: 'Tantangan Cepat',
    slogan: 'Uji refleks jarimu secepat kilat!',
    description: 'Tangkap bintang, permen, dan gelembung mimpi yang berjatuhan sebelum waktu habis. Hindari awan petir!',
    icon: '⚡',
    lucideIcon: <Zap className="w-6 h-6 text-amber-600" />,
    badge: 'Aksi Kilat',
    bgGradient: 'from-amber-100 to-yellow-100',
    borderColor: 'border-amber-300',
  },
  {
    id: 'teka_teki_misteri',
    title: 'Teka-Teki Misteri',
    slogan: 'Pecahkan teka-teki & buka peti!',
    description: 'Pecahkan teka-teki unik penuh misteri bersama Lumi dan dapatkan kesempatan membuka peti harta karun.',
    icon: '🗝️',
    lucideIcon: <HelpCircle className="w-6 h-6 text-fuchsia-600" />,
    badge: 'Harta Karun',
    bgGradient: 'from-fuchsia-100 to-purple-100',
    borderColor: 'border-fuchsia-300',
  },
];

export const GamePickerModal: React.FC<GamePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectGame,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="dreamy-card w-full max-w-lg rounded-3xl p-5 max-h-[90vh] flex flex-col shadow-2xl relative border-4 border-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin" style={{ animationDuration: '6s' }}>🎡</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-purple-900 leading-none">
                Pilih Mini Game
              </h2>
              <span className="text-xs text-purple-600 font-semibold">
                5 permainan seru untuk melatih kreativitasmu!
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

        {/* Game List Scrollable Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-3">
          {GAMES_LIST.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                soundManager.playClick();
                onSelectGame(game.id);
                onClose();
              }}
              className={`bg-gradient-to-r ${game.bgGradient} border-2 ${game.borderColor} rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
                  {game.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-purple-950">
                      {game.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-purple-700 shadow-2xs">
                      {game.badge}
                    </span>
                  </div>
                  <p className="text-xs text-purple-800/90 font-medium line-clamp-1 mt-0.5">
                    {game.slogan}
                  </p>
                </div>
              </div>

              <button className="btn-3d btn-3d-purple px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 shrink-0">
                <Play className="w-3.5 h-3.5 fill-white" />
                <span className="hidden xs:inline">Main</span>
              </button>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-purple-100 text-center">
          <p className="text-[11px] text-purple-600 font-semibold">
            ✨ Raih koin dan bintang di setiap permainan untuk membuka kostum Lumi!
          </p>
        </div>
      </div>
    </div>
  );
};
