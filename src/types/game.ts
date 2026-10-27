/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LevelId = 'bazaar' | 'boss_courtyard';

export type GameTheme = 'sunset' | 'midnight';

export type OutfitId = 'bazaar' | 'maharaja' | 'dacoit' | 'diwali';

export interface Outfit {
  id: OutfitId;
  name: string;
  hindiName: string;
  description: string;
  price: number;
  unlocked: boolean;
  colors: {
    kurta: string;
    turban: string;
    sash: string;
    pants: string;
    glow?: string;
  };
  perk: string;
}

export interface ShopItem {
  id: string;
  name: string;
  hindiName: string;
  category: 'powerup' | 'health' | 'weapon';
  price: number;
  description: string;
  icon: string;
  duration?: number; // seconds
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: 'left' | 'right';
  isGrounded: boolean;
  isJumping: boolean;
  canDoubleJump: boolean;
  hasDoubleJumped: boolean;
  isAttacking: boolean;
  attackTimer: number;
  isHurt: boolean;
  hurtTimer: number;
  lives: number;
  maxLives: number;
  savings: number;
  targetGoal: number;
  equippedOutfit: OutfitId;
  ownedOutfits: OutfitId[];
  speechBubble: {
    text: string;
    duration: number;
  } | null;
  buffs: {
    speedBoostUntil: number;
    antiTheftUntil: number;
    hasHeavyLathi: boolean;
    hasVayuSash: boolean;
  };
}

export interface PickpocketEnemy {
  id: number;
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  state: 'patrol' | 'fleeing' | 'stunned';
  facing: 'left' | 'right';
  patrolMinX: number;
  patrolMaxX: number;
  hasStolenPurse: boolean;
  stunTimer: number;
}

export interface ScammerMerchant {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'merchant' | 'masked_accomplice';
  facing: 'left' | 'right';
  speechTimer: number;
  currentSpeech: string;
  trapTriggered: boolean;
}

export interface MatkaPot {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isBroken: boolean;
  rupees: number;
}

export interface TreasureChest {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isOpened: boolean;
  rupees: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  vy: number;
  alpha: number;
  fontSize?: number;
  bold?: boolean;
}

export interface CoinParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  isPouch?: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'sandstone' | 'roof' | 'arch' | 'carpet_zone' | 'shop_zone' | 'boss_throne';
}

export interface DragonBoss {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  state: 'idle' | 'charging' | 'breathing_fire' | 'hurt' | 'defeated';
  stateTimer: number;
  fireballs: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
  }[];
}

export interface PrincessCage {
  x: number;
  y: number;
  width: number;
  height: number;
  isUnlocked: boolean;
}

export interface GameSaveData {
  version: string;
  timestamp: string;
  savings: number;
  lives: number;
  maxLives: number;
  equippedOutfit: OutfitId;
  ownedOutfits: OutfitId[];
  unlockedBossLevel: boolean;
  simranFreed: boolean;
  highScoreMeters: number;
  theme?: GameTheme;
  eyeComfortMode?: boolean;
}
