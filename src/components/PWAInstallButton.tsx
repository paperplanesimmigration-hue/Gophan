/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Download, Check, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside installed standalone PWA / APK container, hide
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/40">
        <Check className="w-3 h-3" />
        <span>Installed App</span>
      </div>
    );
  }

  // Android / Chromium / Desktop Install
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-[0_0_12px_rgba(16,185,129,0.4)] border border-emerald-400 flex items-center gap-1.5 transition active:scale-95 animate-pulse"
        title="Install Raj's Ransom Run onto your Android device"
      >
        <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
        <span>Install on Android</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-xs border border-amber-600/60 flex items-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900 p-6 border-2 border-amber-500 shadow-2xl text-amber-100">
              <div className="flex items-center justify-between mb-3 border-b border-amber-600/40 pb-2">
                <h3 className="text-base font-bold text-yellow-300 font-yatra">
                  Install on iOS / Safari
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed mb-4">
                1. Tap the <strong className="text-white">Share</strong> button in the Safari bottom toolbar (box with upward arrow).<br />
                2. Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.<br />
                3. Enjoy fullscreen standalone arcade gaming!
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-amber-600 py-2 text-xs font-bold text-stone-950 hover:bg-amber-500 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => {
        // Fallback: trigger PWA prompt if supported or alert instructions
        if (!install()) {
          window.dispatchEvent(new CustomEvent('open-playstore-publish-modal'));
        }
      }}
      className="px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-950 to-stone-900 hover:from-emerald-900 hover:to-stone-800 text-emerald-300 text-xs font-semibold border border-emerald-600/50 flex items-center gap-1 transition"
      title="Install or Package for Android Play Store"
    >
      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
      <span className="hidden sm:inline">Install Android App</span>
    </button>
  );
};
