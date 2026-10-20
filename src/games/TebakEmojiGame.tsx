import React, { useState } from 'react';
import { GameDifficulty, BunnyAnimationState } from '../types/game';
import { soundManager } from '../utils/sound';
import { BunnyCharacter } from '../components/BunnyCharacter';
import { Sparkles, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmojiRiddle {
  emojis: string[];
  answer: string;
  options: string[];
  clue: string;
}

const EMOJI_DATABASE: Record<GameDifficulty, EmojiRiddle[]> = {
  mudah: [
    {
      emojis: ['☀️', '🌻'],
      answer: 'Bunga Matahari',
      options: ['Bunga Mawar', 'Bunga Matahari', 'Matahari Terbit', 'Taman Bunga'],
      clue: 'Bunga cantik warna kuning yang selalu menghadap sang surya!',
    },
    {
      emojis: ['🍓', '🍦'],
      answer: 'Es Krim Stroberi',
      options: ['Es Krim Stroberi', 'Jus Buah Segar', 'Kue Tart Manis', 'Permen Lolipop'],
      clue: 'Camilan dingin, manis, dan segar rasa buah stroberi!',
    },
    {
      emojis: ['🌧️', '🌈'],
      answer: 'Pelangi Hujan',
      options: ['Badai Petir', 'Pelangi Hujan', 'Awan Kelabu', 'Hujan Deras'],
      clue: 'Munculnya warna-warni mempesona di langit setelah rintik reda!',
    },
    {
      emojis: ['🐱', '🐟'],
      answer: 'Kucing Makan Ikan',
      options: ['Ikan Terbang', 'Kucing Lucu', 'Kucing Makan Ikan', 'Kolam Ikan'],
      clue: 'Makanan kesukaan anabul berbulu yang lezat!',
    },
    {
      emojis: ['🌙', '😴'],
      answer: 'Tidur Nyenyak',
      options: ['Mimpi Indah', 'Tidur Nyenyak', 'Bangun Pagi', 'Malam Gelap'],
      clue: 'Aktivitas malam hari di kasur empuk bersama bantal!',
    },
  ],
  sedang: [
    {
      emojis: ['📖', '👓'],
      answer: 'Kutu Buku',
      options: ['Kacamata Hitam', 'Kutu Buku', 'Perpustakaan', 'Membaca Cerita'],
      clue: 'Julukan untuk sahabat yang sangat rajin membaca buku!',
    },
    {
      emojis: ['🏰', '👑'],
      answer: 'Istana Kerajaan',
      options: ['Benteng Megah', 'Mahkota Emas', 'Istana Kerajaan', 'Rumah Pohon'],
      clue: 'Tempat tinggal pangeran dan putri yang megah!',
    },
    {
      emojis: ['🐝', '🍯'],
      answer: 'Madu Lebah',
      options: ['Sarang Tawon', 'Bunga Mekar', 'Madu Lebah', 'Sirup Manis'],
      clue: 'Cairan kental manis keemasan yang menyehatkan!',
    },
    {
      emojis: ['🚀', '🌕'],
      answer: 'Misi Ke Bulan',
      options: ['Bintang Jatuh', 'Misi Ke Bulan', 'Teleskop Bintang', 'Roket Kembang Api'],
      clue: 'Perjalanan luar angkasa menembus atmosfer bumi!',
    },
    {
      emojis: ['🍉', '🏖️'],
      answer: 'Liburan Pantai',
      options: ['Jus Semangka', 'Liburan Pantai', 'Berenang Bebas', 'Musim Kemarau'],
      clue: 'Makan buah segar di tepi deburan ombak dan pasir putih!',
    },
  ],
  sulit: [
    {
      emojis: ['🕵️', '🔍', '💡'],
      answer: 'Menemukan Bukti',
      options: ['Detektif Rahasia', 'Menemukan Bukti', 'Kacamata Pembesar', 'Lampu Tidur'],
      clue: 'Ketika sang detektif mendapat pencerahan cemerlang!',
    },
    {
      emojis: ['🎨', '🖌️', '🌟'],
      answer: 'Karya Mahakarya',
      options: ['Cat Air Warna', 'Karya Mahakarya', 'Pameran Lukisan', 'Kuas Ajaib'],
      clue: 'Lukisan istimewa bernilai seni tinggi yang memukau dunia!',
    },
    {
      emojis: ['🧙‍♂️', '🪄', '✨'],
      answer: 'Sihir Bintang Fantasi',
      options: ['Tongkat Kayu', 'Sihir Bintang Fantasi', 'Pesta Sulap', 'Bintang Kejora'],
      clue: 'Mantra magis yang menciptakan keajaiban gemerlap!',
    },
    {
      emojis: ['⏰', '⚡', '🏃‍♂️'],
      answer: 'Balapan Melawan Waktu',
      options: ['Lari Marathon', 'Alarm Berbunyi', 'Balapan Melawan Waktu', 'Petir Menyambar'],
      clue: 'Berlari kencang secepat kilat sebelum tenggat waktu berakhir!',
    },
  ],
};

interface TebakEmojiGameProps {
  onWinRound: (coins: number, stars: number, xp: number) => void;
  onExit: () => void;
}

export const TebakEmojiGame: React.FC<TebakEmojiGameProps> = ({ onWinRound, onExit }) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>('mudah');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [bunnyState, setBunnyState] = useState<BunnyAnimationState>('idle');
  const [speech, setSpeech] = useState<string>('Tebak arti emoji di bawah!');
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);

  const riddleList = EMOJI_DATABASE[difficulty];
  const currentRiddle = riddleList[currentIndex % riddleList.length];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentRiddle.answer) {
      soundManager.playCorrect();
      soundManager.playFanfare();
      setBunnyState('jump');
      setSpeech('Wah jenius! Tebakan emojimu benar! 🎉');
      setStreak(prev => prev + 1);

      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#c084fc', '#f472b6', '#38bdf8', '#fde047'],
      });

      const coinsAward = difficulty === 'mudah' ? 15 : difficulty === 'sedang' ? 25 : 35;
      const starsAward = 1;
      const xpAward = difficulty === 'mudah' ? 20 : difficulty === 'sedang' ? 30 : 45;

      onWinRound(coinsAward, starsAward, xpAward);
    } else {
      soundManager.playWrong();
      setBunnyState('confused');
      setSpeech(`Yah hampir! Jawabannya adalah "${currentRiddle.answer}" 😊`);
      setStreak(0);
    }
  };

  const handleNextRiddle = () => {
    soundManager.playClick();
    setSelectedOption(null);
    setIsAnswered(false);
    setBunnyState('idle');
    setSpeech('Tebak arti kombinasi emoji ini!');
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 flex flex-col justify-between select-none">
      {/* Difficulty Selector */}
      <div className="dreamy-card rounded-3xl p-3.5 mb-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1 bg-purple-100/80 p-1 rounded-2xl">
          {(['mudah', 'sedang', 'sulit'] as GameDifficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                soundManager.playClick();
                setDifficulty(d);
                setCurrentIndex(0);
                setIsAnswered(false);
                setSelectedOption(null);
                setBunnyState('idle');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all capitalize ${
                difficulty === d
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-700 hover:bg-purple-200/60'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-pink-700 bg-pink-100/80 px-2.5 py-1 rounded-xl">
          <span>🎯</span>
          <span>Seri: {streak}</span>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="dreamy-card rounded-3xl p-4 sm:p-5 flex flex-col items-center flex-1 shadow-md mb-3">
        {/* Bunny Animation with Speech */}
        <div className="my-1">
          <BunnyCharacter
            state={bunnyState}
            size="md"
            showSpeech={true}
            speechText={speech}
          />
        </div>

        {/* Big Emoji Combination Display */}
        <div className="w-full bg-gradient-to-r from-purple-100/90 via-pink-100/90 to-purple-100/90 border-2 border-purple-200 rounded-3xl p-4 my-2 flex items-center justify-center gap-3 sm:gap-5 shadow-inner">
          {currentRiddle.emojis.map((emoji, idx) => (
            <React.Fragment key={idx}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: `${idx * 0.2}s`, animationDuration: '2.5s' }}>
                {emoji}
              </div>
              {idx < currentRiddle.emojis.length - 1 && (
                <span className="text-xl sm:text-2xl font-black text-purple-600">+</span>
              )}
            </React.Fragment>
          ))}
          <span className="text-xl sm:text-2xl font-black text-purple-600">=</span>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-500/10 border-2 border-dashed border-purple-400 flex items-center justify-center text-2xl font-black text-purple-600">
            ?
          </div>
        </div>

        {/* Clue Prompt */}
        <p className="text-xs sm:text-sm text-purple-800 font-medium italic text-center px-2 my-1">
          "{currentRiddle.clue}"
        </p>

        {/* 4 Multiple Choice Buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
          {currentRiddle.options.map((option, idx) => {
            const isChosen = selectedOption === option;
            const isCorrect = option === currentRiddle.answer;

            let btnStyle = 'btn-3d btn-3d-white text-purple-900 border-2 border-purple-200';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'btn-3d-green text-white scale-102';
              } else if (isChosen) {
                btnStyle = 'bg-rose-500 text-white shadow-none';
              } else {
                btnStyle = 'opacity-40 bg-gray-100 text-gray-500 border border-gray-200';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`${btnStyle} p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between text-left transition-all`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-1" />}
                {isAnswered && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-white shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
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
