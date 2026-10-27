/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Trophy, Heart, RotateCcw } from 'lucide-react';
import { PlayerState } from '../types/game';

interface VictoryModalProps {
  isOpen: boolean;
  victoryType: 'ransom_paid' | 'dragon_defeated';
  player: PlayerState;
  onContinue: () => void;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  victoryType,
  player,
  onContinue,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-950 via-yellow-950 to-stone-950 border-4 border-yellow-400 rounded-3xl shadow-[0_0_80px_rgba(250,204,21,0.7)] overflow-hidden text-center p-6 sm:p-8 flex flex-col items-center z-10 text-amber-100">
        
        {/* Festive Marigold garland header */}
        <div className="flex items-center gap-2 text-2xl mb-1">
          <span>🌼</span>
          <span>🌺</span>
          <span>👑</span>
          <span>🌺</span>
          <span>🌼</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          SIMRAN IS FREE! • सिमरन आज़ाद है!
        </div>

        {/* Victory Illustration with High-Fidelity Character Art */}
        <div className="relative w-full h-52 sm:h-60 bg-gradient-to-b from-purple-950 via-amber-950 to-stone-950 rounded-2xl border-2 border-yellow-500/50 my-2 overflow-hidden flex items-center justify-around px-4 sm:px-8">
          {/* Showering marigold petals and sparkles */}
          <div className="absolute inset-0 pointer-events-none flex justify-around items-start text-xl sm:text-2xl pt-2 opacity-80">
            <span className="animate-bounce">✨</span>
            <span className="animate-pulse">🌼</span>
            <span className="animate-bounce delay-100">💛</span>
            <span className="animate-pulse delay-200">🌺</span>
            <span className="animate-bounce delay-300">✨</span>
          </div>

          {/* Raj in triumph */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-400 bg-amber-950/70 p-1">
              <img
                src={
                  player.equippedOutfit === 'maharaja'
                    ? '/src/assets/images/raj_hero_maharaja_1791602987241.jpg'
                    : '/src/assets/images/raj_hero_bazaar_1791602977317.jpg'
                }
                alt="Raj Hero"
                className="w-full h-full object-cover object-top scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[11px] font-yatra text-yellow-300 font-bold mt-1 bg-black/60 px-2 py-0.5 rounded-full border border-yellow-500/40">
              Raj the Rescuer
            </span>
          </div>

          {/* Heart Emblem & Wedding Dhol */}
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-rose-600/90 border-2 border-yellow-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-pulse">
              ❤️
            </div>
            <span className="text-[10px] text-amber-200 font-bold bg-amber-950/90 px-2 py-0.5 rounded-full border border-amber-600/50">
              Reunited!
            </span>
          </div>

          {/* Simran Freed */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-400 bg-rose-950/70 p-1">
              <img
                src="/src/assets/images/simran_princess_bridal_1791602996575.jpg"
                alt="Princess Simran"
                className="w-full h-full object-cover object-top scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[11px] font-yatra text-rose-300 font-bold mt-1 bg-black/60 px-2 py-0.5 rounded-full border border-rose-500/40">
              Princess Simran
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-yatra text-3xl sm:text-4xl font-black text-yellow-300 drop-shadow-[0_2px_10px_rgba(250,204,21,0.6)] uppercase mt-2">
          {victoryType === 'ransom_paid' ? '50,000 ₹ RANSOM PAID IN FULL!' : 'THE WEALTHY DRAGON IS DEFEATED!'}
        </h2>

        <p className="font-rozha text-base sm:text-lg text-amber-200 my-2 max-w-lg">
          {victoryType === 'ransom_paid'
            ? 'Raj delivered every single rupee saved from the treacherous bazaar. The dragon honored the pact and released Simran!'
            : 'Raj struck the jeweled weak points with royal bravery! The dragon retreated into the palace shadows, leaving the golden cage wide open!'}
        </p>

        {/* Victory Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-md my-3 text-xs">
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-yellow-500/40">
            <span className="text-amber-400 font-semibold block">Remaining Savings</span>
            <span className="font-yatra text-base text-yellow-300 font-bold">{player.savings.toLocaleString()} ₹</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-yellow-500/40">
            <span className="text-amber-400 font-semibold block">Life Hearts Kept</span>
            <span className="font-yatra text-base text-rose-400 font-bold flex items-center justify-center gap-1">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 inline" /> {player.lives} / {player.maxLives}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-amber-950/80 border border-yellow-500/40">
            <span className="text-amber-400 font-semibold block">Hero Outfit</span>
            <span className="font-yatra text-base text-emerald-300 font-bold capitalize">{player.equippedOutfit}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 w-full max-w-md">
          <button
            onClick={onContinue}
            className="w-full flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-stone-950 font-yatra text-base font-black shadow-xl border-2 border-yellow-200 transform active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            CONTINUE FREE ROAM
          </button>
          <button
            onClick={onRestart}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-xs border border-stone-700 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            NEW QUEST
          </button>
        </div>
      </div>
    </div>
  );
};
