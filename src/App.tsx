/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  LevelId,
  PlayerState,
  DragonBoss,
  PrincessCage,
  OutfitId,
  GameSaveData,
  GameTheme,
} from './types/game';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { MobileOverlayControls } from './components/MobileOverlayControls';
import { InGameShop } from './components/InGameShop';
import { GilliDandaMiniGame } from './components/GilliDandaMiniGame';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { PublishAndSaveModal } from './components/PublishAndSaveModal';
import { CharacterInspectorModal } from './components/CharacterInspectorModal';
import { ShowcaseGallery } from './components/ShowcaseGallery';
import { soundManager } from './utils/audio';
import { loadGameState, saveGameState } from './utils/saveManager';

export default function App() {
  // Device Frame State
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'fullscreen'>('fullscreen');
  const [showcaseView, setShowcaseView] = useState<'playable' | 'prompt1_bazaar' | 'prompt2_boss' | 'prompt3_gameover'>('playable');
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState<GameTheme>(() => {
    const loaded = loadGameState();
    return loaded.theme || 'midnight';
  });
  const [eyeComfortMode, setEyeComfortMode] = useState<boolean>(() => {
    const loaded = loadGameState();
    return loaded.eyeComfortMode ?? true;
  });

  // Level & Modals
  const [level, setLevel] = useState<LevelId>('bazaar');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCharacterInspectorOpen, setIsCharacterInspectorOpen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'bankrupt' | 'hearts'>('bankrupt');
  const [isVictory, setIsVictory] = useState(false);
  const [victoryType, setVictoryType] = useState<'ransom_paid' | 'dragon_defeated'>('ransom_paid');

  // Input State
  const [inputState, setInputState] = useState({
    left: false,
    right: false,
    up: false,
    down: false,
    buttonA: false,
    buttonB: false,
  });

  // Persistent Save State
  const [saveData, setSaveData] = useState<GameSaveData>(() => loadGameState());

  // Player State
  const [player, setPlayer] = useState<PlayerState>({
    x: 480,
    y: 280, // Positioned in center jump for prompt 1
    vx: 0,
    vy: -150,
    width: 36,
    height: 48,
    facing: 'right',
    isGrounded: false,
    isJumping: true,
    canDoubleJump: true,
    hasDoubleJumped: false,
    isAttacking: false,
    attackTimer: 0,
    isHurt: false,
    hurtTimer: 0,
    lives: saveData.lives,
    maxLives: saveData.maxLives,
    savings: saveData.savings,
    targetGoal: 50000,
    equippedOutfit: saveData.equippedOutfit,
    ownedOutfits: saveData.ownedOutfits,
    speechBubble: { text: 'Thief!', duration: 5.0 }, // Prompt 1 initial state
    buffs: {
      speedBoostUntil: 0,
      antiTheftUntil: 0,
      hasHeavyLathi: false,
      hasVayuSash: false,
    },
  });

  // Dragon Boss State (Level 2)
  const [dragonBoss, setDragonBoss] = useState<DragonBoss>({
    x: 760,
    y: 140,
    width: 280,
    height: 200,
    hp: 100,
    maxHp: 100,
    state: 'idle',
    stateTimer: 0,
    fireballs: [],
  });

  // Princess Simran Cage State (Level 2)
  const [cage, setCage] = useState<PrincessCage>({
    x: 1040,
    y: 200,
    width: 80,
    height: 120,
    isUnlocked: false,
  });

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows/space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setInputState((prev) => ({ ...prev, left: true }));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setInputState((prev) => ({ ...prev, right: true }));
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setInputState((prev) => ({ ...prev, up: true }));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setInputState((prev) => ({ ...prev, down: true }));
      } else if (e.key === ' ' || e.key === 'z' || e.key === 'Z') {
        setInputState((prev) => ({ ...prev, buttonA: true }));
      } else if (e.key === 'x' || e.key === 'X' || e.key === 'Shift') {
        setInputState((prev) => ({ ...prev, buttonB: true }));
      } else if (e.key === 'e' || e.key === 'E') {
        // Interact key: Open mini-game if in carpet zone or shop if in stall zone
        if (player.x > 410 && player.x < 550) {
          setIsMiniGameOpen(true);
        } else if (player.x > 860 && player.x < 1010) {
          setIsShopOpen(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setInputState((prev) => ({ ...prev, left: false }));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setInputState((prev) => ({ ...prev, right: false }));
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setInputState((prev) => ({ ...prev, up: false }));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setInputState((prev) => ({ ...prev, down: false }));
      } else if (e.key === ' ' || e.key === 'z' || e.key === 'Z') {
        setInputState((prev) => ({ ...prev, buttonA: false }));
      } else if (e.key === 'x' || e.key === 'X' || e.key === 'Shift') {
        setInputState((prev) => ({ ...prev, buttonB: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player.x]);

  // Touch D-Pad handlers
  const handleDirectionPress = useCallback((dir: 'left' | 'right' | 'up' | 'down', active: boolean) => {
    setInputState((prev) => ({ ...prev, [dir]: active }));
  }, []);

  const handleButtonAPress = useCallback((active: boolean) => {
    setInputState((prev) => ({ ...prev, buttonA: active }));
  }, []);

  const handleButtonBPress = useCallback((active: boolean) => {
    setInputState((prev) => ({ ...prev, buttonB: active }));
  }, []);

  // Sync state to Save System
  const triggerAutoSave = useCallback(() => {
    const updated = saveGameState({
      savings: player.savings,
      lives: player.lives,
      maxLives: player.maxLives,
      equippedOutfit: player.equippedOutfit,
      ownedOutfits: player.ownedOutfits,
      unlockedBossLevel: level === 'boss_courtyard',
      simranFreed: isVictory,
      theme,
      eyeComfortMode,
    });
    setSaveData(updated);
  }, [player, level, isVictory, theme, eyeComfortMode]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next: GameTheme = prev === 'midnight' ? 'sunset' : 'midnight';
      soundManager.playCoin();
      saveGameState({ theme: next });
      return next;
    });
  };

  const handleToggleEyeComfort = () => {
    setEyeComfortMode((prev) => {
      const next = !prev;
      soundManager.playCoin();
      saveGameState({ eyeComfortMode: next });
      return next;
    });
  };

  // Handle Preset Showcase View Changes
  const handleSelectShowcaseView = (view: 'playable' | 'prompt1_bazaar' | 'prompt2_boss' | 'prompt3_gameover') => {
    setShowcaseView(view);
    if (view === 'prompt1_bazaar') {
      setLevel('bazaar');
      setIsGameOver(false);
      setIsVictory(false);
      setPlayer((p) => ({
        ...p,
        x: 480,
        y: 280,
        vx: 0,
        vy: -150,
        isJumping: true,
        speechBubble: { text: 'Thief!', duration: 9999 },
        savings: 27450,
        lives: 2,
      }));
    } else if (view === 'prompt2_boss') {
      setLevel('boss_courtyard');
      setIsGameOver(false);
      setIsVictory(false);
      setPlayer((p) => ({
        ...p,
        x: 180,
        y: 330,
        savings: 50000,
        speechBubble: { text: 'Release Simran!', duration: 9999 },
      }));
    } else if (view === 'prompt3_gameover') {
      setIsGameOver(true);
      setGameOverReason('bankrupt');
    } else {
      setIsGameOver(false);
      setIsVictory(false);
    }
  };

  // Shop Purchases
  const handlePurchaseOutfit = (outfitId: OutfitId, price: number) => {
    if (player.savings >= price) {
      setPlayer((p) => {
        const nextSavings = p.savings - price;
        const nextOwned = [...p.ownedOutfits, outfitId];
        return {
          ...p,
          savings: nextSavings,
          ownedOutfits: nextOwned,
          equippedOutfit: outfitId,
        };
      });
      triggerAutoSave();
    }
  };

  const handleEquipOutfit = (outfitId: OutfitId) => {
    setPlayer((p) => ({ ...p, equippedOutfit: outfitId }));
    triggerAutoSave();
  };

  const handlePurchaseItem = (itemId: string, price: number) => {
    if (player.savings >= price) {
      setPlayer((p) => {
        const nextSavings = p.savings - price;
        const buffs = { ...p.buffs };
        let lives = p.lives;
        let maxLives = p.maxLives;

        if (itemId === 'kolhapuri_chappals') {
          buffs.speedBoostUntil = Date.now() + 60000;
        } else if (itemId === 'vayu_sash') {
          buffs.hasVayuSash = true;
        } else if (itemId === 'suraksha_talisman') {
          buffs.antiTheftUntil = Date.now() + 90000;
        } else if (itemId === 'heavy_lathi') {
          buffs.hasHeavyLathi = true;
        } else if (itemId === 'masala_chai') {
          lives = Math.min(maxLives, lives + 1);
        } else if (itemId === 'amrit_elixir') {
          maxLives += 1;
          lives = maxLives;
        }

        return {
          ...p,
          savings: nextSavings,
          buffs,
          lives,
          maxLives,
        };
      });
      triggerAutoSave();
    }
  };

  // Mini-Game Reward
  const handleMiniGameReward = (rupees: number, bonusHeart: boolean, meters: number) => {
    setPlayer((p) => {
      const nextSavings = Math.min(50000, p.savings + rupees);
      const nextLives = bonusHeart ? Math.min(p.maxLives, p.lives + 1) : p.lives;
      return {
        ...p,
        savings: nextSavings,
        lives: nextLives,
      };
    });

    if (meters > saveData.highScoreMeters) {
      const updated = saveGameState({ highScoreMeters: meters });
      setSaveData(updated);
    }
    triggerAutoSave();
  };

  // Game Over Triggers
  const handleGameOver = (reason: 'bankrupt' | 'hearts') => {
    setIsGameOver(true);
    setGameOverReason(reason);
  };

  const handleRetry = () => {
    setIsGameOver(false);
    setPlayer((p) => ({
      ...p,
      savings: Math.max(10000, p.savings), // seed recovery funds
      lives: p.maxLives,
      x: 200,
      y: 420,
    }));
  };

  const handleVictory = (type: 'ransom_paid' | 'dragon_defeated') => {
    setIsVictory(true);
    setVictoryType(type);
    setCage((c) => ({ ...c, isUnlocked: true }));
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Top Showcase Toolbar */}
      <ShowcaseGallery
        currentView={showcaseView}
        deviceFrame={deviceFrame}
        theme={theme}
        onSelectView={handleSelectShowcaseView}
        onToggleDeviceFrame={() =>
          setDeviceFrame((prev) => (prev === 'mobile' ? 'fullscreen' : 'mobile'))
        }
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Game Stage Container */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-2 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40 relative overflow-hidden">
        
        {/* Device Frame Wrapper (Android Bezel vs Fullscreen) */}
        <div
          className={`relative transition-all duration-300 overflow-hidden flex items-center justify-center ${
            deviceFrame === 'mobile'
              ? 'w-full max-w-5xl h-[88vh] rounded-[42px] border-[14px] border-stone-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-black'
              : 'w-full h-full flex-1'
          }`}
        >
          {/* Mobile Camera Hole Punch / Speaker (Simulated Android) */}
          {deviceFrame === 'mobile' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 pointer-events-none">
              <div className="w-10 h-1.5 bg-stone-700 rounded-full" />
              <div className="w-3 h-3 bg-stone-900 border border-stone-700 rounded-full" />
            </div>
          )}

          {/* Canvas Engine */}
          <GameCanvas
            level={level}
            theme={theme}
            player={player}
            dragonBoss={dragonBoss}
            cage={cage}
            onUpdatePlayer={setPlayer}
            onUpdateDragon={setDragonBoss}
            onTriggerMiniGame={() => setIsMiniGameOpen(true)}
            onTriggerShop={() => setIsShopOpen(true)}
            onGameOver={handleGameOver}
            onVictory={handleVictory}
            inputState={inputState}
            eyeComfortMode={eyeComfortMode}
          />

          {/* Top In-Game HUD: Clean & Ergonomic */}
          <GameHUD
            player={player}
            level={level}
            theme={theme}
            dragonBoss={dragonBoss}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenMiniGame={() => setIsMiniGameOpen(true)}
            onOpenCharacterInspector={() => setIsCharacterInspectorOpen(true)}
            onOpenSavePublish={() => setIsSaveModalOpen(true)}
            onToggleMute={handleToggleMute}
            onToggleTheme={handleToggleTheme}
            onSwitchLevel={(lvl) => setLevel(lvl)}
            isMuted={isMuted}
            eyeComfortMode={eyeComfortMode}
            onToggleEyeComfort={handleToggleEyeComfort}
          />

          {/* Bottom On-Screen Mobile Touch Controls: Translucent & Low Clutter */}
          <MobileOverlayControls
            onDirectionPress={handleDirectionPress}
            onButtonAPress={handleButtonAPress}
            onButtonBPress={handleButtonBPress}
            savings={player.savings}
            eyeComfortMode={eyeComfortMode}
          />
        </div>
      </div>

      {/* Modals */}
      {/* 1. Gilli-Danda Traditional Indian Mini-Game */}
      <GilliDandaMiniGame
        isOpen={isMiniGameOpen}
        onClose={() => setIsMiniGameOpen(false)}
        onReward={handleMiniGameReward}
        highScoreMeters={saveData.highScoreMeters}
      />

      {/* 2. Gulab Chacha's Royal Bazaar Shop */}
      <InGameShop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        player={player}
        onPurchaseOutfit={handlePurchaseOutfit}
        onEquipOutfit={handleEquipOutfit}
        onPurchaseItem={handlePurchaseItem}
      />

      {/* 3. Prompt 3: Bankruptcy Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        reason={gameOverReason}
        onRetry={handleRetry}
        onMainMenu={() => {
          setIsGameOver(false);
          setShowcaseView('playable');
        }}
      />

      {/* 4. Victory / Simran Freed Modal */}
      <VictoryModal
        isOpen={isVictory}
        victoryType={victoryType}
        player={player}
        onContinue={() => setIsVictory(false)}
        onRestart={() => {
          setIsVictory(false);
          setLevel('bazaar');
          setPlayer((p) => ({ ...p, savings: 27450, x: 200, y: 400 }));
        }}
      />

      {/* 5. Character Appearance & Lore Showcase */}
      <CharacterInspectorModal
        isOpen={isCharacterInspectorOpen}
        onClose={() => setIsCharacterInspectorOpen(false)}
        player={player}
        onEquipOutfit={handleEquipOutfit}
      />

      {/* 6. Game Save & Publishing Suite Modal */}
      <PublishAndSaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        currentSave={saveData}
        onManualSave={triggerAutoSave}
        onSaveLoaded={(loaded) => {
          setSaveData(loaded);
          if (loaded.theme) setTheme(loaded.theme);
          if (loaded.eyeComfortMode !== undefined) setEyeComfortMode(loaded.eyeComfortMode);
          setPlayer((p) => ({
            ...p,
            savings: loaded.savings,
            lives: loaded.lives,
            maxLives: loaded.maxLives,
            equippedOutfit: loaded.equippedOutfit,
            ownedOutfits: loaded.ownedOutfits,
          }));
        }}
      />
    </div>
  );
}
