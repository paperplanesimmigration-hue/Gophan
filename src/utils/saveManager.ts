/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameSaveData, OutfitId } from '../types/game';

const SAVE_KEY = 'raj_ransom_run_save_v1';

export const DEFAULT_SAVE_DATA: GameSaveData = {
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  savings: 27450, // Matches the iconic prompt 1 UI: "SAVED: 27,450 / 50,000 ₹"
  lives: 2,       // Matches prompt 1 UI: "RAJ x 2"
  maxLives: 3,
  equippedOutfit: 'bazaar',
  ownedOutfits: ['bazaar'],
  unlockedBossLevel: false,
  simranFreed: false,
  highScoreMeters: 85,
  theme: 'midnight',
  eyeComfortMode: true,
};

export const saveGameState = (data: Partial<GameSaveData>): GameSaveData => {
  try {
    const existing = loadGameState();
    const updated: GameSaveData = {
      ...existing,
      ...data,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save game state to localStorage:', err);
    return { ...DEFAULT_SAVE_DATA, ...data };
  }
};

export const loadGameState = (): GameSaveData => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...DEFAULT_SAVE_DATA };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SAVE_DATA,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to load game state from localStorage:', err);
    return { ...DEFAULT_SAVE_DATA };
  }
};

export const resetGameState = (): GameSaveData => {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.error('Failed to reset save:', err);
  }
  return { ...DEFAULT_SAVE_DATA };
};

export const exportSaveFile = (data: GameSaveData) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `raj_ransom_run_save_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importSaveFile = (fileContent: string): GameSaveData | null => {
  try {
    const parsed = JSON.parse(fileContent);
    if (typeof parsed.savings === 'number') {
      const sanitized: GameSaveData = {
        version: parsed.version || '1.0.0',
        timestamp: new Date().toISOString(),
        savings: Math.max(0, parsed.savings),
        lives: Math.max(1, parsed.lives || 2),
        maxLives: Math.max(3, parsed.maxLives || 3),
        equippedOutfit: (parsed.equippedOutfit as OutfitId) || 'bazaar',
        ownedOutfits: Array.isArray(parsed.ownedOutfits) ? parsed.ownedOutfits : ['bazaar'],
        unlockedBossLevel: !!parsed.unlockedBossLevel,
        simranFreed: !!parsed.simranFreed,
        highScoreMeters: parsed.highScoreMeters || 0,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(sanitized));
      return sanitized;
    }
    return null;
  } catch (err) {
    console.error('Failed to parse imported save file:', err);
    return null;
  }
};
