/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GilliDandaMiniGameProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (rupees: number, bonusHeart: boolean, meters: number) => void;
  highScoreMeters: number;
}

type MiniGameState = 'ready' | 'tipping' | 'striking' | 'flying' | 'result';

export const GilliDandaMiniGame: React.FC<GilliDandaMiniGameProps> = ({
  isOpen,
  onClose,
  onReward,
  highScoreMeters,
}) => {
  const [gameState, setGameState] = useState<MiniGameState>('ready');
  const [pendulumPos, setPendulumPos] = useState(50); // 0 to 100
  const [strikePower, setStrikePower] = useState(0); // 0 to 100
  const [flightDistance, setFlightDistance] = useState(0);
  const [ricochets, setRicochets] = useState<string[]>([]);
  const [totalRupeesEarned, setTotalRupeesEarned] = useState(0);
  const [wonBonusHeart, setWonBonusHeart] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const pendulumDirRef = useRef<number>(1.8);

  // Pendulum swing animation for Danda Strike phase
  useEffect(() => {
    if (gameState === 'striking') {
      const loop = () => {
        setPendulumPos((prev) => {
          let next = prev + pendulumDirRef.current;
          if (next >= 100) {
            next = 100;
            pendulumDirRef.current = -Math.abs(pendulumDirRef.current);
          } else if (next <= 0) {
            next = 0;
            pendulumDirRef.current = Math.abs(pendulumDirRef.current);
          }
          return next;
        });
        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState]);

  if (!isOpen) return null;

  // Step 1: Tip the Gilli off the ground
  const handleTipGilli = () => {
    soundManager.playWhack();
    setGameState('striking');
    pendulumDirRef.current = 2.4;
  };

  // Step 2: Strike the Gilli with the Danda stick
  const handleStrike = () => {
    if (gameState !== 'striking') return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    // Sweet spot is centered at 50%
    const distFromCenter = Math.abs(pendulumPos - 50);
    let power = 0;
    if (distFromCenter < 8) {
      power = 100; // Maharaja Strike!
      soundManager.playVictoryFanfare();
    } else if (distFromCenter < 22) {
      power = 75; // Great Strike!
      soundManager.playWhack();
    } else if (distFromCenter < 38) {
      power = 45; // Fair strike
      soundManager.playWhack();
    } else {
      power = 15; // Weak nick
      soundManager.playWhack();
    }

    setStrikePower(power);
    setGameState('flying');
    startFlightSimulation(power);
  };

  // Step 3: Flight trajectory across the old bazaar rooftops
  const startFlightSimulation = (power: number) => {
    const baseMeters = Math.round(power * 1.8 + Math.random() * 20);
    const hitBell = power > 40 && Math.random() > 0.3;
    const hitHaveli = power > 70 && Math.random() > 0.4;
    const hitKite = power > 50 && Math.random() > 0.5;

    const collectedRicochets: string[] = [];
    let bonusBonus = 0;

    if (hitBell) {
      collectedRicochets.push('🔔 Brass Temple Bell (+1,500 ₹)');
      bonusBonus += 1500;
    }
    if (hitHaveli) {
      collectedRicochets.push('🏰 Royal Haveli Balcony (+3,000 ₹)');
      bonusBonus += 3000;
    }
    if (hitKite) {
      collectedRicochets.push('🪁 Flying Patang Kite (+1,000 ₹)');
      bonusBonus += 1000;
    }

    const finalDistance = baseMeters + collectedRicochets.length * 25;
    const rupeePayout = finalDistance * 35 + bonusBonus;
    const awardedHeart = finalDistance >= 130;
    const newRecord = finalDistance > highScoreMeters;

    // Simulate animated flight counter
    let currentMeters = 0;
    const interval = setInterval(() => {
      currentMeters += 8;
      if (currentMeters >= finalDistance) {
        clearInterval(interval);
        setFlightDistance(finalDistance);
        setRicochets(collectedRicochets);
        setTotalRupeesEarned(rupeePayout);
        setWonBonusHeart(awardedHeart);
        setIsNewRecord(newRecord);
        setGameState('result');
        soundManager.playCoin();
        onReward(rupeePayout, awardedHeart, finalDistance);
      } else {
        setFlightDistance(currentMeters);
      }
    }, 40);
  };

  const handleReset = () => {
    setGameState('ready');
    setPendulumPos(50);
    setFlightDistance(0);
    setRicochets([]);
    setTotalRupeesEarned(0);
    setWonBonusHeart(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 border-4 border-yellow-500 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.5)] overflow-hidden text-amber-100 p-4 sm:p-6">
        
        {/* Ornate Gold Header */}
        <div className="flex items-center justify-between border-b-2 border-yellow-500/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏏</span>
            <div>
              <h2 className="font-yatra text-xl sm:text-2xl font-black text-amber-300 drop-shadow">
                गिल्ली डंडा • Gilli-Danda Street Strike
              </h2>
              <p className="text-xs text-amber-400/80 font-medium">
                Traditional Indian Street Game: Tip the peg & strike across the rooftops!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High Score Banner */}
        <div className="flex items-center justify-between bg-amber-900/40 border border-amber-600/40 rounded-lg px-3 py-1.5 my-3 text-xs">
          <span className="flex items-center gap-1.5 text-yellow-300 font-bold">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Street Record: {highScoreMeters} meters
          </span>
          <span className="text-amber-300/80">Bonus Heart at 130m!</span>
        </div>

        {/* Dynamic Game Field Area */}
        <div className="relative h-60 w-full bg-gradient-to-b from-orange-950 via-amber-900/60 to-stone-950 border-2 border-amber-500/60 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
          
          {/* Skyline Silhouette Background */}
          <div className="absolute inset-x-0 bottom-0 h-28 opacity-30 pointer-events-none flex items-end justify-around text-amber-600 text-4xl">
            <span>🕌</span>
            <span>🎪</span>
            <span>🏛️</span>
            <span>🪁</span>
            <span>🏰</span>
          </div>

          {/* STATE: READY */}
          {gameState === 'ready' && (
            <div className="text-center z-10 flex flex-col items-center gap-3">
              <div className="relative">
                <div className="text-5xl animate-bounce">🏏</div>
                <div className="text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-yellow-500 mt-2">
                  Wooden Peg (Gilli) Ready!
                </div>
              </div>
              <p className="text-xs sm:text-sm text-amber-200 max-w-sm">
                Step 1: Tap the tapered end to flip the Gilli airborne into striking position!
              </p>
              <button
                onClick={handleTipGilli}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-yatra text-lg font-black rounded-xl shadow-lg border border-yellow-200 transform active:scale-95 transition"
              >
                TIP THE GILLI! (टिप लगाओ)
              </button>
            </div>
          )}

          {/* STATE: STRIKING (Pendulum meter) */}
          {gameState === 'striking' && (
            <div className="text-center z-10 flex flex-col items-center w-full gap-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl animate-spin">🪵</span>
                <span className="font-yatra text-base text-yellow-300">
                  GILLI IS AIRBORNE! SWING THE DANDA!
                </span>
              </div>

              {/* Pendulum Timing Bar */}
              <div className="w-full max-w-md bg-stone-950 border-2 border-yellow-400 rounded-full h-8 relative overflow-hidden shadow-inner">
                {/* Zones */}
                <div className="absolute inset-y-0 left-0 w-1/4 bg-rose-900/60" />
                <div className="absolute inset-y-0 left-1/4 w-1/4 bg-amber-600/70" />
                <div className="absolute inset-y-0 left-[42%] w-[16%] bg-yellow-400 flex items-center justify-center font-bold text-[10px] text-amber-950 animate-pulse">
                  MAHARAJA!
                </div>
                <div className="absolute inset-y-0 right-1/4 w-1/4 bg-amber-600/70" />
                <div className="absolute inset-y-0 right-0 w-1/4 bg-rose-900/60" />

                {/* Pendulum Indicator Needle */}
                <div
                  className="absolute top-0 bottom-0 w-3 bg-white border-2 border-amber-950 shadow-[0_0_10px_white] -translate-x-1/2 transition-all duration-75"
                  style={{ left: `${pendulumPos}%` }}
                />
              </div>

              <button
                onClick={handleStrike}
                className="px-8 py-3 bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-400 text-stone-950 font-yatra text-xl font-black rounded-xl shadow-2xl border-2 border-yellow-200 transform active:scale-95 transition animate-pulse"
              >
                STRIKE NOW! (धमाका मारो)
              </button>
            </div>
          )}

          {/* STATE: FLYING */}
          {gameState === 'flying' && (
            <div className="text-center z-10 flex flex-col items-center gap-2">
              <div className="text-4xl animate-bounce">🚀</div>
              <div className="font-yatra text-2xl text-yellow-300 drop-shadow">
                {flightDistance} METERS
              </div>
              <p className="text-xs text-amber-300 animate-pulse">
                Sailing across Jaipur rooftops and havelis...
              </p>
            </div>
          )}

          {/* STATE: RESULT */}
          {gameState === 'result' && (
            <div className="text-center z-10 flex flex-col items-center gap-2 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="font-yatra text-2xl sm:text-3xl font-black text-amber-300">
                  {flightDistance} METERS!
                </span>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>

              {isNewRecord && (
                <span className="px-3 py-0.5 rounded-full bg-yellow-500 text-stone-950 font-bold text-xs shadow animate-bounce">
                  🏆 NEW STREET RECORD!
                </span>
              )}

              {/* Ricochets breakdown */}
              <div className="flex flex-wrap justify-center gap-1.5 my-1">
                {ricochets.map((ricochet, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-amber-900/80 border border-yellow-500/50 text-amber-200 px-2 py-0.5 rounded-md"
                  >
                    {ricochet}
                  </span>
                ))}
              </div>

              {/* Reward */}
              <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-xl px-4 py-2 my-1 text-center">
                <div className="text-xs text-emerald-300 font-semibold">Total Rupee Prize:</div>
                <div className="font-yatra text-xl sm:text-2xl font-black text-yellow-300">
                  +{totalRupeesEarned.toLocaleString()} ₹
                </div>
                {wonBonusHeart && (
                  <div className="flex items-center justify-center gap-1 text-xs text-rose-300 font-bold mt-1">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> +1 EXTRA LIFE HEART!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2">
          {gameState === 'result' ? (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-200 font-bold text-xs rounded-xl border border-amber-600 transition"
              >
                Play Again
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-stone-950 font-yatra font-bold text-sm rounded-xl shadow border border-yellow-200 transition"
              >
                Return to Bazaar
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-amber-400 hover:text-amber-200 font-medium"
            >
              Exit Mini-Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
