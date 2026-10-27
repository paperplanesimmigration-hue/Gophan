import React, { useState } from 'react';
import { Smartphone, Monitor, Eye, Sparkles, Trophy, AlertTriangle, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { GameTheme } from '../types/game';
import { PWAInstallButton } from './PWAInstallButton';

interface ShowcaseGalleryProps {
  currentView: 'playable' | 'prompt1_bazaar' | 'prompt2_boss' | 'prompt3_gameover';
  deviceFrame: 'mobile' | 'fullscreen';
  theme: GameTheme;
  onSelectView: (view: 'playable' | 'prompt1_bazaar' | 'prompt2_boss' | 'prompt3_gameover') => void;
  onToggleDeviceFrame: () => void;
  onToggleTheme: () => void;
}

export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({
  currentView,
  deviceFrame,
  theme,
  onSelectView,
  onToggleDeviceFrame,
  onToggleTheme,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (isCollapsed) {
    return (
      <div className="bg-stone-950/80 backdrop-blur-md border-b border-amber-600/30 px-3 py-1 flex items-center justify-between text-xs select-none z-30">
        <div className="flex items-center gap-2">
          <span className="text-sm">🇮🇳</span>
          <span className="font-yatra font-bold text-amber-300 text-xs">
            Raj's Ransom Run
          </span>
          <span className="text-[10px] text-stone-400 hidden sm:inline">
            • 2D Indian Cultural Platformer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PWAInstallButton />
          <button
            onClick={() => setIsCollapsed(false)}
            className="px-2 py-0.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300/90 border border-amber-600/30 text-[10px] flex items-center gap-1 transition"
          >
            <span>Showcase &amp; View Modes</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-950/95 border-b border-amber-600/40 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs select-none z-30">
      {/* Title & Brand */}
      <div className="flex items-center gap-2">
        <span className="text-lg">🇮🇳</span>
        <div>
          <span className="font-yatra font-bold text-amber-300 text-sm">
            Raj's Ransom Run
          </span>
          <span className="text-[10px] text-amber-400/80 ml-2 hidden sm:inline">
            Vibrant 2D Indian Platformer
          </span>
        </div>
      </div>

      {/* Preset View Switcher matching Prompt 1, Prompt 2, Prompt 3 */}
      <div className="flex items-center gap-1 bg-amber-950/60 p-1 rounded-xl border border-amber-700/50">
        <button
          onClick={() => onSelectView('playable')}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
            currentView === 'playable'
              ? 'bg-amber-500 text-stone-950 shadow'
              : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/40'
          }`}
          title="Interactive Live Playable Game"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Play</span>
        </button>

        <button
          onClick={() => onSelectView('prompt1_bazaar')}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
            currentView === 'prompt1_bazaar'
              ? 'bg-amber-500 text-stone-950 shadow'
              : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/40'
          }`}
          title="Prompt 1: Bazaar Heist Scene View"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Prompt 1: Bazaar</span>
        </button>

        <button
          onClick={() => onSelectView('prompt2_boss')}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
            currentView === 'prompt2_boss'
              ? 'bg-amber-500 text-stone-950 shadow'
              : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/40'
          }`}
          title="Prompt 2: Final Boss Dragon & Cage"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Prompt 2: Boss</span>
        </button>

        <button
          onClick={() => onSelectView('prompt3_gameover')}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
            currentView === 'prompt3_gameover'
              ? 'bg-red-600 text-white shadow'
              : 'text-rose-300/80 hover:text-rose-200 hover:bg-rose-950/40'
          }`}
          title="Prompt 3: Bankruptcy Game Over Scene"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Prompt 3: Game Over</span>
        </button>
      </div>

      {/* Right Controls: PWA Install, Theme Toggle & Device Frame Toggle */}
      <div className="flex items-center gap-1.5">
        {/* Android PWA Install Trigger */}
        <PWAInstallButton />

        {/* Dark Theme / Sunset Switcher */}
        <button
          onClick={onToggleTheme}
          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 font-semibold transition ${
            theme === 'midnight'
              ? 'bg-indigo-950/90 hover:bg-indigo-900 text-indigo-200 border-indigo-600/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
              : 'bg-amber-950/90 hover:bg-amber-900 text-amber-200 border-amber-600/60'
          }`}
          title="Toggle Dark Theme (Midnight) vs Saffron Sunset"
        >
          {theme === 'midnight' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/30" />
              <span>Dark Theme</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>Sunset Theme</span>
            </>
          )}
        </button>

        {/* Device Frame Toggle */}
        <button
          onClick={onToggleDeviceFrame}
          className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-200 border border-stone-700 flex items-center gap-1.5 font-semibold transition"
        >
          {deviceFrame === 'mobile' ? (
            <>
              <Smartphone className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Android Bezel</span>
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Arcade View</span>
            </>
          )}
        </button>

        {/* Re-collapse button */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-700 transition"
          title="Minimize showcase bar for clean play"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
