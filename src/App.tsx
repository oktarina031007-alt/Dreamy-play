import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayerStats, 
  GameType, 
  CostumeId, 
  BackgroundId, 
  BunnyAnimationState, 
  GameDifficulty 
} from './types/game';
import { 
  loadPlayerStats, 
  savePlayerStats, 
  calculateLevelFromXP, 
  resetPlayerStats 
} from './utils/storage';
import { soundManager } from './utils/sound';
import { BackgroundSky } from './components/BackgroundSky';
import { HeaderBar } from './components/HeaderBar';
import { BunnyCharacter } from './components/BunnyCharacter';
import { GamePickerModal } from './components/GamePickerModal';
import { WardrobeModal } from './components/WardrobeModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { DailyGiftModal } from './components/DailyGiftModal';

// Mini Games
import { TebakKataGame } from './games/TebakKataGame';
import { TebakEmojiGame } from './games/TebakEmojiGame';
import { PuzzleGame } from './games/PuzzleGame';
import { TantanganCepatGame } from './games/TantanganCepatGame';
import { TekaTekiMisteriGame } from './games/TekaTekiMisteriGame';

// Icons
import { Play, Grid, Sparkles, Trophy, Settings, Gift, Heart, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const BUNNY_QUOTES = [
  'Halo! Senang sekali kamu datang ke Dreamy Play! ✨',
  'Ayo main dan temukan kejutan seru hari ini! 🐰',
  'Kamu pintar sekali! Pilih game favoritmu yuk!',
  'Sentuh aku lagi untuk mendengar tawaku! Hihi~ 💖',
  'Jangan lupa kumpulkan koin untuk membuka kostum baruku!',
  'Langit mimpi hari ini cerah sekali ya! 🌈',
];

export default function App() {
  const [stats, setStats] = useState<PlayerStats>(() => loadPlayerStats());
  const [activeGame, setActiveGame] = useState<GameType>('none');
  
  // Modals state
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDailyGift, setShowDailyGift] = useState(false);

  // Bunny state on home screen
  const [bunnyHomeState, setBunnyHomeState] = useState<BunnyAnimationState>('wave');
  const [speechText, setSpeechText] = useState<string>('Halo sahabat impian! Ayo main! 👋');
  const idleTimerRef = useRef<number | null>(null);

  // Save stats changes to localStorage
  useEffect(() => {
    savePlayerStats(stats);
  }, [stats]);

  // Initial wave greeting on app launch
  useEffect(() => {
    soundManager.setSoundEnabled(stats.soundEnabled);
    soundManager.setMusicEnabled(stats.musicEnabled);
    soundManager.setVolume(stats.soundVolume);

    // After 3 seconds of waving, transition to idle
    const timer = setTimeout(() => {
      setBunnyHomeState('idle');
      setSpeechText('Pilih petualangan kita yuk! ✨');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Idle Detection: After 12 seconds of inactivity, Lumi gets sleepy
  useEffect(() => {
    const resetIdleTimer = () => {
      if (bunnyHomeState === 'sleepy') {
        setBunnyHomeState('idle');
        setSpeechText('Hoam... Lumi siap main lagi! 🐰');
      }

      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }

      idleTimerRef.current = window.setTimeout(() => {
        if (activeGame === 'none') {
          setBunnyHomeState('sleepy');
          setSpeechText('Zzz... Lumi ngantuk... 💤');
        }
      }, 12000);
    };

    window.addEventListener('pointerdown', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);

    resetIdleTimer();

    return () => {
      window.removeEventListener('pointerdown', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [activeGame, bunnyHomeState]);

  // Handle Level Up & Award System
  const awardPlayer = (coins: number, stars: number, xp: number) => {
    setStats(prev => {
      const newCoins = prev.coins + coins;
      const newStars = prev.stars + stars;
      const { level, xp: updatedXP, xpToNextLevel, leveledUp } = calculateLevelFromXP(
        prev.level,
        prev.xp + xp
      );

      if (leveledUp) {
        soundManager.playFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.4 },
          colors: ['#c084fc', '#f472b6', '#38bdf8', '#fde047'],
        });
      }

      return {
        ...prev,
        coins: newCoins,
        stars: newStars,
        level,
        xp: updatedXP,
        xpToNextLevel,
      };
    });
  };

  // Mini Game win handler
  const handleWinRound = (
    coins: number,
    stars: number,
    xp: number,
    customScore?: number,
    difficulty?: GameDifficulty
  ) => {
    awardPlayer(coins, stars, xp);

    setStats(prev => {
      const nextGamesPlayed = prev.gamesPlayed + 1;
      let wordsGuessed = prev.wordsGuessed;
      let emojisSolved = prev.emojisSolved;
      let puzzlesCompleted = prev.puzzlesCompleted;
      let speedHighScores = { ...prev.speedHighScores };
      let riddlesSolved = prev.riddlesSolved;

      if (activeGame === 'tebak_kata') wordsGuessed += 1;
      if (activeGame === 'tebak_emoji') emojisSolved += 1;
      if (activeGame === 'puzzle') puzzlesCompleted += 1;
      if (activeGame === 'tantangan_cepat' && customScore && difficulty) {
        speedHighScores[difficulty] = Math.max(speedHighScores[difficulty], customScore);
      }
      if (activeGame === 'teka_teki_misteri') riddlesSolved += 1;

      return {
        ...prev,
        gamesPlayed: nextGamesPlayed,
        wordsGuessed,
        emojisSolved,
        puzzlesCompleted,
        speedHighScores,
        riddlesSolved,
      };
    });
  };

  const handleBunnyHomeClick = () => {
    const randomQuote = BUNNY_QUOTES[Math.floor(Math.random() * BUNNY_QUOTES.length)];
    setSpeechText(randomQuote);
    setBunnyHomeState('giggle');
    setTimeout(() => {
      setBunnyHomeState('idle');
    }, 1500);
  };

  const handleQuickPlay = () => {
    soundManager.playClick();
    // Rotate to a fun game
    const games: GameType[] = ['tebak_kata', 'tebak_emoji', 'puzzle', 'tantangan_cepat', 'teka_teki_misteri'];
    const chosen = games[Math.floor(Math.random() * games.length)];
    setActiveGame(chosen);
  };

  const handleClaimDaily = (coins: number, stars: number, xp: number) => {
    awardPlayer(coins, stars, xp);
    const today = new Date().toISOString().slice(0, 10);
    setStats(prev => ({
      ...prev,
      lastDailyClaim: today,
    }));
  };

  const handleClaimAchievement = (achId: string, rewardCoins: number, rewardStars: number) => {
    awardPlayer(rewardCoins, rewardStars, 50);
    setStats(prev => ({
      ...prev,
      achievementsClaimed: [...prev.achievementsClaimed, achId],
    }));
  };

  const isDailyClaimedToday = stats.lastDailyClaim === new Date().toISOString().slice(0, 10);

  const getInGameTitle = () => {
    switch (activeGame) {
      case 'tebak_kata':
        return 'Tebak Kata';
      case 'tebak_emoji':
        return 'Tebak Emoji';
      case 'puzzle':
        return 'Puzzle Ajaib';
      case 'tantangan_cepat':
        return 'Tantangan Cepat';
      case 'teka_teki_misteri':
        return 'Teka-Teki Misteri';
      default:
        return undefined;
    }
  };

  return (
    <BackgroundSky themeId={stats.equippedBackground}>
      {/* Top Header Bar */}
      <HeaderBar
        stats={stats}
        onOpenSettings={() => setShowSettings(true)}
        onBackToHome={activeGame !== 'none' ? () => setActiveGame('none') : undefined}
        inGameTitle={getInGameTitle()}
        onToggleSound={() => {
          const next = !stats.soundEnabled;
          soundManager.setSoundEnabled(next);
          setStats(prev => ({ ...prev, soundEnabled: next }));
        }}
        onToggleMusic={() => {
          const next = !stats.musicEnabled;
          soundManager.setMusicEnabled(next);
          setStats(prev => ({ ...prev, musicEnabled: next }));
        }}
      />

      {/* Main View: Either Home Screen or Active Mini Game */}
      <main className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-4 py-3 sm:py-5">
        {activeGame === 'none' ? (
          /* ========================================================
             HALAMAN UTAMA (HOME SCREEN)
             ======================================================== */
          <div className="flex-1 flex flex-col items-center justify-between gap-3 animate-fade-in">
            {/* Top Logo & Slogan Card */}
            <div className="text-center w-full flex flex-col items-center">
              {/* Glowing Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-purple-200/80 shadow-xs mb-1">
                <span className="text-amber-400 text-xs">✨</span>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-700">
                  Dunia Fantasi Interaktif
                </span>
                <span className="text-amber-400 text-xs">✨</span>
              </div>

              {/* 3D Shiny Logo */}
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-purple-600 via-pink-500 to-indigo-600 drop-shadow-[0_4px_8px_rgba(168,85,247,0.3)] filter">
                DREAMY PLAY
              </h1>

              {/* Slogan */}
              <p className="text-xs sm:text-sm font-bold text-purple-800/90 tracking-wide mt-0.5">
                "Play, Laugh, and Discover!"
              </p>
            </div>

            {/* Central Interactive Plush Bunny Character Stage */}
            <div className="relative my-1 flex flex-col items-center">
              <BunnyCharacter
                costumeId={stats.equippedCostume}
                state={bunnyHomeState}
                size="lg"
                showSpeech={true}
                speechText={speechText}
                onClick={handleBunnyHomeClick}
              />

              {/* Character quick actions */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    soundManager.playGiggle();
                    setBunnyHomeState('wave');
                    setSpeechText('Lumi melambaikan tangan ceria! 👋');
                    setTimeout(() => setBunnyHomeState('idle'), 2000);
                  }}
                  className="px-3 py-1 bg-white/85 hover:bg-white text-purple-700 font-bold text-xs rounded-full border border-purple-200 shadow-xs flex items-center gap-1 transition-all active:scale-95"
                >
                  <span>Sapa Lumi 👋</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowWardrobe(true);
                  }}
                  className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs rounded-full border border-purple-300 shadow-xs flex items-center gap-1 transition-all active:scale-95"
                >
                  <span>Ganti Kostum 🎀</span>
                </button>
              </div>
            </div>

            {/* Daily Lucky Gift Banner */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowDailyGift(true);
              }}
              className="w-full bg-gradient-to-r from-amber-200/90 via-yellow-100/95 to-pink-200/90 border-2 border-amber-300/90 rounded-2xl p-2.5 flex items-center justify-between shadow-xs hover:shadow-md transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-2xl animate-bounce">
                  🎁
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-black text-amber-950 leading-tight">
                    Hadiah Kejutan Harian
                  </h4>
                  <span className="text-[11px] font-semibold text-amber-800">
                    {isDailyClaimedToday ? 'Sudah diambil hari ini • Buka lagi besok' : 'Ada hadiah koin & bintang menunggumu!'}
                  </span>
                </div>
              </div>
              <span className="btn-3d btn-3d-yellow px-2.5 py-1 rounded-xl text-xs font-black text-amber-950 shrink-0">
                {isDailyClaimedToday ? 'Lihat' : 'Klaim'}
              </span>
            </button>

            {/* Main Menu Action Buttons */}
            <div className="w-full space-y-2.5">
              {/* Big Primary Play Button */}
              <button
                onClick={handleQuickPlay}
                className="btn-3d btn-3d-purple w-full p-4 rounded-3xl font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg hover:scale-101 active:scale-98 transition-all"
              >
                <Play className="w-6 h-6 fill-white" />
                <span>Mulai Bermain</span>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </button>

              {/* 3 Secondary Big Buttons in Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Pilih Game */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowGamePicker(true);
                  }}
                  className="btn-3d btn-3d-pink p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <Grid className="w-4 h-4" />
                  <span>Pilih Game</span>
                </button>

                {/* Koleksi Hadiah */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowWardrobe(true);
                  }}
                  className="btn-3d btn-3d-blue p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <span>🎀 Koleksi Hadiah</span>
                </button>

                {/* Pencapaian */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowAchievements(true);
                  }}
                  className="btn-3d btn-3d-yellow p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 text-amber-950 shadow-md"
                >
                  <Trophy className="w-4 h-4 text-amber-900" />
                  <span>Pencapaian</span>
                </button>

                {/* Pengaturan */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowSettings(true);
                  }}
                  className="btn-3d btn-3d-white p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 text-purple-900 border-2 border-purple-200 shadow-md"
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span>Pengaturan</span>
                </button>
              </div>
            </div>
          </div>
        ) : activeGame === 'tebak_kata' ? (
          <TebakKataGame
            onWinRound={handleWinRound}
            onExit={() => setActiveGame('none')}
          />
        ) : activeGame === 'tebak_emoji' ? (
          <TebakEmojiGame
            onWinRound={handleWinRound}
            onExit={() => setActiveGame('none')}
          />
        ) : activeGame === 'puzzle' ? (
          <PuzzleGame
            onWinRound={handleWinRound}
            onExit={() => setActiveGame('none')}
          />
        ) : activeGame === 'tantangan_cepat' ? (
          <TantanganCepatGame
            onWinRound={(c, s, xp, score, diff) => handleWinRound(c, s, xp, score, diff)}
            onExit={() => setActiveGame('none')}
            highScore={Math.max(
              stats.speedHighScores.mudah,
              stats.speedHighScores.sedang,
              stats.speedHighScores.sulit
            )}
          />
        ) : activeGame === 'teka_teki_misteri' ? (
          <TekaTekiMisteriGame
            onWinRound={handleWinRound}
            onExit={() => setActiveGame('none')}
          />
        ) : null}
      </main>

      {/* Popups & Modals */}
      <GamePickerModal
        isOpen={showGamePicker}
        onClose={() => setShowGamePicker(false)}
        onSelectGame={game => setActiveGame(game)}
      />

      <WardrobeModal
        isOpen={showWardrobe}
        onClose={() => setShowWardrobe(false)}
        coins={stats.coins}
        equippedCostume={stats.equippedCostume}
        equippedBackground={stats.equippedBackground}
        unlockedCostumes={stats.unlockedCostumes}
        unlockedBackgrounds={stats.unlockedBackgrounds}
        onEquipCostume={id => setStats(prev => ({ ...prev, equippedCostume: id }))}
        onEquipBackground={id => setStats(prev => ({ ...prev, equippedBackground: id }))}
        onUnlockCostume={(id, price) => {
          setStats(prev => ({
            ...prev,
            coins: Math.max(0, prev.coins - price),
            unlockedCostumes: [...prev.unlockedCostumes, id],
          }));
        }}
        onUnlockBackground={(id, price) => {
          setStats(prev => ({
            ...prev,
            coins: Math.max(0, prev.coins - price),
            unlockedBackgrounds: [...prev.unlockedBackgrounds, id],
          }));
        }}
      />

      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        stats={stats}
        onClaimAchievement={handleClaimAchievement}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        stats={stats}
        onUpdateStats={newStats => setStats(prev => ({ ...prev, ...newStats }))}
        onResetProgress={() => {
          const fresh = resetPlayerStats();
          setStats(fresh);
        }}
      />

      <DailyGiftModal
        isOpen={showDailyGift}
        onClose={() => setShowDailyGift(false)}
        onClaimDaily={handleClaimDaily}
        isAlreadyClaimedToday={isDailyClaimedToday}
      />
    </BackgroundSky>
  );
}
