import React, { useState, useEffect, useRef } from 'react';
import { GameDifficulty, BunnyAnimationState } from '../types/game';
import { soundManager } from '../utils/sound';
import { BunnyCharacter } from '../components/BunnyCharacter';
import { Play, RotateCcw, Zap, Flame, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FallItem {
  id: number;
  type: 'star' | 'candy' | 'bubble' | 'moon' | 'cloud';
  icon: string;
  points: number;
  x: number; // percentage 10% - 90%
  y: number; // percentage 0% - 100%
  speed: number;
  isPopped?: boolean;
}

interface TantanganCepatGameProps {
  onWinRound: (coins: number, stars: number, xp: number, score: number, difficulty: GameDifficulty) => void;
  onExit: () => void;
  highScore: number;
}

export const TantanganCepatGame: React.FC<TantanganCepatGameProps> = ({
  onWinRound,
  onExit,
  highScore,
}) => {
  const [difficulty, setDifficulty] = useState<GameDifficulty>('mudah');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [bunnyState, setBunnyState] = useState<BunnyAnimationState>('idle');
  const [speech, setSpeech] = useState<string>('Tekan Mulai dan tangkap bintang!');
  const [isGameOver, setIsGameOver] = useState(false);

  const [items, setItems] = useState<FallItem[]>([]);
  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);

  // Spawn parameters based on difficulty
  const config = {
    mudah: { speedMult: 0.6, spawnInterval: 850, dangerChance: 0.15 },
    sedang: { speedMult: 0.9, spawnInterval: 650, dangerChance: 0.25 },
    sulit: { speedMult: 1.3, spawnInterval: 480, dangerChance: 0.35 },
  }[difficulty];

  // Start game session
  const startGame = () => {
    soundManager.playClick();
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(30);
    setItems([]);
    setBunnyState('jump');
    setSpeech('Ayo tangkap secepat mungkin!');
  };

  // Timer countdown
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Game physics animation loop
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Spawn new items
      if (currentTime - lastSpawnRef.current > config.spawnInterval) {
        lastSpawnRef.current = currentTime;
        spawnItem();
      }

      // Update falling items
      setItems(prev => {
        return prev
          .map(item => ({
            ...item,
            y: item.y + item.speed * delta * 25 * config.speedMult,
          }))
          .filter(item => item.y <= 100 && !item.isPopped);
      });

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, difficulty]);

  const spawnItem = () => {
    const isDanger = Math.random() < config.dangerChance;
    let type: FallItem['type'] = 'star';
    let icon = '⭐';
    let points = 10;
    let baseSpeed = 1.0;

    if (isDanger) {
      type = 'cloud';
      icon = '⛈️';
      points = -20;
      baseSpeed = 1.1;
    } else {
      const roll = Math.random();
      if (roll < 0.45) {
        type = 'star';
        icon = '⭐';
        points = 10;
        baseSpeed = 1.0;
      } else if (roll < 0.75) {
        type = 'candy';
        icon = '🍬';
        points = 15;
        baseSpeed = 1.2;
      } else if (roll < 0.9) {
        type = 'bubble';
        icon = '🫧';
        points = 20;
        baseSpeed = 0.8;
      } else {
        type = 'moon';
        icon = '🌙';
        points = 30;
        baseSpeed = 1.4;
      }
    }

    const newItem: FallItem = {
      id: nextIdRef.current++,
      type,
      icon,
      points,
      x: Math.floor(Math.random() * 75) + 12,
      y: 0,
      speed: baseSpeed,
    };

    setItems(prev => [...prev.slice(-15), newItem]);
  };

  const handleTapItem = (item: FallItem, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isPlaying || item.isPopped) return;

    if (item.type === 'cloud') {
      // Hit danger
      soundManager.playWrong();
      setCombo(0);
      setScore(prev => Math.max(0, prev + item.points));
      setBunnyState('confused');
      setSpeech('Awas awan petir! ⚡');
    } else {
      // Hit good item
      soundManager.playPop();
      if (item.type === 'moon' || item.type === 'bubble') {
        soundManager.playCoin();
      }

      setCombo(prev => {
        const newC = prev + 1;
        if (newC > maxCombo) setMaxCombo(newC);
        return newC;
      });

      const multiplier = combo > 8 ? 2 : combo > 4 ? 1.5 : 1;
      const earned = Math.round(item.points * multiplier);
      setScore(prev => prev + earned);

      if (combo > 6) {
        setBunnyState('dance');
        setSpeech('Combo Keren! Teruskan! 🔥');
      }
    }

    // Mark as popped
    setItems(prev =>
      prev.map(i => (i.id === item.id ? { ...i, isPopped: true } : i))
    );
  };

  const finishGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    soundManager.playFanfare();

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#c084fc', '#f472b6', '#38bdf8', '#fde047'],
    });

    setBunnyState('dance');
    setSpeech(`Hebat! Kamu meraih ${score} poin! 🏆`);

    // Award calculated from performance
    const earnedCoins = Math.max(10, Math.floor(score / 5));
    const earnedStars = score > 100 ? 2 : 1;
    const earnedXP = Math.max(20, Math.floor(score / 3));

    onWinRound(earnedCoins, earnedStars, earnedXP, score, difficulty);
  };

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="dreamy-card rounded-3xl p-3 mb-2 flex items-center justify-between shadow-sm">
        {/* Difficulty buttons */}
        <div className="flex items-center gap-1 bg-purple-100/90 p-1 rounded-2xl">
          {(['mudah', 'sedang', 'sulit'] as GameDifficulty[]).map(d => (
            <button
              key={d}
              disabled={isPlaying}
              onClick={() => {
                soundManager.playClick();
                setDifficulty(d);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all capitalize ${
                difficulty === d
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-700 hover:bg-purple-200/50'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* High Score */}
        <div className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-xl">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Rekor: {Math.max(score, highScore)}</span>
        </div>
      </div>

      {/* Score, Time & Combo HUD */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-white/90 border border-purple-200 rounded-2xl p-2 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-purple-600 block">Skor</span>
          <span className="text-xl font-black text-purple-900">{score}</span>
        </div>

        <div className={`border rounded-2xl p-2 text-center shadow-xs transition-colors ${
          timeLeft <= 5 ? 'bg-red-100 border-red-300 animate-pulse' : 'bg-white/90 border-purple-200'
        }`}>
          <span className="text-[10px] uppercase font-bold text-purple-600 block">Waktu</span>
          <span className={`text-xl font-black ${timeLeft <= 5 ? 'text-red-600' : 'text-purple-900'}`}>
            {timeLeft}s
          </span>
        </div>

        <div className="bg-white/90 border border-purple-200 rounded-2xl p-2 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-pink-600 block">Combo</span>
          <div className="flex items-center justify-center gap-1">
            <Flame className={`w-4 h-4 ${combo > 4 ? 'text-orange-500 animate-bounce' : 'text-gray-300'}`} />
            <span className="text-xl font-black text-pink-700">x{combo}</span>
          </div>
        </div>
      </div>

      {/* Main Falling Sky Arena */}
      <div className="relative w-full h-[360px] sm:h-[400px] bg-gradient-to-b from-indigo-900/40 via-purple-900/30 to-pink-900/20 backdrop-blur-md rounded-3xl border-3 border-white/80 overflow-hidden shadow-inner flex flex-col justify-between p-3">
        {/* Floating Clouds Background decor */}
        <div className="absolute top-2 left-4 text-3xl opacity-20 pointer-events-none">☁️</div>
        <div className="absolute top-12 right-6 text-4xl opacity-20 pointer-events-none">☁️</div>

        {/* Falling Target Items */}
        {isPlaying &&
          items.map(item => (
            <button
              key={item.id}
              onClick={e => handleTapItem(item, e)}
              onTouchStart={e => handleTapItem(item, e)}
              className="absolute w-13 h-13 -translate-x-1/2 rounded-2xl flex items-center justify-center text-3xl transition-transform active:scale-125 hover:scale-110 drop-shadow-md cursor-pointer select-none"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
              }}
            >
              <span>{item.icon}</span>
            </button>
          ))}

        {/* Idle Start Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-20">
            <BunnyCharacter state="wave" size="md" showSpeech={true} speechText="Siap uji kecepatan jarimu?" />
            <p className="text-xs text-purple-900 font-semibold text-center mt-2 max-w-xs">
              Tangkap bintang (⭐), permen (🍬), gelembung (🫧), dan bulan (🌙)!
              <br />
              <span className="text-rose-600 font-bold">Hindari awan petir (⛈️)!</span>
            </p>
            <button
              onClick={startGame}
              className="btn-3d btn-3d-pink px-8 py-3 rounded-2xl font-black text-base text-white mt-4 flex items-center gap-2 animate-bounce"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Mulai Tantangan!</span>
            </button>
          </div>
        )}

        {/* Game Over Victory Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-4 z-20">
            <BunnyCharacter state="dance" size="md" showSpeech={true} speechText={speech} />
            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3 my-2 text-center w-full max-w-xs">
              <span className="text-xs text-purple-600 font-bold">Skor Akhir:</span>
              <div className="text-3xl font-black text-purple-900">{score}</div>
              <span className="text-[11px] text-pink-600 font-semibold">Kombo Maksimal: {maxCombo}x</span>
            </div>

            <div className="flex gap-2 w-full max-w-xs mt-2">
              <button
                onClick={startGame}
                className="btn-3d btn-3d-pink flex-1 p-3 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Lagi</span>
              </button>
              <button
                onClick={onExit}
                className="btn-3d btn-3d-white p-3 rounded-2xl font-bold text-xs text-purple-800"
              >
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Bunny Cheerleader while active */}
        {isPlaying && (
          <div className="mt-auto flex items-center justify-between pointer-events-none">
            <BunnyCharacter state={bunnyState} size="sm" interactive={false} />
            <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-purple-800 border border-purple-200">
              {speech}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={onExit}
          className="btn-3d btn-3d-white w-full p-3 rounded-2xl flex items-center justify-center text-purple-700 font-bold text-xs"
        >
          <span>Kembali ke Menu</span>
        </button>
      </div>
    </div>
  );
};
