import React, { useState } from 'react';
import {
  Heart,
  Volume2,
  VolumeX,
  ShoppingBag,
  Gamepad2,
  Sparkles,
  Shield,
  Zap,
  Moon,
  Sun,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PlayerState, LevelId, DragonBoss, GameTheme } from '../types/game';

interface GameHUDProps {
  player: PlayerState;
  level: LevelId;
  theme: GameTheme;
  dragonBoss: DragonBoss | null;
  onOpenShop: () => void;
  onOpenMiniGame: () => void;
  onOpenCharacterInspector: () => void;
  onOpenSavePublish: () => void;
  onToggleMute: () => void;
  onToggleTheme: () => void;
  onSwitchLevel: (level: LevelId) => void;
  isMuted: boolean;
  eyeComfortMode?: boolean;
  onToggleEyeComfort?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  player,
  level,
  theme,
  dragonBoss,
  onOpenShop,
  onOpenMiniGame,
  onOpenCharacterInspector,
  onOpenSavePublish,
  onToggleMute,
  onToggleTheme,
  onSwitchLevel,
  isMuted,
  eyeComfortMode = true,
  onToggleEyeComfort,
}) => {
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const savingsPercent = Math.min(100, Math.round((player.savings / player.targetGoal) * 100));
  const isGoalReached = player.savings >= player.targetGoal;

  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2 sm:p-3 select-none pt-safe">
      {/* Top Status Bar: Sleek, Calm, Non-Intrusive */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 max-w-7xl mx-auto">
        
        {/* TOP-LEFT: RAJ x Hearts (Clean Frosted Glass) */}
        <div className="pointer-events-auto flex items-center gap-2 bg-stone-950/75 backdrop-blur-md border border-amber-500/40 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-md text-amber-100">
          <span className="font-yatra text-xs sm:text-sm font-bold text-amber-300">
            RAJ x {player.lives}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: player.maxLives }).map((_, idx) => {
              const isFilled = idx < player.lives;
              return (
                <Heart
                  key={idx}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${
                    isFilled ? 'text-rose-500 fill-rose-500' : 'text-stone-600 fill-stone-900/60'
                  }`}
                />
              );
            })}
          </div>

          {/* Buff Indicators: Small, Neat Badges */}
          {player.buffs.speedBoostUntil > Date.now() && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[9px] font-bold flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 text-emerald-400" /> Fast
            </span>
          )}
          {player.buffs.antiTheftUntil > Date.now() && (
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/50 text-[9px] font-bold flex items-center gap-0.5">
              <Shield className="w-2.5 h-2.5 text-cyan-400" /> Shield
            </span>
          )}
        </div>

        {/* TOP-CENTER: Simran Freedom Goal (Calm & Elegant Typography) */}
        <div className="flex flex-col items-center">
          <div className="px-3 sm:px-5 py-1 bg-stone-950/80 backdrop-blur-md border border-amber-500/40 rounded-xl shadow-md text-center">
            <h1 className="font-yatra text-[11px] sm:text-sm font-bold text-amber-200 tracking-wide uppercase">
              {level === 'boss_courtyard' ? 'FINAL BOSS • WEALTHY DRAGON' : "BUY SIMRAN'S FREEDOM"}
            </h1>
            <div className="text-[9px] sm:text-[11px] font-semibold text-amber-300/90 flex items-center justify-center gap-1">
              <span>GOAL: 50,000 ₹</span>
              {isGoalReached && (
                <span className="text-emerald-400 font-bold">• READY!</span>
              )}
            </div>
          </div>

          {/* Dragon Boss Health (Stage 2) */}
          {level === 'boss_courtyard' && dragonBoss && (
            <div className="mt-1 w-40 sm:w-56 bg-stone-950/80 border border-red-500/60 rounded-full px-2 py-0.5 shadow">
              <div className="flex justify-between text-[9px] text-red-300 font-bold px-0.5">
                <span>DRAGON</span>
                <span>{Math.max(0, dragonBoss.hp)} / {dragonBoss.maxHp} HP</span>
              </div>
              <div className="w-full bg-red-950/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-amber-400 h-full transition-all duration-300"
                  style={{ width: `${Math.max(0, (dragonBoss.hp / dragonBoss.maxHp) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* TOP-RIGHT: Savings Counter & Simran Portrait */}
        <div className="pointer-events-auto flex items-center gap-2 bg-stone-950/75 backdrop-blur-md border border-amber-500/40 rounded-xl px-2 sm:px-3 py-1 shadow-md">
          <div className="flex flex-col text-right">
            <span className="text-[10px] sm:text-xs font-bold text-amber-300 font-mono">
              {player.savings.toLocaleString()} / 50k ₹
            </span>
            <div className="w-16 sm:w-28 bg-stone-900 rounded-full h-1.5 overflow-hidden border border-amber-600/40 mt-0.5">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isGoalReached
                    ? 'bg-emerald-400'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                }`}
                style={{ width: `${savingsPercent}%` }}
              />
            </div>
          </div>

          {/* Circular Portrait of Simran */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-yellow-300/80 overflow-hidden shadow bg-stone-900 flex items-center justify-center shrink-0">
            <img
              src="/src/assets/images/simran_princess_bridal_1791602996575.jpg"
              alt="Simran"
              className="w-full h-full object-cover object-top scale-110"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Menu Bar: Clean, Compact & Low-Noise */}
      <div className="pointer-events-auto flex flex-col items-center mt-1.5">
        {/* Toggleable Clean Action Dock */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-950/80 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-lg text-[10px] sm:text-xs font-medium">
          
          {/* Eye Comfort Toggle: Instantly calms down visual noise */}
          {onToggleEyeComfort && (
            <button
              onClick={onToggleEyeComfort}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold transition ${
                eyeComfortMode
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
              title="Toggle Eye Comfort (Simple / Calm vs Rich visuals)"
            >
              <Eye className="w-3 h-3 text-emerald-400" />
              <span>{eyeComfortMode ? 'Calm View' : 'Rich View'}</span>
            </button>
          )}

          {/* Traditional Street Game: Gilli-Danda */}
          <button
            onClick={onOpenMiniGame}
            className="px-2 py-1 rounded-lg text-amber-200/90 hover:text-white hover:bg-stone-800 transition flex items-center gap-1"
            title="Play Gilli-Danda Mini-Game"
          >
            <Gamepad2 className="w-3 h-3 text-yellow-400" />
            <span>Gilli-Danda</span>
          </button>

          {/* Shop */}
          <button
            onClick={onOpenShop}
            className="px-2 py-1 rounded-lg text-rose-200/90 hover:text-white hover:bg-stone-800 transition flex items-center gap-1"
            title="Open Gulab Chacha's Shop"
          >
            <ShoppingBag className="w-3 h-3 text-rose-400" />
            <span>Shop</span>
          </button>

          {/* Characters */}
          <button
            onClick={onOpenCharacterInspector}
            className="px-2 py-1 rounded-lg text-yellow-200/90 hover:text-white hover:bg-stone-800 transition hidden sm:flex items-center gap-1"
            title="Wardrobe & Lore"
          >
            <span>👑</span>
            <span>Outfits</span>
          </button>

          {/* Switch Stage */}
          <button
            onClick={() => onSwitchLevel(level === 'bazaar' ? 'boss_courtyard' : 'bazaar')}
            className="px-2 py-1 rounded-lg text-stone-200 hover:text-white hover:bg-stone-800 transition flex items-center gap-1"
            title="Switch Stage"
          >
            <span>{level === 'bazaar' ? '⚔️ Boss' : '🕌 Bazaar'}</span>
          </button>

          {/* Dark Theme / Sunset */}
          <button
            onClick={onToggleTheme}
            className="p-1 rounded-lg text-stone-300 hover:text-yellow-300 hover:bg-stone-800 transition"
            title={theme === 'midnight' ? 'Switch to Sunset' : 'Switch to Dark Theme'}
          >
            {theme === 'midnight' ? (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* Mute */}
          <button
            onClick={onToggleMute}
            className="p-1 rounded-lg text-stone-300 hover:text-yellow-300 hover:bg-stone-800 transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-500" /> : <Volume2 className="w-3.5 h-3.5 text-yellow-400" />}
          </button>

          {/* Play Store Modal */}
          <button
            onClick={onOpenSavePublish}
            className="px-2 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-600/50 transition flex items-center gap-1"
            title="Play Store Release Suite"
          >
            <span>🚀</span>
            <span className="hidden sm:inline">Play Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};
