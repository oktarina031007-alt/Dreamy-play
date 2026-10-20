import React, { useState, useEffect } from 'react';
import { GameDifficulty, BunnyAnimationState } from '../types/game';
import { soundManager } from '../utils/sound';
import { BunnyCharacter } from '../components/BunnyCharacter';
import { Sparkles, RotateCcw, Eye, Trophy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PuzzleGameProps {
  onWinRound: (coins: number, stars: number, xp: number) => void;
  onExit: () => void;
}

// Memory card items
const MEMORY_ICONS = ['🐰', '⭐', '🌈', '🧁', '🌙', '🪄', '🍓', '👑'];

// Dreamy Tile Swap Picture Definitions (Cute 3x3 illustrated grids using SVGs/symbols)
const TILE_THEMES = [
  {
    name: 'Pesta Kue Lumi',
    icon: '🍰',
    tiles: ['🍓', '🎂', '🧁', '🌸', '🐰', '🌸', '⭐', '☕', '⭐'],
  },
  {
    name: 'Petualangan Bintang',
    icon: '🚀',
    tiles: ['🌙', '⭐', '🪐', '✨', '🚀', '✨', '🌌', '🛸', '☄️'],
  },
  {
    name: 'Taman Pelangi Ajaib',
    icon: '🌈',
    tiles: ['☀️', '🌈', '☁️', '🌷', '🦋', '🌻', '🌿', '🍄', '🌱'],
  },
];

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onWinRound, onExit }) => {
  const [mode, setMode] = useState<'swap' | 'memory'>('swap');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('mudah');
  const [bunnyState, setBunnyState] = useState<BunnyAnimationState>('idle');
  const [speech, setSpeech] = useState<string>('Pilih dan selesaikan puzzle!');
  const [moves, setMoves] = useState(0);
  const [isVictory, setIsVictory] = useState(false);

  // === TILE SWAP PUZZLE STATE ===
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);
  const activeTheme = TILE_THEMES[currentThemeIdx];
  const [tiles, setTiles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // === MEMORY CARD STATE ===
  interface MemoryCard {
    id: number;
    icon: string;
    isFlipped: boolean;
    isMatched: boolean;
  }
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // Init games on mode/difficulty change
  useEffect(() => {
    if (mode === 'swap') {
      initSwapPuzzle();
    } else {
      initMemoryCards();
    }
  }, [mode, difficulty, currentThemeIdx]);

  // Init Tile Swap
  const initSwapPuzzle = () => {
    setIsVictory(false);
    setMoves(0);
    setSelectedTileIndex(null);
    setBunnyState('idle');
    setSpeech('Tukar 2 kotak untuk melengkapi gambar!');

    // Shuffle tile indices
    const target = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let shuffled: number[];
    do {
      shuffled = [...target].sort(() => Math.random() - 0.5);
    } while (shuffled.every((val, idx) => val === target[idx])); // Ensure not solved initially

    setTiles(shuffled);
  };

  const handleTileClick = (index: number) => {
    if (isVictory) return;
    soundManager.playClick();

    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else if (selectedTileIndex === index) {
      setSelectedTileIndex(null);
    } else {
      // Swap tiles
      const newTiles = [...tiles];
      const temp = newTiles[selectedTileIndex];
      newTiles[selectedTileIndex] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedTileIndex(null);
      setMoves(prev => prev + 1);

      // Check win condition
      const isSolved = newTiles.every((val, idx) => val === idx);
      if (isSolved) {
        handleWin();
      }
    }
  };

  // Init Memory Cards
  const initMemoryCards = () => {
    setIsVictory(false);
    setMoves(0);
    setFlippedIndices([]);
    setBunnyState('idle');
    setSpeech('Temukan pasangan kartu yang sama!');

    const pairCount = difficulty === 'mudah' ? 6 : difficulty === 'sedang' ? 8 : 8;
    const iconsToUse = MEMORY_ICONS.slice(0, pairCount);
    const deck = [...iconsToUse, ...iconsToUse]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({
        id: idx,
        icon,
        isFlipped: false,
        isMatched: false,
      }));

    setMemoryCards(deck);
  };

  const handleCardClick = (index: number) => {
    if (isVictory || flippedIndices.length >= 2) return;
    const card = memoryCards[index];
    if (card.isFlipped || card.isMatched) return;

    soundManager.playClick();

    const newDeck = memoryCards.map((c, i) => (i === index ? { ...c, isFlipped: true } : c));
    setMemoryCards(newDeck);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newDeck[firstIdx];
      const secondCard = newDeck[secondIdx];

      if (firstCard.icon === secondCard.icon) {
        // Matched!
        soundManager.playStar();
        setTimeout(() => {
          setMemoryCards(prev =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);

          // Check if all matched
          const allMatched = newDeck.every(
            (c, i) => c.isMatched || i === firstIdx || i === secondIdx
          );
          if (allMatched) {
            handleWin();
          }
        }, 500);
      } else {
        // Not matched - flip back
        setTimeout(() => {
          soundManager.playWrong();
          setMemoryCards(prev =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleWin = () => {
    soundManager.playCorrect();
    soundManager.playFanfare();
    setBunnyState('dance');
    setSpeech('Horeee! Puzzle berhasil diselesaikan! 🧩✨');
    setIsVictory(true);

    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#c084fc', '#f472b6', '#38bdf8', '#fde047'],
    });

    const coinsAward = mode === 'swap' ? 30 : 35;
    const starsAward = 1;
    const xpAward = 45;

    onWinRound(coinsAward, starsAward, xpAward);
  };

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 flex flex-col justify-between select-none">
      {/* Top Mode & Difficulty Bar */}
      <div className="dreamy-card rounded-3xl p-3 mb-3 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-purple-100/90 p-1 rounded-2xl">
          <button
            onClick={() => {
              soundManager.playClick();
              setMode('swap');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              mode === 'swap' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700'
            }`}
          >
            🧩 Tukar Gambar
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setMode('memory');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              mode === 'memory' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700'
            }`}
          >
            🃏 Kartu Pasangan
          </button>
        </div>

        {/* Moves Counter */}
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded-xl">
          <span>Langkah:</span>
          <span className="text-purple-950 font-black">{moves}</span>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="dreamy-card rounded-3xl p-4 flex flex-col items-center flex-1 shadow-md mb-3">
        {/* Bunny Animation with Speech */}
        <div className="my-1">
          <BunnyCharacter
            state={bunnyState}
            size="sm"
            showSpeech={true}
            speechText={speech}
          />
        </div>

        {/* Mode 1: TILE SWAP (3x3 Grid) */}
        {mode === 'swap' && (
          <div className="w-full flex flex-col items-center my-1">
            {/* Theme switcher */}
            <div className="flex items-center justify-between w-full max-w-[280px] mb-2 px-1">
              <span className="text-xs font-bold text-purple-700">
                {activeTheme.icon} {activeTheme.name}
              </span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentThemeIdx(prev => (prev + 1) % TILE_THEMES.length);
                }}
                className="text-[11px] font-bold text-pink-600 hover:text-pink-700 underline"
              >
                Ganti Gambar 🔄
              </button>
            </div>

            {/* 3x3 Tile Board */}
            <div className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] bg-purple-200/80 p-2 rounded-3xl grid grid-cols-3 gap-2 shadow-inner border-2 border-purple-300">
              {tiles.map((tileTargetIdx, currentSlotIdx) => {
                const isSelected = selectedTileIndex === currentSlotIdx;
                const isCorrect = tileTargetIdx === currentSlotIdx;
                const symbol = activeTheme.tiles[tileTargetIdx];

                return (
                  <button
                    key={currentSlotIdx}
                    onClick={() => handleTileClick(currentSlotIdx)}
                    className={`rounded-2xl flex flex-col items-center justify-center text-3xl sm:text-4xl transition-all relative ${
                      isSelected
                        ? 'btn-3d-pink ring-4 ring-pink-400 scale-105 z-10'
                        : isCorrect && isVictory
                        ? 'btn-3d-green text-white'
                        : 'btn-3d btn-3d-white text-purple-900 border-2 border-purple-200 hover:scale-102'
                    }`}
                  >
                    <span>{symbol}</span>
                    {/* Small number indicator to help guide */}
                    <span className="absolute bottom-1 right-2 text-[10px] font-bold opacity-40">
                      {tileTargetIdx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Preview Target Guide button */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-bold text-purple-600 bg-white/80 border border-purple-300 px-3 py-1 rounded-xl flex items-center gap-1 hover:bg-purple-100"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showPreview ? 'Sembunyikan Pola' : 'Lihat Pola Asli'}</span>
              </button>
            </div>

            {showPreview && (
              <div className="mt-2 p-2 bg-white/95 rounded-2xl border-2 border-purple-300 flex items-center gap-1">
                {activeTheme.tiles.map((t, idx) => (
                  <span key={idx} className="text-base p-0.5 bg-purple-50 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mode 2: MEMORY MATCHING CARDS */}
        {mode === 'memory' && (
          <div className="w-full flex flex-col items-center my-1">
            <p className="text-xs text-purple-700 font-semibold mb-2">
              Buka kartu dan cocokkan gambarnya!
            </p>

            <div className="w-full max-w-[320px] grid grid-cols-4 gap-2">
              {memoryCards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`h-16 sm:h-18 rounded-2xl flex items-center justify-center text-2xl transition-all transform ${
                    card.isFlipped || card.isMatched
                      ? card.isMatched
                        ? 'btn-3d-green scale-95 opacity-80'
                        : 'btn-3d-white scale-102 border-2 border-pink-300'
                      : 'btn-3d-purple text-white hover:scale-105'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? (
                    <span>{card.icon}</span>
                  ) : (
                    <span className="text-xl">✨</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            if (mode === 'swap') initSwapPuzzle();
            else initMemoryCards();
          }}
          className="btn-3d btn-3d-white p-3 rounded-2xl flex items-center justify-center text-purple-700 font-bold text-xs"
          title="Acak ulang"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          <span>Acak</span>
        </button>

        {isVictory ? (
          <button
            onClick={() => {
              soundManager.playClick();
              if (mode === 'swap') initSwapPuzzle();
              else initMemoryCards();
            }}
            className="btn-3d btn-3d-pink flex-1 p-3.5 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm text-white animate-bounce"
          >
            <span>Mainkan Lagi! 🌟</span>
          </button>
        ) : (
          <button
            onClick={onExit}
            className="btn-3d btn-3d-white flex-1 p-3.5 rounded-2xl flex items-center justify-center text-purple-700 font-bold text-xs"
          >
            <span>Kembali ke Menu</span>
          </button>
        )}
      </div>
    </div>
  );
};
