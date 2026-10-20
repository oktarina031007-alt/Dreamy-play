export type BunnyAnimationState = 
  | 'idle' 
  | 'wave' 
  | 'jump' 
  | 'dance' 
  | 'confused' 
  | 'sleepy' 
  | 'giggle';

export type CostumeId = 
  | 'classic_purple' 
  | 'strawberry_pink' 
  | 'star_astronaut' 
  | 'royal_crown' 
  | 'pajama_cloud' 
  | 'magic_wizard';

export type BackgroundId = 
  | 'lavender_dream' 
  | 'cotton_candy' 
  | 'starry_midnight' 
  | 'rainbow_kingdom';

export interface CostumeItem {
  id: CostumeId;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  color: string;
  hoodieColor: string;
  badge: string;
  icon: string;
}

export interface BackgroundThemeItem {
  id: BackgroundId;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  gradientClass: string;
  cloudColor: string;
  accentColor: string;
  icon: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  rewardStars: number;
  progress: number;
  target: number;
  claimed: boolean;
  unlocked: boolean;
}

export interface PlayerStats {
  name: string;
  avatar: string;
  coins: number;
  stars: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  equippedCostume: CostumeId;
  equippedBackground: BackgroundId;
  unlockedCostumes: CostumeId[];
  unlockedBackgrounds: BackgroundId[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  gamesPlayed: number;
  wordsGuessed: number;
  emojisSolved: number;
  puzzlesCompleted: number;
  speedHighScores: {
    mudah: number;
    sedang: number;
    sulit: number;
  };
  riddlesSolved: number;
  lastDailyClaim: string | null;
  achievementsClaimed: string[];
}

export type GameType = 
  | 'none'
  | 'tebak_kata' 
  | 'tebak_emoji' 
  | 'puzzle' 
  | 'tantangan_cepat' 
  | 'teka_teki_misteri';

export type GameDifficulty = 'mudah' | 'sedang' | 'sulit';
