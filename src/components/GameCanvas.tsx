/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import {
  LevelId,
  GameTheme,
  PlayerState,
  PickpocketEnemy,
  ScammerMerchant,
  MatkaPot,
  TreasureChest,
  FloatingText,
  CoinParticle,
  Platform,
  DragonBoss,
  PrincessCage,
} from '../types/game';
import { soundManager } from '../utils/audio';
import { OUTFIT_CATALOG } from './InGameShop';

interface GameCanvasProps {
  level: LevelId;
  theme: GameTheme;
  player: PlayerState;
  dragonBoss: DragonBoss;
  cage: PrincessCage;
  onUpdatePlayer: (updater: (prev: PlayerState) => PlayerState) => void;
  onUpdateDragon: (updater: (prev: DragonBoss) => DragonBoss) => void;
  onTriggerMiniGame: () => void;
  onTriggerShop: () => void;
  onGameOver: (reason: 'bankrupt' | 'hearts') => void;
  onVictory: (type: 'ransom_paid' | 'dragon_defeated') => void;
  inputState: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    buttonA: boolean; // Jump
    buttonB: boolean; // Attack / Action
  };
  eyeComfortMode?: boolean;
}

interface MarigoldPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  angle: number;
  spinSpeed: number;
}

interface SkyLantern {
  x: number;
  y: number;
  vy: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  size: number;
  color: string;
}

interface PotShard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  color: string;
  alpha: number;
}

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface NightStar {
  x: number;
  y: number;
  radius: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  theme,
  player,
  dragonBoss,
  cage,
  onUpdatePlayer,
  onUpdateDragon,
  onTriggerMiniGame,
  onTriggerShop,
  onGameOver,
  onVictory,
  inputState,
  eyeComfortMode = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-Resolution Background Backdrops (both Sunset & Dark/Midnight for each stage)
  const backdropsRef = useRef<{
    bazaarSunset: HTMLImageElement | null;
    bazaarMidnight: HTMLImageElement | null;
    bossSunset: HTMLImageElement | null;
    bossMidnight: HTMLImageElement | null;
  }>({
    bazaarSunset: null,
    bazaarMidnight: null,
    bossSunset: null,
    bossMidnight: null,
  });

  // Preload Backdrops
  useEffect(() => {
    const loadImg = (src: string, key: keyof typeof backdropsRef.current) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        backdropsRef.current[key] = img;
      };
    };

    loadImg('/src/assets/images/bazaar_sunset_backdrop_1791598998038.jpg', 'bazaarSunset');
    loadImg('/src/assets/images/bazaar_night_backdrop_1791603495841.jpg', 'bazaarMidnight');
    loadImg('/src/assets/images/dragon_boss_courtyard_1791599008172.jpg', 'bossSunset');
    loadImg('/src/assets/images/dragon_palace_night_backdrop_1791603836309.jpg', 'bossMidnight');
  }, []);

  // Mutable Game Entities & Particle Systems
  const entitiesRef = useRef<{
    platforms: Platform[];
    pickpockets: PickpocketEnemy[];
    scammers: ScammerMerchant[];
    matkas: MatkaPot[];
    chests: TreasureChest[];
    floatingTexts: FloatingText[];
    coins: CoinParticle[];
    petals: MarigoldPetal[];
    lanterns: SkyLantern[];
    stars: NightStar[];
    shards: PotShard[];
    dust: DustParticle[];
    lastPrompt1TheftTrigger: number;
    lastAttackProcessed: boolean;
    lastJumpProcessed: boolean;
    dragonBreathTimer: number;
    globalTick: number;
  }>({
    platforms: [],
    pickpockets: [],
    scammers: [],
    matkas: [],
    chests: [],
    floatingTexts: [],
    coins: [],
    petals: [],
    lanterns: [],
    stars: [],
    shards: [],
    dust: [],
    lastPrompt1TheftTrigger: 0,
    lastAttackProcessed: false,
    lastJumpProcessed: false,
    dragonBreathTimer: 0,
    globalTick: 0,
  });

  // Seed ambient particles (Marigold Petals, Diwali Sky Lanterns, Twinkling Stars)
  useEffect(() => {
    const petals: MarigoldPetal[] = [];
    for (let i = 0; i < 28; i++) {
      petals.push({
        x: Math.random() * 1200,
        y: Math.random() * 600,
        vx: 0.6 + Math.random() * 1.0,
        vy: 0.4 + Math.random() * 0.7,
        size: 3.5 + Math.random() * 3.5,
        color: Math.random() > 0.5 ? '#f59e0b' : '#ea580c',
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.08,
      });
    }
    entitiesRef.current.petals = petals;

    const lanterns: SkyLantern[] = [];
    for (let i = 0; i < 16; i++) {
      lanterns.push({
        x: Math.random() * 1200,
        y: Math.random() * 550,
        vy: -0.25 - Math.random() * 0.4,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleAmp: 1.5 + Math.random() * 2,
        size: 10 + Math.random() * 14,
        color: i % 3 === 0 ? '#ea580c' : i % 3 === 1 ? '#f59e0b' : '#e11d48',
      });
    }
    entitiesRef.current.lanterns = lanterns;

    const stars: NightStar[] = [];
    for (let i = 0; i < 45; i++) {
      stars.push({
        x: Math.random() * 1200,
        y: Math.random() * 260,
        radius: 0.8 + Math.random() * 1.6,
        twinkleSpeed: 0.03 + Math.random() * 0.05,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
    entitiesRef.current.stars = stars;
  }, []);

  // Initialize Level Geometry
  useEffect(() => {
    const isBazaar = level === 'bazaar';
    if (isBazaar) {
      entitiesRef.current.platforms = [
        // Main Ground Bazaar Street
        { x: 0, y: 500, width: 1200, height: 100, type: 'sandstone' },
        // Left Arch Rooftop (Prompt 1: pickpocket platform)
        { x: 40, y: 390, width: 280, height: 24, type: 'arch' },
        // Mid-Left Floating Jali Balcony
        { x: 190, y: 290, width: 180, height: 20, type: 'arch' },
        // Center Arch (Under Raj's mid-air leap in prompt 1)
        { x: 410, y: 400, width: 260, height: 24, type: 'roof' },
        // Upper Center Hanging Arch
        { x: 470, y: 250, width: 200, height: 20, type: 'arch' },
        // Lower Right Platform (Prompt 1: scammer merchant & accomplice)
        { x: 740, y: 420, width: 420, height: 26, type: 'sandstone' },
        // High Right Palace Minaret Ledge
        { x: 880, y: 300, width: 240, height: 22, type: 'roof' },
      ];

      // Pickpocket Enemy on Left Platform (matching Prompt 1)
      entitiesRef.current.pickpockets = [
        {
          id: 1,
          x: 140,
          y: 340,
          vx: -130, // Running away to the left with stolen purse
          width: 38,
          height: 48,
          state: 'fleeing',
          facing: 'left',
          patrolMinX: 40,
          patrolMaxX: 300,
          hasStolenPurse: true,
          stunTimer: 0,
        },
      ];

      // Scammer Merchant & Masked Accomplice on lower right (matching Prompt 1)
      entitiesRef.current.scammers = [
        {
          id: 1,
          x: 820,
          y: 370,
          width: 38,
          height: 50,
          type: 'merchant',
          facing: 'left',
          speechTimer: 0,
          currentSpeech: 'Cheap Gems! 1,000₹ only!',
          trapTriggered: false,
        },
        {
          id: 2,
          x: 940,
          y: 370,
          width: 36,
          height: 48,
          type: 'masked_accomplice',
          facing: 'left',
          speechTimer: 0,
          currentSpeech: 'Hehehe...',
          trapTriggered: false,
        },
      ];

      // Smashable Matka Clay Pots
      entitiesRef.current.matkas = [
        { id: 1, x: 260, y: 360, width: 28, height: 28, isBroken: false, rupees: 750 },
        { id: 2, x: 500, y: 370, width: 28, height: 28, isBroken: false, rupees: 1200 },
        { id: 3, x: 780, y: 390, width: 28, height: 28, isBroken: false, rupees: 950 },
        { id: 4, x: 1040, y: 390, width: 28, height: 28, isBroken: false, rupees: 1500 },
        { id: 5, x: 920, y: 270, width: 28, height: 28, isBroken: false, rupees: 2200 },
      ];

      // Royal Treasure Chests
      entitiesRef.current.chests = [
        { id: 1, x: 230, y: 254, width: 38, height: 34, isOpened: false, rupees: 5000 },
        { id: 2, x: 1060, y: 264, width: 38, height: 34, isOpened: false, rupees: 7500 },
      ];

      // Initial prompt 1 scattering coins & text
      entitiesRef.current.floatingTexts = [
        {
          id: 991,
          x: 430,
          y: 220,
          text: '-5,000 RUPEES',
          color: '#ef4444',
          vy: -1.2,
          alpha: 1.6,
          fontSize: 22,
          bold: true,
        },
      ];

      // Scatter gold coins mid-air around Raj (Prompt 1)
      const initCoins: CoinParticle[] = [];
      for (let i = 0; i < 18; i++) {
        initCoins.push({
          id: Math.random(),
          x: 430 + (Math.random() - 0.5) * 120,
          y: 260 + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 160,
          vy: -100 - Math.random() * 150,
          size: 6 + Math.random() * 5,
          color: '#facc15',
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          isPouch: i === 0,
        });
      }
      entitiesRef.current.coins = initCoins;
    } else {
      // BOSS COURTYARD LEVEL (Prompt 2: The Wealthy Dragon & Simran's Golden Cage)
      entitiesRef.current.platforms = [
        // Ground Courtyard Terrace
        { x: 0, y: 500, width: 1200, height: 100, type: 'sandstone' },
        // Hero Approach Sandstone Platforms
        { x: 80, y: 390, width: 260, height: 26, type: 'sandstone' },
        { x: 380, y: 340, width: 220, height: 24, type: 'arch' },
        // High Sandstone Platform for Wealthy Dragon & Royal Hoard (Prompt 2)
        { x: 680, y: 320, width: 500, height: 180, type: 'boss_throne' },
      ];

      entitiesRef.current.pickpockets = [];
      entitiesRef.current.scammers = [];
      entitiesRef.current.matkas = [
        { id: 10, x: 120, y: 360, width: 28, height: 28, isBroken: false, rupees: 2000 },
        { id: 11, x: 420, y: 310, width: 28, height: 28, isBroken: false, rupees: 3000 },
      ];
      entitiesRef.current.chests = [
        { id: 10, x: 280, y: 354, width: 38, height: 34, isOpened: false, rupees: 10000 },
      ];
      entitiesRef.current.floatingTexts = [
        {
          id: 992,
          x: 640,
          y: 120,
          text: 'PAY 50,000 ₹ OR DEFEAT DRAGON!',
          color: '#fbbf24',
          vy: -0.6,
          alpha: 1.8,
          fontSize: 16,
          bold: true,
        },
      ];
    }
  }, [level]);

  // Main 60 FPS Game Engine Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      updatePhysics(dt);
      renderCanvas();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [level, theme, player, dragonBoss, cage, inputState]);

  // Spawn Ceramic Shards when Matka Pot breaks
  const spawnPotShatter = (x: number, y: number) => {
    const shards: PotShard[] = [];
    for (let i = 0; i < 14; i++) {
      shards.push({
        x: x + 14,
        y: y + 14,
        vx: (Math.random() - 0.5) * 220,
        vy: -140 - Math.random() * 160,
        size: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? '#b45309' : '#d97706',
        alpha: 1,
      });
    }
    entitiesRef.current.shards.push(...shards);
  };

  // Spawn Coin Explosion
  const spawnCoinSplash = (x: number, y: number, count: number) => {
    const coins: CoinParticle[] = [];
    for (let i = 0; i < count; i++) {
      coins.push({
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 200,
        vy: -100 - Math.random() * 160,
        size: 5 + Math.random() * 4,
        color: '#facc15',
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
      });
    }
    entitiesRef.current.coins.push(...coins);
  };

  // Physics, AI, Input Handling & Collision Logic
  const updatePhysics = (dt: number) => {
    const ents = entitiesRef.current;
    ents.globalTick += 1;

    // 1. Move Ambient Petals
    ents.petals.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spinSpeed;
      if (p.x > 1220) p.x = -20;
      if (p.y > 610) p.y = -10;
    });

    // 2. Move Ambient Sky Lanterns (diwali lanterns floating upward)
    ents.lanterns.forEach((l) => {
      l.y += l.vy;
      l.x += Math.sin(ents.globalTick * l.wobbleSpeed) * l.wobbleAmp * 0.15;
      if (l.y < -30) {
        l.y = 620;
        l.x = Math.random() * 1200;
      }
    });

    // 3. Move Pot Shards
    for (let i = ents.shards.length - 1; i >= 0; i--) {
      const s = ents.shards[i];
      s.vy += 800 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.rotation += 0.2;
      s.alpha -= 1.2 * dt;
      if (s.alpha <= 0) ents.shards.splice(i, 1);
    }

    // 4. Move Running Dust
    for (let i = ents.dust.length - 1; i >= 0; i--) {
      const d = ents.dust[i];
      d.alpha -= 1.8 * dt;
      d.radius += 8 * dt;
      if (d.alpha <= 0) ents.dust.splice(i, 1);
    }

    // 5. Move Coins & Pouches
    for (let i = ents.coins.length - 1; i >= 0; i--) {
      const c = ents.coins[i];
      c.vy += 700 * dt;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rotation += 0.15;
      if (c.y > 510) {
        c.y = 510;
        c.vy = -c.vy * 0.4;
        c.vx *= 0.7;
      }
      c.alpha -= 0.3 * dt;
      if (c.alpha <= 0) ents.coins.splice(i, 1);
    }

    // 6. Floating Texts
    for (let i = ents.floatingTexts.length - 1; i >= 0; i--) {
      const ft = ents.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.65 * dt;
      if (ft.alpha <= 0) ents.floatingTexts.splice(i, 1);
    }

    // 7. Player Movement & Physics
    let newX = player.x;
    let newY = player.y;
    let newVx = player.vx;
    let newVy = player.vy;
    let newFacing = player.facing;
    let isGrounded = false;

    const moveSpeed = player.buffs.speedBoostUntil > Date.now() ? 290 : 210;

    if (inputState.left) {
      newVx = -moveSpeed;
      newFacing = 'left';
      if (player.isGrounded && Math.random() > 0.7) {
        ents.dust.push({ x: newX + player.width, y: newY + player.height, radius: 4, alpha: 0.6 });
      }
    } else if (inputState.right) {
      newVx = moveSpeed;
      newFacing = 'right';
      if (player.isGrounded && Math.random() > 0.7) {
        ents.dust.push({ x: newX, y: newY + player.height, radius: 4, alpha: 0.6 });
      }
    } else {
      newVx *= 0.75;
    }

    // Jump Input
    const justPressedJump = inputState.buttonA && !ents.lastJumpProcessed;
    ents.lastJumpProcessed = inputState.buttonA;

    if (justPressedJump) {
      if (player.isGrounded) {
        newVy = -490;
        soundManager.playJump();
        ents.dust.push({ x: newX + player.width / 2, y: newY + player.height, radius: 8, alpha: 0.8 });
      } else if (player.buffs.hasVayuSash && !player.hasDoubleJumped) {
        newVy = -450;
        soundManager.playJump();
        ents.floatingTexts.push({
          id: Math.random(),
          x: newX - 10,
          y: newY - 20,
          text: 'VAYU 2x JUMP!',
          color: '#c084fc',
          vy: -1.5,
          alpha: 1,
        });
        onUpdatePlayer((p) => ({ ...p, hasDoubleJumped: true }));
      }
    }

    // Gravity & Velocity
    newVy += 1000 * dt;
    newX += newVx * dt;
    newY += newVy * dt;

    // World Boundaries
    if (newX < 30) newX = 30;
    if (newX > 1150) newX = 1150;

    // Platform Collisions
    ents.platforms.forEach((plat) => {
      const prevBottom = player.y + player.height;
      const currBottom = newY + player.height;
      const playerLeft = newX;
      const playerRight = newX + player.width;

      if (
        playerRight > plat.x &&
        playerLeft < plat.x + plat.width &&
        prevBottom <= plat.y + 16 &&
        currBottom >= plat.y &&
        newVy >= 0
      ) {
        newY = plat.y - player.height;
        newVy = 0;
        isGrounded = true;
      }
    });

    // Floor Fallback
    if (newY >= 500 - player.height) {
      newY = 500 - player.height;
      newVy = 0;
      isGrounded = true;
    }

    // Action / Attack (Button B: Bamboo Lathi staff whack)
    const justPressedAttack = inputState.buttonB && !ents.lastAttackProcessed;
    ents.lastAttackProcessed = inputState.buttonB;

    if (justPressedAttack && !player.isAttacking) {
      soundManager.playWhack();
      onUpdatePlayer((p) => ({ ...p, isAttacking: true, attackTimer: 0.28 }));

      const attackRange = player.buffs.hasHeavyLathi ? 110 : 75;
      const attackBox = {
        x: newFacing === 'right' ? newX + player.width : newX - attackRange,
        y: newY,
        width: attackRange,
        height: player.height,
      };

      // Hit Pickpocket Enemies
      ents.pickpockets.forEach((pick) => {
        if (
          attackBox.x < pick.x + pick.width &&
          attackBox.x + attackBox.width > pick.x &&
          attackBox.y < pick.y + pick.height &&
          attackBox.y + attackBox.height > pick.y
        ) {
          pick.state = 'stunned';
          pick.stunTimer = 2.8;
          soundManager.playCoin();
          const recovered = 5000;
          ents.floatingTexts.push({
            id: Math.random(),
            x: pick.x - 20,
            y: pick.y - 25,
            text: `RECOVERED +${recovered.toLocaleString()} ₹!`,
            color: '#34d399',
            vy: -1.6,
            alpha: 1.4,
            fontSize: 18,
            bold: true,
          });
          spawnCoinSplash(pick.x + 20, pick.y + 20, 12);
          onUpdatePlayer((p) => ({ ...p, savings: Math.min(50000, p.savings + recovered) }));
        }
      });

      // Hit Matka Pots
      ents.matkas.forEach((matka) => {
        if (
          !matka.isBroken &&
          attackBox.x < matka.x + matka.width &&
          attackBox.x + attackBox.width > matka.x &&
          attackBox.y < matka.y + matka.height &&
          attackBox.y + attackBox.height > matka.y
        ) {
          matka.isBroken = true;
          soundManager.playPotSmash();
          soundManager.playCoin();
          spawnPotShatter(matka.x, matka.y);
          spawnCoinSplash(matka.x + 14, matka.y + 14, 8);
          ents.floatingTexts.push({
            id: Math.random(),
            x: matka.x,
            y: matka.y - 20,
            text: `+${matka.rupees.toLocaleString()} ₹`,
            color: '#fbbf24',
            vy: -1.8,
            alpha: 1.3,
            fontSize: 16,
            bold: true,
          });
          onUpdatePlayer((p) => ({ ...p, savings: Math.min(50000, p.savings + matka.rupees) }));
        }
      });

      // Hit Treasure Chests
      ents.chests.forEach((chest) => {
        if (
          !chest.isOpened &&
          attackBox.x < chest.x + chest.width &&
          attackBox.x + attackBox.width > chest.x &&
          attackBox.y < chest.y + chest.height &&
          attackBox.y + attackBox.height > chest.y
        ) {
          chest.isOpened = true;
          soundManager.playVictoryFanfare();
          soundManager.playCoin();
          spawnCoinSplash(chest.x + 20, chest.y + 10, 16);
          ents.floatingTexts.push({
            id: Math.random(),
            x: chest.x - 20,
            y: chest.y - 30,
            text: `ROYAL CHEST +${chest.rupees.toLocaleString()} ₹!`,
            color: '#facc15',
            vy: -2.0,
            alpha: 1.6,
            fontSize: 18,
            bold: true,
          });
          onUpdatePlayer((p) => ({ ...p, savings: Math.min(50000, p.savings + chest.rupees) }));
        }
      });

      // Attack Boss Dragon (Level 2)
      if (level === 'boss_courtyard' && dragonBoss && dragonBoss.hp > 0) {
        const dragonHitbox = { x: dragonBoss.x, y: dragonBoss.y, width: dragonBoss.width, height: dragonBoss.height };
        if (
          attackBox.x < dragonHitbox.x + dragonHitbox.width &&
          attackBox.x + attackBox.width > dragonHitbox.x &&
          attackBox.y < dragonHitbox.y + dragonHitbox.height &&
          attackBox.y + attackBox.height > dragonHitbox.y
        ) {
          soundManager.playWhack();
          const dmg = player.buffs.hasHeavyLathi ? 25 : 15;
          onUpdateDragon((prev) => {
            const nextHp = Math.max(0, prev.hp - dmg);
            if (nextHp === 0) {
              soundManager.playVictoryFanfare();
              onVictory('dragon_defeated');
            }
            return { ...prev, hp: nextHp, state: nextHp === 0 ? 'defeated' : 'hurt' };
          });
          ents.floatingTexts.push({
            id: Math.random(),
            x: dragonBoss.x + 40,
            y: dragonBoss.y + 20,
            text: `-${dmg} HP!`,
            color: '#ef4444',
            vy: -2,
            alpha: 1.5,
            fontSize: 20,
            bold: true,
          });
        }
      }
    }

    // 8. Update Pickpocket AI & Prompt 1 Theft Event
    ents.pickpockets.forEach((pick) => {
      if (pick.state === 'stunned') {
        pick.stunTimer -= dt;
        if (pick.stunTimer <= 0) pick.state = 'fleeing';
      } else {
        pick.x += pick.vx * dt;
        if (pick.x < pick.patrolMinX) {
          pick.x = pick.patrolMinX;
          pick.vx = Math.abs(pick.vx);
          pick.facing = 'right';
        } else if (pick.x > pick.patrolMaxX) {
          pick.x = pick.patrolMaxX;
          pick.vx = -Math.abs(pick.vx);
          pick.facing = 'left';
        }

        // Steal Rupees on Collision if Player is not shielded
        const pBox = { x: newX, y: newY, width: player.width, height: player.height };
        const eBox = { x: pick.x, y: pick.y, width: pick.width, height: pick.height };

        if (
          pBox.x < eBox.x + eBox.width &&
          pBox.x + pBox.width > eBox.x &&
          pBox.y < eBox.y + eBox.height &&
          pBox.y + pBox.height > eBox.y &&
          player.hurtTimer <= 0
        ) {
          if (player.buffs.antiTheftUntil > Date.now()) {
            // Protected by Suraksha Talisman
            ents.floatingTexts.push({
              id: Math.random(),
              x: newX,
              y: newY - 20,
              text: 'SHIELD PROTECTED!',
              color: '#38bdf8',
              vy: -1.2,
              alpha: 1.2,
            });
          } else {
            // Steal funds & trigger "-5,000 RUPEES" alert (Prompt 1)
            soundManager.playTheftAlert();
            const stolen = 5000;
            const nextSavings = Math.max(0, player.savings - stolen);
            spawnCoinSplash(newX + 18, newY + 24, 16);

            ents.floatingTexts.push({
              id: Math.random(),
              x: newX - 25,
              y: newY - 30,
              text: `-5,000 RUPEES`,
              color: '#ef4444',
              vy: -1.8,
              alpha: 1.6,
              fontSize: 22,
              bold: true,
            });

            onUpdatePlayer((p) => ({
              ...p,
              savings: nextSavings,
              isHurt: true,
              hurtTimer: 1.5,
              speechBubble: { text: 'Thief!', duration: 3.5 },
            }));

            // Check Bankruptcy Game Over (Prompt 3)
            if (nextSavings === 0) {
              soundManager.playGameOverTune();
              onGameOver('bankrupt');
            }
          }
        }
      }
    });

    // 9. Update Scammer Merchant Speech Cycle
    ents.scammers.forEach((s) => {
      s.speechTimer += dt;
      if (s.speechTimer > 4) {
        s.speechTimer = 0;
        if (s.type === 'merchant') {
          s.currentSpeech =
            s.currentSpeech === 'Cheap Gems! 1,000₹ only!'
              ? 'Guaranteed Double Rupees!'
              : 'Cheap Gems! 1,000₹ only!';
        }
      }
    });

    // 10. Update Dragon Boss AI (Level 2)
    if (level === 'boss_courtyard' && dragonBoss && dragonBoss.hp > 0) {
      ents.dragonBreathTimer += dt;
      if (ents.dragonBreathTimer > 3.5) {
        ents.dragonBreathTimer = 0;
        soundManager.playDragonFire();
        onUpdateDragon((prev) => ({
          ...prev,
          state: 'breathing_fire',
          fireballs: [
            ...prev.fireballs,
            {
              x: prev.x - 20,
              y: prev.y + 70,
              vx: -180,
              vy: (Math.random() - 0.5) * 40,
              radius: 12,
            },
          ],
        }));
      }

      // Move Fireballs
      if (dragonBoss.fireballs.length > 0) {
        const nextBalls = dragonBoss.fireballs
          .map((b) => ({ ...b, x: b.x + b.vx * dt, y: b.y + b.vy * dt }))
          .filter((b) => b.x > 0);

        // Check Fireball Hit on Player
        nextBalls.forEach((b) => {
          if (
            b.x > player.x &&
            b.x < player.x + player.width &&
            b.y > player.y &&
            b.y < player.y + player.height &&
            player.hurtTimer <= 0
          ) {
            soundManager.playWhack();
            const nextLives = Math.max(0, player.lives - 1);
            onUpdatePlayer((p) => ({
              ...p,
              lives: nextLives,
              isHurt: true,
              hurtTimer: 1.5,
              speechBubble: { text: 'Aargh!', duration: 2 },
            }));
            if (nextLives === 0) {
              soundManager.playGameOverTune();
              onGameOver('hearts');
            }
          }
        });

        onUpdateDragon((prev) => ({ ...prev, fireballs: nextBalls }));
      }

      // Check Victory Condition: Paying Ransom (50,000 Rupees)
      if (player.savings >= 50000 && !cage.isUnlocked) {
        soundManager.playVictoryFanfare();
        onVictory('ransom_paid');
      }
    }

    // 11. Update Player Timers
    let speechBubble = player.speechBubble;
    if (speechBubble) {
      speechBubble = { ...speechBubble, duration: speechBubble.duration - dt };
      if (speechBubble.duration <= 0) speechBubble = null;
    }

    onUpdatePlayer((prev) => ({
      ...prev,
      x: newX,
      y: newY,
      vx: newVx,
      vy: newVy,
      facing: newFacing,
      isGrounded,
      isJumping: !isGrounded,
      isAttacking: prev.attackTimer > 0,
      attackTimer: Math.max(0, prev.attackTimer - dt),
      isHurt: prev.hurtTimer > 0,
      hurtTimer: Math.max(0, prev.hurtTimer - dt),
      speechBubble,
      hasDoubleJumped: isGrounded ? false : prev.hasDoubleJumped,
    }));
  };

  // High-DPI Canvas Rendering Engine
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ents = entitiesRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    const targetW = 1200 * dpr;
    const targetH = 600 * dpr;
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, 1200, 600);

    const isMidnight = theme === 'midnight';

    // 1. BACKDROP RENDERING (Selecting high-res backdrop image based on stage & theme)
    let bgImg: HTMLImageElement | null = null;
    if (level === 'bazaar') {
      bgImg = isMidnight ? backdropsRef.current.bazaarMidnight : backdropsRef.current.bazaarSunset;
    } else {
      bgImg = isMidnight ? backdropsRef.current.bossMidnight : backdropsRef.current.bossSunset;
    }

    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      const parallaxOffset = (player.x - 600) * 0.04;
      ctx.drawImage(bgImg, -20 - parallaxOffset, 0, 1240, 600);

      // Soothing Eye-Comfort Ambient Contrast Layer
      // Calms high-frequency background details (crowded bazaar shops, spires) so platforms and characters stand out cleanly
      if (eyeComfortMode) {
        ctx.fillStyle = isMidnight ? 'rgba(6, 9, 22, 0.42)' : 'rgba(28, 16, 8, 0.35)';
        ctx.fillRect(0, 0, 1200, 600);
      } else if (isMidnight) {
        ctx.fillStyle = 'rgba(8, 12, 28, 0.28)';
        ctx.fillRect(0, 0, 1200, 600);
      }
    } else {
      // Fallback Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 600);
      if (isMidnight) {
        skyGrad.addColorStop(0, '#040714'); // Obsidian Midnight
        skyGrad.addColorStop(0.35, '#0b132b');
        skyGrad.addColorStop(0.7, '#1c1b4d');
        skyGrad.addColorStop(1, '#2e1065');
      } else {
        skyGrad.addColorStop(0, '#3b0764');
        skyGrad.addColorStop(0.35, '#701a75');
        skyGrad.addColorStop(0.65, '#ea580c');
        skyGrad.addColorStop(1, '#78350f');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1200, 600);
    }

    // 2. NIGHT SKY AMBIENCE (Stars, Moon, and Diwali Lanterns for Dark Theme)
    if (isMidnight) {
      // Twinkling Celestial Stars (Calm count in eyeComfortMode)
      const starsToDraw = eyeComfortMode ? ents.stars.slice(0, 18) : ents.stars;
      starsToDraw.forEach((st) => {
        ctx.save();
        const twinkleSpeed = eyeComfortMode ? st.twinkleSpeed * 0.4 : st.twinkleSpeed;
        const twinkle = (Math.sin(ents.globalTick * twinkleSpeed + st.twinkleOffset) + 1) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.5})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Luminous Radiant Moon
      ctx.save();
      const moonX = level === 'bazaar' ? 1040 : 880;
      const moonY = 80;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 65);
      moonGlow.addColorStop(0, 'rgba(254, 249, 195, 0.95)');
      moonGlow.addColorStop(0.4, 'rgba(253, 224, 71, 0.35)');
      moonGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 65, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Floating Diwali Sky Lanterns (calmed in eye comfort mode)
      const lanternsToDraw = eyeComfortMode ? ents.lanterns.slice(0, 3) : ents.lanterns;
      lanternsToDraw.forEach((lantern) => {
        ctx.save();
        ctx.fillStyle = lantern.color;
        if (!eyeComfortMode) {
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 12;
        }

        // Lantern body
        ctx.beginPath();
        ctx.roundRect(lantern.x, lantern.y, lantern.size * 0.8, lantern.size, 3);
        ctx.fill();

        // Glowing warm flame core
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(lantern.x + (lantern.size * 0.8) / 2, lantern.y + lantern.size * 0.65, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // 3. TIERED SANDSTONE & MARBLE PLATFORMS
    ents.platforms.forEach((plat) => {
      drawPlatform(ctx, plat, isMidnight, eyeComfortMode);
    });

    // 4. FESTIVE MARIGOLD GARLANDS & FLICKERING CLAY DIYAS
    drawCulturalDecorations(ctx, ents.platforms, ents.globalTick, isMidnight, eyeComfortMode);

    // 5. INTERACTIVE CARPET & SHOP ZONES (Level 1)
    if (level === 'bazaar') {
      drawInteractiveZones(ctx, isMidnight);
    }

    // 6. MATKAS & CHESTS
    ents.matkas.forEach((matka) => drawMatkaPot(ctx, matka));
    ents.chests.forEach((chest) => drawTreasureChest(ctx, chest));

    // 7. RUNNING DUST & POT SHARDS
    ents.dust.forEach((d) => {
      ctx.save();
      ctx.fillStyle = `rgba(217, 119, 6, ${Math.max(0, d.alpha * (eyeComfortMode ? 0.6 : 1))})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ents.shards.forEach((s) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(0, 0, s.size, 0, Math.PI);
      ctx.fill();
      ctx.restore();
    });

    // 8. ENEMIES & ACTORS
    if (level === 'bazaar') {
      ents.pickpockets.forEach((p) => drawPickpocket(ctx, p, ents.globalTick));
      ents.scammers.forEach((s) => drawScammer(ctx, s));
    } else {
      // 9. THE WEALTHY DRAGON & PRINCESS SIMRAN CAGE
      drawWealthyDragon(ctx, dragonBoss, ents.globalTick, isMidnight);
      drawPrincessCage(ctx, cage, ents.globalTick);
    }

    // 10. PROTAGONIST "RAJ" (Bespoke Handcrafted High-Detail 2D Cartoon Character)
    drawProtagonistRaj(ctx, player, ents.globalTick);

    // 11. AMBIENT DRIFTING MARIGOLD PETALS (Cleaned in eye comfort mode)
    const petalsToDraw = eyeComfortMode ? ents.petals.slice(0, 5) : ents.petals;
    petalsToDraw.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 12. SCATTERED RUPEE COINS & MONEY POUCH
    ents.coins.forEach((c) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, c.alpha);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      if (c.isPouch) {
        // Red velvet batua pouch
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.arc(0, 0, c.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.fillRect(-c.size / 2, -c.size - 2, c.size, 4);
      } else {
        // Gold Rupee coin with rupee symbol detail
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 6px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('₹', 0, 0);
      }
      ctx.restore();
    });

    // 13. FLOATING TEXTS WITH CALM READABILITY
    ents.floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      const fontSize = eyeComfortMode ? Math.min(16, ft.fontSize || 14) : (ft.fontSize || 14);
      ctx.font = `${ft.bold ? 'bold ' : ''}${fontSize}px 'Yatra One', sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = eyeComfortMode ? 2.5 : 4;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();
  };

  // Tiered Sandstone Platforms (Clean architectural finish in Eye Comfort Mode)
  const drawPlatform = (
    ctx: CanvasRenderingContext2D,
    plat: Platform,
    isMidnight: boolean,
    isEyeComfort: boolean
  ) => {
    ctx.save();
    const grad = ctx.createLinearGradient(0, plat.y, 0, plat.y + plat.height);
    if (isMidnight) {
      grad.addColorStop(0, '#592911'); // Darkened night sandstone
      grad.addColorStop(0.3, '#351406');
      grad.addColorStop(1, '#180d07');
    } else {
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(0.2, '#d97706');
      grad.addColorStop(1, '#78350f');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

    // Gilded top rim molding with warm reflection
    ctx.fillStyle = isMidnight ? '#facc15' : '#fef08a';
    ctx.fillRect(plat.x, plat.y, plat.width, 3.5);
    ctx.strokeStyle = isMidnight ? '#92400e' : '#78350f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);

    // Only draw busy repeating lattice lines if NOT in eyeComfortMode
    if (!isEyeComfort && plat.height > 20 && plat.width > 60) {
      ctx.strokeStyle = isMidnight ? 'rgba(250, 204, 21, 0.22)' : 'rgba(120, 53, 15, 0.45)';
      ctx.lineWidth = 1;
      for (let px = plat.x + 12; px < plat.x + plat.width - 12; px += 18) {
        ctx.strokeRect(px, plat.y + 6, 10, plat.height - 12);
        ctx.beginPath();
        ctx.moveTo(px + 5, plat.y + 7);
        ctx.lineTo(px + 9, plat.y + plat.height / 2);
        ctx.lineTo(px + 5, plat.y + plat.height - 7);
        ctx.lineTo(px + 1, plat.y + plat.height / 2);
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  // Cultural Decorations: Festive Marigold Garlands (Torans) & Flickering Clay Diyas
  const drawCulturalDecorations = (
    ctx: CanvasRenderingContext2D,
    platforms: Platform[],
    tick: number,
    isMidnight: boolean,
    isEyeComfort: boolean
  ) => {
    ctx.save();
    platforms.forEach((p, idx) => {
      // In eye comfort mode, only accent a few key platforms rather than cluttering all of them
      const shouldDecorate = isEyeComfort ? (idx === 1 || idx === 3) : (idx > 0 && idx < 5);
      if (shouldDecorate) {
        const startX = p.x;
        const endX = p.x + p.width;
        const y = p.y;

        // Mango-leaf green rope swag
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = isEyeComfort ? 1.2 : 1.8;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.quadraticCurveTo(startX + (endX - startX) / 2, y + (isEyeComfort ? 12 : 16), endX, y);
        ctx.stroke();

        // Marigold blossom garland
        const baseCount = Math.floor(p.width / 22);
        const count = isEyeComfort ? Math.min(6, Math.floor(baseCount * 0.5)) : Math.min(12, baseCount);
        for (let i = 0; i <= count; i++) {
          const t = i / count;
          const flowerX = startX + t * (endX - startX);
          const flowerY = y + (isEyeComfort ? 12 : 16) * 4 * t * (1 - t);

          ctx.fillStyle = '#166534';
          ctx.beginPath();
          ctx.ellipse(flowerX, flowerY + 3, 1.5, 4, 0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#ea580c';
          ctx.beginPath();
          ctx.arc(flowerX, flowerY, isEyeComfort ? 3.5 : 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Hanging Clay Diyas at platform edges
        [startX + 6, endX - 6].forEach((diyaX) => {
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(diyaX, y);
          ctx.lineTo(diyaX, y + (isEyeComfort ? 11 : 14));
          ctx.stroke();

          // Terracotta clay diya saucer
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.arc(diyaX, y + (isEyeComfort ? 13 : 16), 4.5, 0, Math.PI);
          ctx.fill();

          // Diya flame & calm warm radial halo
          const flicker = isEyeComfort ? Math.sin(tick * 0.08 + diyaX) * 1.5 : Math.sin(tick * 0.15 + diyaX) * 3;
          const haloRadius = isEyeComfort ? 14 + flicker : (isMidnight ? 26 + flicker : 18 + flicker);
          const halo = ctx.createRadialGradient(diyaX, y + 12, 1, diyaX, y + 12, haloRadius);
          halo.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          halo.addColorStop(0.4, isMidnight ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.3)');
          halo.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(diyaX, y + 12, haloRadius, 0, Math.PI * 2);
          ctx.fill();

          // White-hot flame center
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(diyaX, y + 12, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
    ctx.restore();
  };

  // Interactive Zones: Gilli-Danda Carpet & Gulab Chacha's Shop Stall
  const drawInteractiveZones = (ctx: CanvasRenderingContext2D, isMidnight: boolean) => {
    ctx.save();
    // 1. Traditional Indian Street Game: Gilli-Danda Zone
    const carpetX = 420;
    const carpetY = 490;
    ctx.fillStyle = isMidnight ? '#4c0519' : '#881337';
    ctx.fillRect(carpetX, carpetY, 140, 10);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(carpetX, carpetY + 8, 140, 2);
    ctx.font = "bold 10px 'Yatra One', sans-serif";
    ctx.fillStyle = '#fef08a';
    ctx.fillText('🏏 गिल्ली डंडा ZONE (E)', carpetX + 12, carpetY - 4);

    // 2. Gulab Chacha's Shop Stall
    const shopX = 880;
    const shopY = 490;
    ctx.fillStyle = isMidnight ? '#451a03' : '#b45309';
    ctx.fillRect(shopX, shopY - 50, 130, 50);
    for (let ax = shopX; ax < shopX + 130; ax += 20) {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ax, shopY - 60, 10, 12);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(ax + 10, shopY - 60, 10, 12);
    }
    ctx.fillStyle = isMidnight ? '#1c1917' : '#451a03';
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(shopX + 10, shopY - 44, 110, 20);
    ctx.fillRect(shopX + 10, shopY - 44, 110, 20);
    ctx.fillStyle = '#fef08a';
    ctx.font = "bold 10px 'Yatra One', sans-serif";
    ctx.fillText('चाचा गुलाब की दुकान (E)', shopX + 14, shopY - 30);
    ctx.restore();
  };

  // Smashable Matka Pot with Painted Folk Motifs
  const drawMatkaPot = (ctx: CanvasRenderingContext2D, matka: MatkaPot) => {
    if (matka.isBroken) return;
    ctx.save();
    const x = matka.x;
    const y = matka.y;

    // Clay body
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(x + 14, y + 18, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 9, y + 4, 10, 4);

    // Decorative painted white and red ring (Indian folk pottery)
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + 14, y + 18, 11.5, 0.4, Math.PI - 0.4);
    ctx.stroke();

    ctx.strokeStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x + 14, y + 21, 10.5, 0.4, Math.PI - 0.4);
    ctx.stroke();

    ctx.restore();
  };

  // Royal Carved Treasure Chest
  const drawTreasureChest = (ctx: CanvasRenderingContext2D, chest: TreasureChest) => {
    ctx.save();
    const x = chest.x;
    const y = chest.y;

    ctx.fillStyle = '#78350f';
    ctx.fillRect(x, y + 10, chest.width, chest.height - 10);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + 10, chest.width, chest.height - 10);

    // Domed Lid
    ctx.fillStyle = chest.isOpened ? '#451a03' : '#92400e';
    ctx.beginPath();
    ctx.arc(x + chest.width / 2, y + 10, chest.width / 2, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Ornate Golden Keyhole & Ruby Latch
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(x + chest.width / 2, y + 18, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x + chest.width / 2, y + 18, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // =========================================================================
  // BESPOKE HIGH-DEFINITION 2D CARTOON ACTOR ENGINES (100% CLEAN, NO BOX ARTIFACTS)
  // =========================================================================

  // PROTAGONIST "RAJ" (Athletic, Charismatic Hero in Indian Cultural Attire)
  const drawProtagonistRaj = (
    ctx: CanvasRenderingContext2D,
    p: PlayerState,
    tick: number
  ) => {
    ctx.save();
    const outfitConfig = OUTFIT_CATALOG.find((o) => o.id === p.equippedOutfit) || OUTFIT_CATALOG[0];
    const flip = p.facing === 'left';

    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
    if (flip) ctx.scale(-1, 1);

    // Aura glow for active outfits or powerups
    if (outfitConfig.colors.glow || p.buffs.hasHeavyLathi) {
      ctx.shadowColor = outfitConfig.colors.glow || '#facc15';
      ctx.shadowBlur = 18;
    }

    // 1. Soft Dynamic Ground Contact Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    const shadowScale = p.isJumping ? 0.65 : 1.0;
    ctx.ellipse(0, p.height / 2 + 1, 16 * shadowScale, 4.5 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animation Bob
    const runCycle = Math.abs(p.vx) > 10 && p.isGrounded ? Math.sin(tick * 0.3) : 0;
    const jumpStretch = p.isJumping ? -3 : 0;

    // 2. Churidar Trousers & Legs
    const pantsColor = outfitConfig.colors.pants;
    ctx.fillStyle = pantsColor;

    if (p.isJumping) {
      // Mid-Air Jump Pose: Tucked dynamic athletic legs (matching Prompt 1)
      // Left leg tucked forward
      ctx.beginPath();
      ctx.roundRect(-12, 10 + jumpStretch, 9, 14, 3);
      ctx.fill();
      // Right leg trailing backward
      ctx.beginPath();
      ctx.roundRect(4, 8 + jumpStretch, 9, 12, 3);
      ctx.fill();

      // Golden Mojari Shoes with curled tips (Jutti)
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.roundRect(-14, 23 + jumpStretch, 12, 6, 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-14, 23 + jumpStretch, 3, 0, Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(4, 19 + jumpStretch, 11, 6, 2);
      ctx.fill();
    } else {
      // Grounded / Running Stride
      const legOffset = runCycle * 5;
      // Back Leg
      ctx.beginPath();
      ctx.roundRect(3, 12 - legOffset, 8, 16 + legOffset, 2);
      ctx.fill();
      // Front Leg
      ctx.beginPath();
      ctx.roundRect(-9, 12 + legOffset, 8, 16 - legOffset, 2);
      ctx.fill();

      // Handcrafted Curled Mojari Slippers
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-11, 27 + (legOffset > 0 ? -legOffset : 0), 12, 5);
      ctx.fillRect(2, 27 + (legOffset < 0 ? legOffset : 0), 12, 5);
      // Curled pointed toe tip
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(14, 27, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Silk Kurta Tunic
    const kurtaColor = outfitConfig.colors.kurta;
    ctx.fillStyle = kurtaColor;
    ctx.beginPath();
    ctx.roundRect(-14, -12 + jumpStretch, 28, 26, [4, 4, 2, 2]);
    ctx.fill();

    // Kurta Trim & Gold Zari Embroidery Placket
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -12 + jumpStretch);
    ctx.lineTo(0, 0 + jumpStretch);
    ctx.stroke();

    // Tiny Gold Buttons
    ctx.fillStyle = '#fef08a';
    [-8, -4, 0].forEach((btnY) => {
      ctx.beginPath();
      ctx.arc(0, btnY + jumpStretch, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Kamarbandh Waist Sash (Flowing in wind with real-time sinusoidal wave physics)
    const sashColor = outfitConfig.colors.sash;
    ctx.fillStyle = sashColor;
    ctx.fillRect(-14, 2 + jumpStretch, 28, 7);

    // Trailing Silk Ribbon Tail billowing behind Raj
    const windWave = Math.sin(tick * 0.22) * 8;
    ctx.fillStyle = sashColor;
    ctx.beginPath();
    ctx.moveTo(-12, 6 + jumpStretch);
    ctx.quadraticCurveTo(-26 + windWave, 14 + jumpStretch, -34 + windWave * 1.2, 24 + jumpStretch);
    ctx.lineTo(-26 + windWave * 0.8, 25 + jumpStretch);
    ctx.quadraticCurveTo(-18, 14 + jumpStretch, -8, 8 + jumpStretch);
    ctx.closePath();
    ctx.fill();

    // Gold sash fringe
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 5. Hero's Head, Expressive Face & Mustache
    ctx.fillStyle = '#f59e0b'; // Warm Indian skintone
    ctx.beginPath();
    ctx.ellipse(0, -19 + jumpStretch, 10.5, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Almond Eyes with Kajal liner (Expressive wide eyes when shouting "Thief!")
    const isShocked = p.speechBubble?.text === 'Thief!';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(3, -20 + jumpStretch, isShocked ? 3.5 : 2.8, isShocked ? 3.5 : 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pupil looking forward
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(4, -20 + jumpStretch, isShocked ? 1.8 : 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows (arched high in shock)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(1, isShocked ? -25 + jumpStretch : -23 + jumpStretch);
    ctx.lineTo(6, isShocked ? -23 + jumpStretch : -23 + jumpStretch);
    ctx.stroke();

    // Charismatic Mustache with curled ends
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(-2, -15 + jumpStretch);
    ctx.quadraticCurveTo(3, -16 + jumpStretch, 8, -14 + jumpStretch);
    ctx.quadraticCurveTo(4, -13 + jumpStretch, -1, -14 + jumpStretch);
    ctx.fill();

    // Gold Kundal Hoop Earring
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(-7, -18 + jumpStretch, 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // 6. Royal Rajasthani Pagri / Turban with Sarpech Jewel
    const turbanColor = outfitConfig.colors.turban;
    ctx.fillStyle = turbanColor;
    ctx.beginPath();
    ctx.ellipse(0, -26 + jumpStretch, 13, 8.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pleated Pagri Band Folds
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -25 + jumpStretch, 11, -0.4, Math.PI + 0.4);
    ctx.stroke();

    // Jeweled Sarpech Brooch & Peacock Feather Plume
    ctx.fillStyle = '#dc2626'; // Ruby jewel
    ctx.beginPath();
    ctx.arc(2, -27 + jumpStretch, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(2, -27 + jumpStretch, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Plume feather
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(2, -29 + jumpStretch);
    ctx.quadraticCurveTo(6, -37 + jumpStretch, 8, -42 + jumpStretch);
    ctx.stroke();

    // 7. Bamboo Lathi Staff & Dynamic Strike Arc
    ctx.save();
    ctx.strokeStyle = p.buffs.hasHeavyLathi ? '#854d0e' : '#ca8a04';
    ctx.lineWidth = p.buffs.hasHeavyLathi ? 5.5 : 3.8;

    if (p.isAttacking) {
      // Dynamic Golden Slash Arc
      ctx.beginPath();
      ctx.arc(12, -4 + jumpStretch, 32, -0.9, 0.9);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Slashing Lathi Position
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(4, 2 + jumpStretch);
      ctx.lineTo(34, -16 + jumpStretch);
      ctx.stroke();
    } else {
      // Holding Lathi upright
      ctx.beginPath();
      ctx.moveTo(10, 10 + jumpStretch);
      ctx.lineTo(24, -26 + jumpStretch);
      ctx.stroke();

      // Brass rings on Bamboo
      ctx.fillStyle = '#facc15';
      ctx.fillRect(14, -2 + jumpStretch, 3, 3);
      ctx.fillRect(20, -18 + jumpStretch, 3, 3);
    }
    ctx.restore();

    // 8. Cartoon Comic Speech Bubble "Thief!" (Prompt 1)
    if (p.speechBubble) {
      ctx.save();
      if (flip) ctx.scale(-1, 1);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;

      const bubbleW = 86;
      const bubbleH = 36;
      const bx = -bubbleW / 2;
      const by = -76 + jumpStretch;

      // Rounded speech bubble with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(bx, by, bubbleW, bubbleH, 10);
      ctx.fill();
      ctx.stroke();

      // Spiked pointer pointing to Raj's mouth
      ctx.beginPath();
      ctx.moveTo(-2, by + bubbleH);
      ctx.lineTo(-8, by + bubbleH + 11);
      ctx.lineTo(6, by + bubbleH);
      ctx.fill();
      ctx.stroke();

      // Bold Indian-inspired comic typography
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#b91c1c';
      ctx.font = "900 16px 'Yatra One', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(p.speechBubble.text, 0, by + 23);
      ctx.restore();
    }

    ctx.restore();
  };

  // SNEAKY PICKPOCKET (Authentic 2D Cartoon Runner with Stolen Purse, matching Prompt 1)
  const drawPickpocket = (
    ctx: CanvasRenderingContext2D,
    p: PickpocketEnemy,
    tick: number
  ) => {
    ctx.save();
    const x = p.x;
    const y = p.y;
    const flip = p.facing === 'left';

    ctx.translate(x + p.width / 2, y + p.height / 2);
    if (flip) ctx.scale(-1, 1);

    // Ground Contact Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, p.height / 2, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const runBob = p.state === 'fleeing' ? Math.sin(tick * 0.35) * 4 : 0;
    const runStride = p.state === 'fleeing' ? Math.cos(tick * 0.35) * 6 : 0;

    // Running Legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8 - runStride, 12, 7, 14 + runStride);
    ctx.fillRect(3 + runStride, 12, 7, 14 - runStride);

    // Tunic & Vest (Dark Embroidered Dacoit Vest)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-11, -8 + runBob, 22, 20);
    ctx.fillStyle = '#b91c1c'; // Red Vest
    ctx.fillRect(-12, -8 + runBob, 8, 18);
    ctx.fillRect(4, -8 + runBob, 8, 18);

    // Sneaky Head with Narrow Eyes & Smirk
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(0, -16 + runBob, 9.5, 0, Math.PI * 2);
    ctx.fill();

    // Narrow Mischievous Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(3, -17 + runBob, 2.5, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(4, -17 + runBob, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Sneaky Turban with loose tail flapping behind in the wind
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, -22 + runBob, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trailing Turban Tail Flapping
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    const tailWave = Math.sin(tick * 0.3) * 6;
    ctx.moveTo(-8, -20 + runBob);
    ctx.quadraticCurveTo(-18 + tailWave, -16 + runBob, -26 + tailWave, -10 + runBob);
    ctx.stroke();

    // Clutching Stolen Velvet Money Purse with Spilling Coins (Prompt 1)
    if (p.hasStolenPurse) {
      // Crimson velvet money purse
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(14, 2 + runBob, 8, 0, Math.PI * 2);
      ctx.fill();

      // Gold drawstring & spilled coins
      ctx.fillStyle = '#facc15';
      ctx.fillRect(10, -8 + runBob, 8, 3.5);
      ctx.beginPath();
      ctx.arc(18, 5 + runBob, 3, 0, Math.PI * 2);
      ctx.arc(11, 8 + runBob, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stunned State: Orbiting Stars
    if (p.state === 'stunned') {
      ctx.fillStyle = '#facc15';
      for (let s = 0; s < 3; s++) {
        const starAngle = tick * 0.15 + (s * Math.PI * 2) / 3;
        const sx = Math.cos(starAngle) * 14;
        const sy = -32 + Math.sin(starAngle) * 5;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  };

  // SCAMMER MERCHANT & MASKED ACCOMPLICE (Prompt 1)
  const drawScammer = (ctx: CanvasRenderingContext2D, s: ScammerMerchant) => {
    ctx.save();
    const x = s.x;
    const y = s.y;

    // Ground Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(x + 19, y + 46, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    if (s.type === 'merchant') {
      // Shady Merchant in Rajasthani Turban & Brocade Vest
      ctx.fillStyle = '#dc2626'; // Red Brocade
      ctx.fillRect(x + 8, y + 14, 22, 26);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x + 10, y + 36, 18, 12);

      // Head & Big Curled Mustache
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(x + 19, y + 8, 8.5, 0, Math.PI * 2);
      ctx.fill();

      // Curled Mustache
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(x + 19, y + 10, 4, 0, Math.PI);
      ctx.fill();

      // Saffron Bandhej Turban
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(x + 19, y + 2, 11, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Holding fake shiny gem
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(x + 4, y + 18, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Masked Accomplice Lurking by the Arch
      ctx.fillStyle = '#1e293b'; // Indigo garments
      ctx.fillRect(x + 9, y + 14, 20, 30);

      // Masked cowl over face
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(x + 19, y + 8, 8, 0, Math.PI * 2);
      ctx.fill();

      // Piercing Slitted Masked Eyes
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + 13, y + 6, 4, 2);
      ctx.fillRect(x + 19, y + 6, 4, 2);
    }

    // Calligraphic Parchment Speech Box
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 14, y - 26, 72, 18);
    ctx.fillRect(x - 14, y - 26, 72, 18);
    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText(s.currentSpeech, x - 10, y - 14);

    ctx.restore();
  };

  // THE WEALTHY DRAGON & ROYAL GOLD HOARD (Prompt 2: Mythical Indian Dragon)
  const drawWealthyDragon = (
    ctx: CanvasRenderingContext2D,
    dragon: DragonBoss,
    tick: number,
    isMidnight: boolean
  ) => {
    ctx.save();
    const x = dragon.x;
    const y = dragon.y;

    // 1. Massive Royal Gold Hoard Mound (Hundreds of gold coins & jewel chests)
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.ellipse(x + 120, y + 175, 175, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Glittering 3D Coin Details
    ctx.fillStyle = '#fef08a';
    for (let cx = x - 20; cx < x + 260; cx += 18) {
      ctx.beginPath();
      ctx.arc(cx, y + 165 + Math.sin(cx + tick * 0.1) * 7, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Mythical Dragon Undulating Body with Emerald & Gold Scales
    const breath = Math.sin(tick * 0.08) * 4;
    const bodyGrad = ctx.createLinearGradient(x, y, x + 200, y + 160);
    bodyGrad.addColorStop(0, '#047857'); // Emerald
    bodyGrad.addColorStop(0.5, '#0d9488'); // Teal
    bodyGrad.addColorStop(1, '#ca8a04'); // Royal Gold
    ctx.fillStyle = bodyGrad;

    ctx.beginPath();
    ctx.moveTo(x + 50, y + 150);
    ctx.bezierCurveTo(x + 5, y + 65 + breath, x + 80, y + 25 + breath, x + 160, y + 55);
    ctx.bezierCurveTo(x + 230, y + 75, x + 240, y + 150, x + 160, y + 160);
    ctx.fill();

    // Shimmering Golden Scale Arcs
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.8;
    for (let sx = x + 65; sx < x + 200; sx += 22) {
      ctx.beginPath();
      ctx.arc(sx, y + 90 + breath, 11, 0, Math.PI);
      ctx.stroke();
    }

    // 3. Royal Gold Mukut Crown & Ruby Neck Collar (Haar)
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x + 110, y + 75 + breath, 26, 0, Math.PI);
    ctx.stroke();

    // Ruby Center Medallion
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x + 110, y + 106 + breath, 9, 0, Math.PI * 2);
    ctx.fill();

    // 4. Fierce Dragon Head
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.ellipse(x + 55, y + 50 + breath, 36, 24, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Ruby Horns
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(x + 72, y + 36 + breath);
    ctx.lineTo(x + 98, y + 6 + breath);
    ctx.lineTo(x + 82, y + 35 + breath);
    ctx.fill();

    // Fiery Glowing Amber Eyes with vertical slit
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + 46, y + 44 + breath, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + 45.5, y + 41 + breath, 1.8, 6);

    // 5. Billowing Flame Breath Particle Flares
    if (dragon.state === 'breathing_fire') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.beginPath();
      ctx.arc(x + 16, y + 56 + breath, 12, 0, Math.PI * 2);
      ctx.arc(x - 2, y + 60 + breath, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(253, 224, 71, 0.9)';
      ctx.beginPath();
      ctx.arc(x + 10, y + 56 + breath, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // PRINCESS SIMRAN IN GOLDEN CAGE (Prompt 2: Indian Bride in Lehenga)
  const drawPrincessCage = (ctx: CanvasRenderingContext2D, c: PrincessCage, tick: number) => {
    ctx.save();
    const x = c.x;
    const y = c.y;

    // 1. Royal Arched Dome of Golden Birdcage
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x + 40, y + 18, 38, Math.PI, 0);
    ctx.stroke();

    // Lotus Finial Spire
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(x + 40, y - 28);
    ctx.lineTo(x + 35, y - 18);
    ctx.lineTo(x + 45, y - 18);
    ctx.closePath();
    ctx.fill();

    // 2. Handcrafted Princess Simran in Royal Bridal Lehenga (Inside Cage)
    // Rich Crimson & Gold Zari Lehenga Skirt
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(x + 40, y + 54);
    ctx.lineTo(x + 20, y + 106);
    ctx.lineTo(x + 60, y + 106);
    ctx.closePath();
    ctx.fill();

    // Gold Gota Patti & Zari Border on Lehenga
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Golden Choli & Bangles (Chooda)
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x + 32, y + 48, 16, 8);

    // Face & Bridal Jewelry
    ctx.fillStyle = '#fde047'; // Fair golden skin
    ctx.beginPath();
    ctx.arc(x + 40, y + 40, 8.5, 0, Math.PI * 2);
    ctx.fill();

    // Almond Eyes & Bindi
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(x + 42, y + 40, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626'; // Red Bindi & Sindoor
    ctx.beginPath();
    ctx.arc(x + 40, y + 36, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Translucent Red Odhni / Dupatta Veil Draped over Head
    ctx.fillStyle = 'rgba(225, 29, 72, 0.7)';
    ctx.beginPath();
    ctx.ellipse(x + 40, y + 37, 10, 7, 0, Math.PI, 0);
    ctx.fill();

    // Animated Pleading or Joyous Hand Gesture
    const handWave = Math.sin(tick * 0.15) * 3;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(x + 28, y + 54 + handWave, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 52, y + 54 - handWave, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. Polished Golden Cage Bars in Front
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.88)';
    ctx.lineWidth = 3;
    for (let bx = x + 8; bx <= x + 72; bx += 14) {
      ctx.beginPath();
      ctx.moveTo(bx, y + 18);
      ctx.lineTo(bx, y + 110);
      ctx.stroke();
    }

    // Heavy Golden Cage Base Platform
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x - 2, y + 108, 84, 14);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 2, y + 108, 84, 14);

    ctx.restore();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain max-h-[100vh] cursor-crosshair shadow-2xl"
      />
    </div>
  );
};
