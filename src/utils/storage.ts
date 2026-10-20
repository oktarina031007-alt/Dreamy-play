import { 
  PlayerStats, 
  CostumeItem, 
  BackgroundThemeItem, 
  AchievementItem, 
  CostumeId, 
  BackgroundId 
} from '../types/game';

const STORAGE_KEY = 'dreamy_play_save_v1';

export const INITIAL_COSTUMES: CostumeItem[] = [
  {
    id: 'classic_purple',
    name: 'Hoodie Ungu Pastel',
    description: 'Hoodie ungu ikonik Lumi yang super lembut dan lucu!',
    price: 0,
    unlocked: true,
    color: '#c084fc',
    hoodieColor: '#a855f7',
    badge: '⭐ Asli',
    icon: '🐰',
  },
  {
    id: 'strawberry_pink',
    name: 'Hoodie Stroberi Manis',
    description: 'Hoodie merah muda manis dengan aroma buah stroberi ceria.',
    price: 80,
    unlocked: false,
    color: '#f472b6',
    hoodieColor: '#ec4899',
    badge: '🍓 Manis',
    icon: '🍓',
  },
  {
    id: 'star_astronaut',
    name: 'Astronot Penjelajah Bintang',
    description: 'Kostum luar angkasa biru muda berkilau untuk menjelajahi galaksi mimpi.',
    price: 150,
    unlocked: false,
    color: '#38bdf8',
    hoodieColor: '#0284c7',
    badge: '🚀 Angkasa',
    icon: '✨',
  },
  {
    id: 'pajama_cloud',
    name: 'Piyama Awan Ngantuk',
    description: 'Piyama awan berbulu halus yang membuat tidur selalu nyenyak.',
    price: 120,
    unlocked: false,
    color: '#93c5fd',
    hoodieColor: '#60a5fa',
    badge: '☁️ Santai',
    icon: '💤',
  },
  {
    id: 'royal_crown',
    name: 'Pangeran / Putri Mahkota Emas',
    description: 'Mahkota berlian berkilau dan jubah bangsawan mimpi yang megah.',
    price: 250,
    unlocked: false,
    color: '#fbbf24',
    hoodieColor: '#d97706',
    badge: '👑 Mewah',
    icon: '👑',
  },
  {
    id: 'magic_wizard',
    name: 'Penyihir Bintang Ajaib',
    description: 'Topi kerucut bertabur bintang dan jubah sihir penuh mantra bahagia.',
    price: 300,
    unlocked: false,
    color: '#818cf8',
    hoodieColor: '#4f46e5',
    badge: '🔮 Ajaib',
    icon: '🪄',
  },
];

export const INITIAL_BACKGROUNDS: BackgroundThemeItem[] = [
  {
    id: 'lavender_dream',
    name: 'Langit Lavender Impian',
    description: 'Langit ungu pastel lembut dengan awan kapas melayang indah.',
    price: 0,
    unlocked: true,
    gradientClass: 'from-[#f3e8ff] via-[#e9d5ff] to-[#d8b4fe]',
    cloudColor: '#ffffff',
    accentColor: '#c084fc',
    icon: '🌸',
  },
  {
    id: 'cotton_candy',
    name: 'Permen Kapas Merah Muda',
    description: 'Dunia manis serba pink muda yang penuh keceriaan.',
    price: 100,
    unlocked: false,
    gradientClass: 'from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8]',
    cloudColor: '#fff1f2',
    accentColor: '#f472b6',
    icon: '🍭',
  },
  {
    id: 'starry_midnight',
    name: 'Malam Berbintang Biru',
    description: 'Malam tenang bertabur gugusan bintang berkilauan.',
    price: 180,
    unlocked: false,
    gradientClass: 'from-[#0f172a] via-[#1e1b4b] to-[#312e81]',
    cloudColor: '#4338ca',
    accentColor: '#38bdf8',
    icon: '🌌',
  },
  {
    id: 'rainbow_kingdom',
    name: 'Kerajaan Pelangi Ceria',
    description: 'Kombinasi spektrum warna pelangi ceria yang menyegarkan mata.',
    price: 220,
    unlocked: false,
    gradientClass: 'from-[#eff6ff] via-[#fef08a] to-[#fbcfe8]',
    cloudColor: '#ffffff',
    accentColor: '#38bdf8',
    icon: '🌈',
  },
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_game',
    title: 'Langkah Pertama',
    description: 'Mainkan mini game apa saja untuk pertama kali.',
    icon: '🎮',
    rewardCoins: 30,
    rewardStars: 1,
    progress: 0,
    target: 1,
    claimed: false,
    unlocked: false,
  },
  {
    id: 'word_master_5',
    title: 'Kolektor Kata',
    description: 'Tebak 5 kata dengan benar di Tebak Kata.',
    icon: '📝',
    rewardCoins: 50,
    rewardStars: 2,
    progress: 0,
    target: 5,
    claimed: false,
    unlocked: false,
  },
  {
    id: 'emoji_solver_5',
    title: 'Detektif Emoji',
    description: 'Pecahkan 5 teka-teki kombinasi emoji.',
    icon: '🔍',
    rewardCoins: 50,
    rewardStars: 2,
    progress: 0,
    target: 5,
    claimed: false,
    unlocked: false,
  },
  {
    id: 'puzzle_hero',
    title: 'Ahli Puzzle Ajaib',
    description: 'Selesaikan 3 teka-teki kartu atau gambar.',
    icon: '🧩',
    rewardCoins: 60,
    rewardStars: 3,
    progress: 0,
    target: 3,
    claimed: false,
    unlocked: false,
  },
  {
    id: 'speedy_finger',
    title: 'Tangan Kilat',
    description: 'Raih skor minimal 80 poin di Tantangan Cepat.',
    icon: '⚡',
    rewardCoins: 80,
    rewardStars: 3,
    progress: 0,
    target: 80,
    claimed: false,
    unlocked: false,
  },
  {
    id: 'mystery_seeker',
    title: 'Pembuka Peti Misteri',
    description: 'Pecahkan 3 teka-teki misteri bersama Lumi.',
    icon: '🗝️',
    rewardCoins: 70,
    rewardStars: 3,
    progress: 0,
    target: 3,
    claimed: false,
    unlocked: false,
  },
  {
    id: 'fashion_icon',
    title: 'Bintang Panggung',
    description: 'Buka 2 kostum boneka baru untuk Lumi.',
    icon: '👗',
    rewardCoins: 100,
    rewardStars: 4,
    progress: 0,
    target: 2,
    claimed: false,
    unlocked: false,
  },
  {
    id: 'coin_hoarder',
    title: 'Celengan Impian',
    description: 'Kumpulkan total 200 koin.',
    icon: '💰',
    rewardCoins: 100,
    rewardStars: 5,
    progress: 0,
    target: 200,
    claimed: false,
    unlocked: false,
  },
];

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  name: 'Petualang Mimpi',
  avatar: '🐰',
  coins: 60,
  stars: 5,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  equippedCostume: 'classic_purple',
  equippedBackground: 'lavender_dream',
  unlockedCostumes: ['classic_purple'],
  unlockedBackgrounds: ['lavender_dream'],
  soundEnabled: true,
  musicEnabled: false, // Default off until user turns on or toggles
  soundVolume: 0.8,
  gamesPlayed: 0,
  wordsGuessed: 0,
  emojisSolved: 0,
  puzzlesCompleted: 0,
  speedHighScores: {
    mudah: 0,
    sedang: 0,
    sulit: 0,
  },
  riddlesSolved: 0,
  lastDailyClaim: null,
  achievementsClaimed: [],
};

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PLAYER_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PLAYER_STATS,
      ...parsed,
      speedHighScores: {
        ...DEFAULT_PLAYER_STATS.speedHighScores,
        ...(parsed.speedHighScores || {}),
      },
      unlockedCostumes: parsed.unlockedCostumes || ['classic_purple'],
      unlockedBackgrounds: parsed.unlockedBackgrounds || ['lavender_dream'],
    };
  } catch {
    return DEFAULT_PLAYER_STATS;
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // LocalStorage quota or safety
  }
}

export function calculateLevelFromXP(currentLevel: number, currentXP: number) {
  let level = currentLevel;
  let xp = currentXP;
  let xpNeeded = level * 100;
  let leveledUp = false;

  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    level += 1;
    xpNeeded = level * 100;
    leveledUp = true;
  }

  return { level, xp, xpToNextLevel: xpNeeded, leveledUp };
}

export function resetPlayerStats(): PlayerStats {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  return DEFAULT_PLAYER_STATS;
}
