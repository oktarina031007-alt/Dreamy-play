import React, { useState, useEffect } from 'react';
import { GameDifficulty, BunnyAnimationState } from '../types/game';
import { soundManager } from '../utils/sound';
import { BunnyCharacter } from '../components/BunnyCharacter';
import { Lightbulb, RotateCcw, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordItem {
  word: string;
  hint: string;
  category: string;
  icon: string;
}

const WORDS_DATABASE: Record<GameDifficulty, WordItem[]> = {
  mudah: [
    { word: 'AWAN', hint: 'Gumpalan putih empuk seperti kapas di langit', category: 'Alam', icon: '☁️' },
    { word: 'KUE', hint: 'Makanan manis dan lezat saat pesta ulang tahun', category: 'Camilan', icon: '🎂' },
    { word: 'BULAN', hint: 'Benda langit yang bersinar lembut di malam hari', category: 'Langit', icon: '🌙' },
    { word: 'RUSA', hint: 'Hewan anggun yang memiliki tanduk bercabang', category: 'Hewan', icon: '🦌' },
    { word: 'KUCING', hint: 'Hewan peliharaan lucu bersuara meong', category: 'Hewan', icon: '🐱' },
    { word: 'BUNGA', hint: 'Tumbuhan harum dan berwarna-warni di taman', category: 'Taman', icon: '🌸' },
    { word: 'SUSU', hint: 'Minuman putih sehat yang kaya kalsium', category: 'Minuman', icon: '🥛' },
    { word: 'IKAN', hint: 'Bisa berenang dan hidup di dalam air', category: 'Hewan', icon: '🐟' },
  ],
  sedang: [
    { word: 'PELANGI', hint: 'Lengkungan indah 7 warna setelah hujan turun', category: 'Langit', icon: '🌈' },
    { word: 'BINTANG', hint: 'Berkedip-kedip indah menghiasi malam gelap', category: 'Luar Angkasa', icon: '⭐' },
    { word: 'PERMEN', hint: 'Manisan berwarna-warni yang disukai anak-anak', category: 'Camilan', icon: '🍬' },
    { word: 'KELINCI', hint: 'Hewan bertelinga panjang yang suka wortel', category: 'Hewan', icon: '🐰' },
    { word: 'BONEKA', hint: 'Mainan empuk yang nyaman dipeluk saat tidur', category: 'Mainan', icon: '🧸' },
    { word: 'LUMBA', hint: 'Mamalia laut yang ramah dan suka melompat', category: 'Laut', icon: '🐬' },
    { word: 'COKLAT', hint: 'Camilan manis dari biji kakao yang meleleh di mulut', category: 'Camilan', icon: '🍫' },
  ],
  sulit: [
    { word: 'ASTRONOT', hint: 'Pahlawan pemberani yang pergi ke luar angkasa', category: 'Profesi', icon: '🚀' },
    { word: 'KUPUKUPU', hint: 'Serangga bersayap cantik hasil metamorfosis', category: 'Hewan', icon: '🦋' },
    { word: 'PETUALANG', hint: 'Orang yang suka menjelajah tempat-tempat baru', category: 'Petualangan', icon: '🗺️' },
    { word: 'CENDRAWASIH', hint: 'Burung surga berbulu sangat indah dari Papua', category: 'Satwa Langka', icon: '🦜' },
    { word: 'KUNANGKUNANG', hint: 'Serangga malam yang ekornya menyala kelap-kelip', category: 'Hewan Malam', icon: '✨' },
    { word: 'MATAHARI', hint: 'Bintang raksasa pemberi cahaya dan kehangatan bumi', category: 'Tata Surya', icon: '☀️' },
  ],
};

interface TebakKataGameProps {
  onWinRound: (coins: number, stars: number, xp: number) => void;
  onExit: () => void;
}

export const TebakKataGame: React.FC<TebakKataGameProps> = ({ onWinRound, onExit }) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>('mudah');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([]);
  const [scrambledPool, setScrambledPool] = useState<{ id: number; char: string; used: boolean }[]>([]);
  const [bunnyState, setBunnyState] = useState<BunnyAnimationState>('idle');
  const [speech, setSpeech] = useState<string>('Ayo susun hurufnya!');
  const [isCompleted, setIsCompleted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHintText, setShowHintText] = useState(false);
  const [streak, setStreak] = useState(0);

  const wordList = WORDS_DATABASE[difficulty];
  const currentItem = wordList[currentIndex % wordList.length];

  // Initialize or change word
  useEffect(() => {
    initRound(currentItem.word);
  }, [currentIndex, difficulty]);

  const initRound = (word: string) => {
    setIsCompleted(false);
    setShowHintText(false);
    setPlacedLetters(new Array(word.length).fill(null));
    setBunnyState('idle');
    setSpeech('Ayo susun hurufnya!');

    // Scramble letters with extra random letters on hard
    const chars = word.split('');
    const extraPool = ['A', 'E', 'I', 'O', 'U', 'S', 'R', 'N'];
    if (difficulty === 'sulit' && chars.length < 10) {
      chars.push(extraPool[Math.floor(Math.random() * extraPool.length)]);
    }

    const shuffled = chars
      .map((char, index) => ({ id: index, char, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item, index) => ({ id: index, char: item.char, used: false }));

    setScrambledPool(shuffled);
  };

  // Tap letter from scrambled pool to put in first available slot
  const handleSelectLetter = (poolIndex: number) => {
    if (isCompleted) return;
    const item = scrambledPool[poolIndex];
    if (item.used) return;

    const firstEmptyIndex = placedLetters.findIndex(l => l === null);
    if (firstEmptyIndex === -1) return;

    soundManager.playClick();

    const newPlaced = [...placedLetters];
    newPlaced[firstEmptyIndex] = item.char;
    setPlacedLetters(newPlaced);

    const newPool = [...scrambledPool];
    newPool[poolIndex].used = true;
    setScrambledPool(newPool);

    // Check if word is now full
    if (firstEmptyIndex === placedLetters.length - 1 || !newPlaced.includes(null)) {
      validateWord(newPlaced.join(''));
    }
  };

  // Tap placed letter to return it to pool
  const handleRemoveLetter = (slotIndex: number) => {
    if (isCompleted) return;
    const char = placedLetters[slotIndex];
    if (!char) return;

    soundManager.playClick();

    // Mark one of the matching used pool letters as available
    const poolIdx = scrambledPool.findIndex(p => p.char === char && p.used);
    if (poolIdx !== -1) {
      const newPool = [...scrambledPool];
      newPool[poolIdx].used = false;
      setScrambledPool(newPool);
    }

    const newPlaced = [...placedLetters];
    newPlaced[slotIndex] = null;
    setPlacedLetters(newPlaced);
    setBunnyState('idle');
  };

  const validateWord = (userWord: string) => {
    if (userWord === currentItem.word) {
      // SUCCESS!
      soundManager.playCorrect();
      soundManager.playFanfare();
      setBunnyState('jump');
      setSpeech('Horeee! Jawabanmu Tepat Sekali! 🎉');
      setIsCompleted(true);
      setStreak(prev => prev + 1);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c084fc', '#f472b6', '#38bdf8', '#fde047'],
      });

      const coinsAward = difficulty === 'mudah' ? 15 : difficulty === 'sedang' ? 25 : 40;
      const starsAward = 1;
      const xpAward = difficulty === 'mudah' ? 20 : difficulty === 'sedang' ? 35 : 50;

      onWinRound(coinsAward, starsAward, xpAward);
    } else {
      // WRONG!
      soundManager.playWrong();
      setBunnyState('confused');
      setSpeech('Ups, coba periksa susunan hurufnya lagi ya! 🤔');
    }
  };

  const handleUseHint = () => {
    soundManager.playStar();
    setShowHintText(true);
    setHintsUsed(prev => prev + 1);
    setBunnyState('wave');
    setSpeech('Lumi beri petunjuk untukmu! ✨');
  };

  const handleResetLetters = () => {
    soundManager.playClick();
    setPlacedLetters(new Array(currentItem.word.length).fill(null));
    setScrambledPool(prev => prev.map(p => ({ ...p, used: false })));
    setBunnyState('idle');
  };

  const handleNextWord = () => {
    soundManager.playClick();
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 flex flex-col justify-between select-none">
      {/* Top Difficulty & Progress Header */}
      <div className="dreamy-card rounded-3xl p-3.5 mb-3 flex items-center justify-between shadow-sm">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 bg-purple-100/80 p-1 rounded-2xl">
          {(['mudah', 'sedang', 'sulit'] as GameDifficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                soundManager.playClick();
                setDifficulty(d);
                setCurrentIndex(0);
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

        {/* Streak counter */}
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-xl">
          <span>🔥</span>
          <span>Seri: {streak}</span>
        </div>
      </div>

      {/* Main Game Stage Card */}
      <div className="dreamy-card rounded-3xl p-4 sm:p-5 flex flex-col items-center flex-1 shadow-md mb-3">
        {/* Category & Clue Icon */}
        <div className="flex items-center gap-2 mb-2 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold text-purple-700">
          <span className="text-base">{currentItem.icon}</span>
          <span>Kategori: {currentItem.category}</span>
        </div>

        {/* Bunny Animation with Speech Bubble */}
        <div className="my-2">
          <BunnyCharacter
            state={bunnyState}
            size="md"
            showSpeech={true}
            speechText={speech}
          />
        </div>

        {/* Clue Hint Box */}
        <div className="w-full bg-white/90 border-2 border-purple-200/80 rounded-2xl p-2.5 sm:p-3 my-2 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-purple-600 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Petunjuk Kata:</span>
          </div>
          <p className="text-xs sm:text-sm text-purple-950 font-semibold italic">
            "{currentItem.hint}"
          </p>
        </div>

        {/* Word Input Slots */}
        <div className="flex flex-wrap items-center justify-center gap-2 my-3">
          {placedLetters.map((letter, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveLetter(idx)}
              className={`w-11 h-12 sm:w-12 sm:h-13 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all ${
                letter
                  ? isCompleted
                    ? 'btn-3d-green text-white scale-105'
                    : 'btn-3d-purple text-white'
                  : 'bg-white/80 border-2 border-dashed border-purple-300 text-transparent shadow-inner'
              }`}
              title={letter ? 'Klik untuk hapus huruf' : 'Kotak kosong'}
            >
              {letter || '_'}
            </button>
          ))}
        </div>

        {/* Letter Scrambled Pool Buttons */}
        <div className="w-full mt-2">
          <p className="text-center text-[11px] font-bold text-purple-600 mb-2">
            Pilih dan susun huruf di bawah ini:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {scrambledPool.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectLetter(item.id)}
                disabled={item.used || isCompleted}
                className={`w-10 h-11 sm:w-11 sm:h-12 rounded-xl text-lg sm:text-xl font-black transition-all ${
                  item.used
                    ? 'opacity-25 bg-gray-200 text-gray-400 border border-gray-300 pointer-events-none'
                    : 'btn-3d btn-3d-white hover:scale-105 active:scale-95 text-purple-900 border-2 border-purple-200'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleResetLetters}
          disabled={isCompleted}
          className="btn-3d btn-3d-white p-3 rounded-2xl flex items-center justify-center text-purple-700 font-bold text-xs"
          title="Ulangi susunan huruf"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          <span>Ulang</span>
        </button>

        <button
          onClick={handleUseHint}
          disabled={isCompleted || showHintText}
          className="btn-3d btn-3d-yellow p-3 rounded-2xl flex-1 flex items-center justify-center font-black text-xs sm:text-sm text-amber-950"
        >
          <Lightbulb className="w-4 h-4 mr-1 text-amber-900" />
          <span>Bantuan Lumi</span>
        </button>

        {isCompleted ? (
          <button
            onClick={handleNextWord}
            className="btn-3d btn-3d-pink p-3 rounded-2xl flex-1 flex items-center justify-center font-black text-xs sm:text-sm text-white animate-bounce"
          >
            <span>Kata Berikutnya</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            onClick={onExit}
            className="btn-3d btn-3d-white p-3 rounded-2xl flex items-center justify-center text-purple-700 font-bold text-xs"
          >
            <span>Kembali</span>
          </button>
        )}
      </div>
    </div>
  );
};
