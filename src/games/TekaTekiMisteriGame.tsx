import React, { useState } from 'react';
import { GameDifficulty, BunnyAnimationState } from '../types/game';
import { soundManager } from '../utils/sound';
import { BunnyCharacter } from '../components/BunnyCharacter';
import { Sparkles, ArrowRight, Gift, Key, CheckCircle2, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MysteryRiddle {
  riddle: string;
  answer: string;
  options: string[];
  explanation: string;
  category: string;
}

const MYSTERY_DATABASE: Record<GameDifficulty, MysteryRiddle[]> = {
  mudah: [
    {
      riddle: 'Aku punya banyak gigi, tapi tidak pernah bisa menggigit siapapun. Siapakah aku?',
      answer: 'Sisir Rambut',
      options: ['Sisir Rambut', 'Ikan Hiu', 'Gergaji Kayu', 'Ritsleting'],
      explanation: 'Sisir memiliki deretan gigi rapat untuk merapikan rambut indahmu!',
      category: 'Benda Sehari-hari',
    },
    {
      riddle: 'Bisa terbang tanpa sayap, bisa menangis tanpa mata, dan membuat bumi basah. Siapakah aku?',
      answer: 'Awan Hujan',
      options: ['Burung Elang', 'Awan Hujan', 'Balon Gas', 'Pesawat Terbang'],
      explanation: 'Awan melayang ditiup angin dan menjatuhkan air hujan ke bumi!',
      category: 'Alam Fantasi',
    },
    {
      riddle: 'Punya leher tapi tidak punya kepala. Sering diisi air dingin yang segar. Siapakah aku?',
      answer: 'Botol Minuman',
      options: ['Jerapah', 'Botol Minuman', 'Kemeja Batik', 'Sendok Makan'],
      explanation: 'Botol memiliki leher botol yang ramping untuk menuang air!',
      category: 'Benda Rumah',
    },
  ],
  sedang: [
    {
      riddle: 'Aku memiliki banyak tuts atau kunci, tetapi tidak bisa membuka satu pintu pun. Siapakah aku?',
      answer: 'Piano Musik',
      options: ['Gantungan Kunci', 'Piano Musik', 'Pintu Gerbang', 'Lemari Rahasia'],
      explanation: 'Piano memiliki tombol tuts (keys) nada yang menghasilkan melodi indah!',
      category: 'Alat Musik',
    },
    {
      riddle: 'Selalu ada di belakangmu saat ada cahaya, tapi langsung menghilang di tempat gelap gulita. Siapakah aku?',
      answer: 'Bayangan Tubuh',
      options: ['Cermin Ajaib', 'Bayangan Tubuh', 'Lampu Tidur', 'Kucing Hitam'],
      explanation: 'Bayangan terbentuk ketika tubuhmu menghalangi pancaran sinar cahaya!',
      category: 'Misteri Cahaya',
    },
    {
      riddle: 'Makin banyak diambil darinya, maka ia akan menjadi semakin besar dan luas. Apakah itu?',
      answer: 'Lubang Galian',
      options: ['Kue Bolu', 'Lubang Galian', 'Kotak Permen', 'Gunung Salju'],
      explanation: 'Semakin banyak tanah yang kamu gali, maka lubangnya makin besar!',
      category: 'Teka-Teki Logika',
    },
  ],
  sulit: [
    {
      riddle: 'Aku selalu ada tepat di hadapanmu sepanjang waktu, namun kamu tidak pernah bisa melihatnya sekarang. Apakah aku?',
      answer: 'Masa Depan',
      options: ['Kacamata', 'Masa Depan', 'Hidungmu', 'Udara Segar'],
      explanation: 'Masa depan selalu menanti di depan perjalanan hidup setiap orang!',
      category: 'Filsafat Waktu',
    },
    {
      riddle: 'Bisa berlari kencang tanpa punya kaki, punya mulut tapi tidak bisa bicara, punya tempat tidur tapi tidak pernah tidur. Siapakah aku?',
      answer: 'Sungai Mengalir',
      options: ['Sungai Mengalir', 'Kereta Api', 'Angin Topan', 'Air Terjun'],
      explanation: 'Sungai memiliki hulu, muara (mouth), dan palung sungai (riverbed)!',
      category: 'Misteri Alam',
    },
    {
      riddle: 'Makin basah saat mengeringkan sesuatu. Sering kamu temukan di kamar mandi. Siapakah aku?',
      answer: 'Handuk Lembut',
      options: ['Spons Sabun', 'Handuk Lembut', 'Pengering Rambut', 'Payung Lipat'],
      explanation: 'Handuk menyerap air dari tubuhmu sehingga handuknya yang jadi basah!',
      category: 'Teka-Teki Unik',
    },
  ],
};

// 3 Mystery Chests
const MYSTERY_CHESTS = [
  { id: 1, name: 'Peti Bintang', color: 'from-amber-300 to-amber-500', icon: '⭐' },
  { id: 2, name: 'Peti Kristal', color: 'from-cyan-300 to-blue-500', icon: '💎' },
  { id: 3, name: 'Peti Mahkota', color: 'from-purple-400 to-fuchsia-600', icon: '👑' },
];

interface TekaTekiMisteriGameProps {
  onWinRound: (coins: number, stars: number, xp: number) => void;
  onExit: () => void;
}

export const TekaTekiMisteriGame: React.FC<TekaTekiMisteriGameProps> = ({
  onWinRound,
  onExit,
}) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>('mudah');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [bunnyState, setBunnyState] = useState<BunnyAnimationState>('idle');
  const [speech, setSpeech] = useState<string>('Pecahkan teka-teki misteri ini!');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Mystery Box Unboxing State
  const [showChestPhase, setShowChestPhase] = useState(false);
  const [openedChestId, setOpenedChestId] = useState<number | null>(null);
  const [rewardWon, setRewardWon] = useState<{ coins: number; stars: number } | null>(null);

  const list = MYSTERY_DATABASE[difficulty];
  const currentRiddle = list[currentIndex % list.length];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentRiddle.answer) {
      soundManager.playCorrect();
      setIsCorrect(true);
      setBunnyState('jump');
      setSpeech('Tepat sekali! Kunci emas terbuka! 🗝️✨');
      setShowChestPhase(true);
    } else {
      soundManager.playWrong();
      setIsCorrect(false);
      setBunnyState('confused');
      setSpeech(`Belum tepat~ Jawabannya adalah "${currentRiddle.answer}" 😊`);
    }
  };

  const handleOpenChest = (chestId: number) => {
    if (openedChestId !== null) return;
    setOpenedChestId(chestId);
    soundManager.playFanfare();

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#c084fc', '#f472b6', '#38bdf8', '#fde047'],
    });

    const bonusCoins = Math.floor(Math.random() * 20) + 25;
    const bonusStars = Math.random() > 0.5 ? 2 : 1;
    const bonusXP = 40;

    setRewardWon({ coins: bonusCoins, stars: bonusStars });
    setBunnyState('dance');
    setSpeech('Horeee! Kamu dapat harta karun misteri! 🎁✨');

    onWinRound(bonusCoins, bonusStars, bonusXP);
  };

  const handleNextRiddle = () => {
    soundManager.playClick();
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowChestPhase(false);
    setOpenedChestId(null);
    setRewardWon(null);
    setBunnyState('idle');
    setSpeech('Pecahkan teka-teki misteri berikutnya!');
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="dreamy-card rounded-3xl p-3 mb-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1 bg-purple-100/90 p-1 rounded-2xl">
          {(['mudah', 'sedang', 'sulit'] as GameDifficulty[]).map(d => (
            <button
              key={d}
              onClick={() => {
                soundManager.playClick();
                setDifficulty(d);
                setCurrentIndex(0);
                setIsAnswered(false);
                setSelectedOption(null);
                setShowChestPhase(false);
                setOpenedChestId(null);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all capitalize ${
                difficulty === d ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded-xl">
          <Key className="w-3.5 h-3.5 text-amber-500" />
          <span>Kategori: {currentRiddle.category}</span>
        </div>
      </div>

      {/* Main Riddle Card */}
      <div className="dreamy-card rounded-3xl p-4 sm:p-5 flex flex-col items-center flex-1 shadow-md mb-3">
        {/* Bunny Animation */}
        <div className="my-1">
          <BunnyCharacter
            state={bunnyState}
            size="md"
            showSpeech={true}
            speechText={speech}
          />
        </div>

        {/* Phase 1: Riddle Question */}
        {!showChestPhase ? (
          <div className="w-full flex flex-col items-center">
            {/* Whimsical Riddle Box */}
            <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200/90 rounded-3xl p-4 my-2 shadow-xs text-center">
              <div className="flex items-center justify-center gap-1.5 text-purple-600 text-xs font-bold mb-1">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span>Teka-Teki Misteri Lumi:</span>
              </div>
              <p className="text-sm sm:text-base text-purple-950 font-bold leading-relaxed px-1">
                "{currentRiddle.riddle}"
              </p>
            </div>

            {/* Answer Options */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {currentRiddle.options.map((opt, idx) => {
                const isChosen = selectedOption === opt;
                const isRight = opt === currentRiddle.answer;

                let btnClass = 'btn-3d btn-3d-white text-purple-900 border-2 border-purple-200';
                if (isAnswered) {
                  if (isRight) btnClass = 'btn-3d-green text-white';
                  else if (isChosen) btnClass = 'bg-rose-500 text-white shadow-none';
                  else btnClass = 'opacity-40 bg-gray-100 text-gray-500';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`${btnClass} p-3 rounded-2xl font-bold text-xs sm:text-sm text-left flex items-center justify-between transition-all`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isRight && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation when answered */}
            {isAnswered && (
              <div className="mt-3 p-2.5 bg-white/90 rounded-2xl border border-purple-200 text-xs text-purple-800 text-center">
                <p className="font-semibold">{currentRiddle.explanation}</p>
              </div>
            )}
          </div>
        ) : (
          /* Phase 2: Mystery Chest Unboxing! */
          <div className="w-full flex flex-col items-center my-1 animate-fade-in">
            <h3 className="text-sm sm:text-base font-extrabold text-purple-900 mb-1 flex items-center gap-1.5">
              <span>🗝️</span>
              <span>Pilih Salah Satu Peti Harta Karun!</span>
            </h3>
            <p className="text-xs text-purple-600 mb-4 text-center">
              Kunci emas berhasil membuka kesempatan hadiah misteri!
            </p>

            {/* 3 Floating Mystery Chests */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-3">
              {MYSTERY_CHESTS.map(chest => {
                const isOpened = openedChestId === chest.id;

                return (
                  <button
                    key={chest.id}
                    onClick={() => handleOpenChest(chest.id)}
                    disabled={openedChestId !== null}
                    className={`h-28 rounded-3xl flex flex-col items-center justify-center p-2 transition-all relative ${
                      isOpened
                        ? 'btn-3d-green scale-105 ring-4 ring-emerald-300'
                        : openedChestId !== null
                        ? 'opacity-40 bg-gray-100 border border-gray-200'
                        : `bg-gradient-to-b ${chest.color} btn-3d shadow-md hover:scale-105 active:scale-95`
                    }`}
                  >
                    {isOpened ? (
                      <div className="flex flex-col items-center animate-bounce">
                        <Gift className="w-8 h-8 text-white mb-1" />
                        <span className="text-[10px] font-black text-white">TERBUKA!</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl mb-1 drop-shadow-sm">{chest.icon}</span>
                        <span className="text-[11px] font-black text-purple-950">
                          {chest.name}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Reward Won Popout */}
            {rewardWon && (
              <div className="bg-amber-100/90 border-2 border-amber-300 rounded-2xl p-3 text-center animate-bounce shadow-sm">
                <span className="text-xs font-bold text-amber-900 block">Hadiah Kamu Dapatkan:</span>
                <div className="flex items-center justify-center gap-3 mt-1 font-black text-amber-950 text-sm">
                  <span>🪙 +{rewardWon.coins} Koin</span>
                  <span>⭐ +{rewardWon.stars} Bintang</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Button */}
      <div className="flex items-center gap-2">
        {isAnswered ? (
          <button
            onClick={handleNextRiddle}
            className="btn-3d btn-3d-pink w-full p-3.5 rounded-2xl flex items-center justify-center font-black text-sm text-white animate-bounce"
          >
            <span>Teka-teki Berikutnya</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={onExit}
            className="btn-3d btn-3d-white w-full p-3.5 rounded-2xl flex items-center justify-center text-purple-700 font-bold text-xs"
          >
            <span>Kembali ke Menu</span>
          </button>
        )}
      </div>
    </div>
  );
};
