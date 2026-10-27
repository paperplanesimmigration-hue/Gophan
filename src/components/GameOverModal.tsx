/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Home, Coins, AlertTriangle } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  reason: 'bankrupt' | 'hearts';
  onRetry: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  reason,
  onRetry,
  onMainMenu,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-500">
      {/* Faded gray-scale vignette overlay */}
      <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-950 via-neutral-900 to-amber-950/90 border-4 border-red-700/80 rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.5)] overflow-hidden text-center p-6 sm:p-8 flex flex-col items-center z-10">
        
        {/* Top Warning Alert Icon */}
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-red-950/90 border border-red-500/60 text-red-300 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          {reason === 'bankrupt' ? 'Savings Depleted to 0 ₹' : 'All Life Hearts Lost'}
        </div>

        {/* Central Illustration matching Prompt 3 */}
        <div className="relative w-full h-48 sm:h-60 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 rounded-2xl border-2 border-stone-800 my-2 overflow-hidden flex items-center justify-between px-6 sm:px-12">
          {/* Temple background silhouette in shadows */}
          <div className="absolute inset-x-0 bottom-0 h-32 opacity-20 flex items-end justify-around text-4xl text-stone-600 pointer-events-none">
            <span>🏛️</span>
            <span>🕌</span>
            <span>🏛️</span>
            <span>🎪</span>
          </div>

          {/* High-Res Pickpocket fleeing into the shadows with stolen bag */}
          <div className="relative z-10 flex flex-col items-center animate-pulse">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border border-red-500/40 bg-black/50">
              <img
                src="/src/assets/images/pickpocket_enemy_sprite_1791603004694.jpg"
                alt="Escaping Pickpocket"
                className="w-full h-full object-contain -scale-x-100"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] text-amber-400 font-bold mt-1 bg-black/60 px-2 py-0.5 rounded-full border border-yellow-500/30">
              💰 Escaping with 50,000 ₹!
            </span>
          </div>

          {/* High-Res Defeated Raj with empty turned-out pockets */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-stone-700 bg-black/60 filter grayscale-[40%] contrast-110">
              <img
                src="/src/assets/images/raj_hero_bazaar_1791602977317.jpg"
                alt="Defeated Raj"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              {/* Turned-out white empty pocket badges */}
              <div className="absolute bottom-1 left-2 bg-white text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow rotate-[-15deg]">
                EMPTY 0 ₹
              </div>
              <div className="absolute bottom-1 right-2 bg-white text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow rotate-[15deg]">
                LOOTED!
              </div>
            </div>
            <span className="text-[10px] text-red-300 font-bold mt-1 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/50">
              Raj: “All savings gone!”
            </span>
          </div>
        </div>

        {/* Large Bold Indian Typography Heading */}
        <h2 className="font-yatra text-3xl sm:text-5xl font-black text-rose-500 tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] uppercase mt-2">
          BANKRUPT! GAME OVER
        </h2>

        {/* Prompt 3 Subtext */}
        <p className="font-rozha text-base sm:text-xl text-amber-200/90 max-w-md my-2 tracking-wide">
          “The scammers stole all your savings! Simran is still waiting...”
        </p>

        {/* Loss stat badges */}
        <div className="flex items-center gap-3 my-2 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-amber-500" /> Savings: 0 ₹
          </span>
          <span>•</span>
          <span>Courtyard Gate: Locked</span>
        </div>

        {/* Two Prominent Interactive Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full max-w-md">
          <button
            onClick={onRetry}
            className="w-full flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-stone-950 font-yatra text-base sm:text-lg font-black shadow-[0_0_20px_rgba(239,68,68,0.5)] border-2 border-yellow-200 transform active:scale-95 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            RETRY LEVEL
          </button>

          <button
            onClick={onMainMenu}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-sm border border-stone-600 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
