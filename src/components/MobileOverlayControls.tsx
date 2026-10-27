/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface MobileOverlayControlsProps {
  onDirectionPress: (dir: 'left' | 'right' | 'up' | 'down', active: boolean) => void;
  onButtonAPress: (active: boolean) => void;
  onButtonBPress: (active: boolean) => void;
  savings?: number;
  eyeComfortMode?: boolean;
}

export const MobileOverlayControls: React.FC<MobileOverlayControlsProps> = ({
  onDirectionPress,
  onButtonAPress,
  onButtonBPress,
  savings = 27450,
  eyeComfortMode = true,
}) => {
  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(12);
      }
    } catch {
      // Haptics unavailable
    }
  };

  const handleTouchStart = (action: () => void) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic();
    action();
  };

  const handleTouchEnd = (action: () => void) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    action();
  };

  // Only warn if funds are critically low (< 5,000)
  const isCriticallyLow = savings <= 5000;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none p-2 sm:p-4 flex flex-col justify-end gap-1 select-none pb-safe">
      {/* Contextual Warning: Only appears if savings are critically low (< 5,000 ₹), quiet and gentle on the eyes */}
      {isCriticallyLow && (
        <div className="flex justify-center w-full mb-1">
          <div className="px-3 py-0.5 bg-red-950/75 backdrop-blur-sm border border-red-500/60 rounded-full shadow-md text-center flex items-center gap-1.5 animate-pulse">
            <span className="text-[10px] text-amber-300">⚠️</span>
            <p className="text-[10px] sm:text-[11px] font-bold text-red-200 tracking-wide">
              Caution: Savings Critical ({savings.toLocaleString()} ₹)
            </p>
          </div>
        </div>
      )}

      {/* Main Touch Controls Bar */}
      <div className="flex items-end justify-between w-full max-w-7xl mx-auto px-1 sm:px-2">
        {/* BOTTOM-LEFT: Translucent Minimalist D-Pad (Clean frosted glass, easy on the eyes) */}
        <div className="pointer-events-auto touch-none-select relative w-32 h-32 sm:w-40 sm:h-40 bg-stone-950/45 backdrop-blur-sm rounded-full border border-amber-400/25 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
          
          {/* Subtle Concentric Ring Guide */}
          <div className="absolute inset-1.5 rounded-full border border-yellow-500/15 pointer-events-none" />

          {/* D-Pad Center Cross Background */}
          <div className="absolute w-28 h-10 sm:w-34 sm:h-12 bg-stone-900/50 rounded-xl border border-amber-600/20 -z-0" />
          <div className="absolute w-10 h-28 sm:w-12 sm:h-34 bg-stone-900/50 rounded-xl border border-amber-600/20 -z-0" />

          {/* D-Pad UP */}
          <button
            onTouchStart={handleTouchStart(() => onDirectionPress('up', true))}
            onTouchEnd={handleTouchEnd(() => onDirectionPress('up', false))}
            onMouseDown={() => onDirectionPress('up', true)}
            onMouseUp={() => onDirectionPress('up', false)}
            className="absolute top-1 w-10 h-10 sm:w-12 sm:h-12 bg-amber-950/70 active:bg-amber-700/80 rounded-t-xl border-t border-x border-yellow-400/50 flex items-center justify-center text-amber-200/90 active:scale-95 transition-all shadow group"
            aria-label="Up"
          >
            <ArrowUp className="w-5 h-5 drop-shadow group-active:text-white" />
          </button>

          {/* D-Pad LEFT */}
          <button
            onTouchStart={handleTouchStart(() => onDirectionPress('left', true))}
            onTouchEnd={handleTouchEnd(() => onDirectionPress('left', false))}
            onMouseDown={() => onDirectionPress('left', true)}
            onMouseUp={() => onDirectionPress('left', false)}
            className="absolute left-1 w-10 h-10 sm:w-12 sm:h-12 bg-amber-950/70 active:bg-amber-700/80 rounded-l-xl border-l border-y border-yellow-400/50 flex items-center justify-center text-amber-200/90 active:scale-95 transition-all shadow group"
            aria-label="Left"
          >
            <ArrowLeft className="w-5 h-5 drop-shadow group-active:text-white" />
          </button>

          {/* D-Pad RIGHT */}
          <button
            onTouchStart={handleTouchStart(() => onDirectionPress('right', true))}
            onTouchEnd={handleTouchEnd(() => onDirectionPress('right', false))}
            onMouseDown={() => onDirectionPress('right', true)}
            onMouseUp={() => onDirectionPress('right', false)}
            className="absolute right-1 w-10 h-10 sm:w-12 sm:h-12 bg-amber-950/70 active:bg-amber-700/80 rounded-r-xl border-r border-y border-yellow-400/50 flex items-center justify-center text-amber-200/90 active:scale-95 transition-all shadow group"
            aria-label="Right"
          >
            <ArrowRight className="w-5 h-5 drop-shadow group-active:text-white" />
          </button>

          {/* D-Pad DOWN */}
          <button
            onTouchStart={handleTouchStart(() => onDirectionPress('down', true))}
            onTouchEnd={handleTouchEnd(() => onDirectionPress('down', false))}
            onMouseDown={() => onDirectionPress('down', true)}
            onMouseUp={() => onDirectionPress('down', false)}
            className="absolute bottom-1 w-10 h-10 sm:w-12 sm:h-12 bg-amber-950/70 active:bg-amber-700/80 rounded-b-xl border-b border-x border-yellow-400/50 flex items-center justify-center text-amber-200/90 active:scale-95 transition-all shadow group"
            aria-label="Down"
          >
            <ArrowDown className="w-5 h-5 drop-shadow group-active:text-white" />
          </button>

          {/* D-Pad Center Stud */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-950/80 border border-yellow-400/40 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-yellow-300/60" />
          </div>
        </div>

        {/* Keyboard Quick Guide (Desktop users only, clean & muted) */}
        <div className="hidden lg:flex flex-col items-center text-[10px] text-stone-300 bg-black/50 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10 shadow-lg">
          <span className="font-semibold text-amber-300">Controls:</span>
          <span>Arrows / WASD : Move • [Space / Z] : Jump • [X / Shift] : Whack</span>
        </div>

        {/* BOTTOM-RIGHT: Clean Semi-Translucent Action Buttons 'A' and 'B' */}
        <div className="pointer-events-auto touch-none-select flex items-center gap-3 sm:gap-5">
          
          {/* Button B: Crimson Ruby (Attack / Whack) */}
          <button
            onTouchStart={handleTouchStart(() => onButtonBPress(true))}
            onTouchEnd={handleTouchEnd(() => onButtonBPress(false))}
            onMouseDown={() => onButtonBPress(true)}
            onMouseUp={() => onButtonBPress(false)}
            className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-rose-950/65 active:bg-rose-700/80 border-2 border-rose-400/50 shadow-[0_4px_16px_rgba(225,29,72,0.3)] flex flex-col items-center justify-center text-rose-100 active:scale-90 transition-transform relative group backdrop-blur-sm"
            aria-label="Action Button B (Whack)"
          >
            <span className="font-yatra text-lg sm:text-xl font-bold text-white group-active:scale-105 transition-transform">
              B
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase text-rose-300/90">
              Whack
            </span>
          </button>

          {/* Button A: Amber Gold (Jump) */}
          <button
            onTouchStart={handleTouchStart(() => onButtonAPress(true))}
            onTouchEnd={handleTouchEnd(() => onButtonAPress(false))}
            onMouseDown={() => onButtonAPress(true)}
            onMouseUp={() => onButtonAPress(false)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-600/70 active:bg-amber-500/90 border-2 border-yellow-300/70 shadow-[0_4px_20px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center text-stone-950 active:scale-90 transition-transform -translate-y-2 relative group backdrop-blur-sm"
            aria-label="Action Button A (Jump)"
          >
            <span className="font-yatra text-xl sm:text-2xl font-black text-amber-950 group-active:scale-105 transition-transform">
              A
            </span>
            <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase text-amber-950">
              Jump
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
