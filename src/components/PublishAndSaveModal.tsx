/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Save,
  Download,
  Upload,
  Copy,
  Check,
  Terminal,
  Smartphone,
  FileText,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Package,
} from 'lucide-react';
import { GameSaveData } from '../types/game';
import { exportSaveFile, importSaveFile, resetGameState } from '../utils/saveManager';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PublishAndSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSave: GameSaveData;
  onManualSave: () => void;
  onSaveLoaded: (loaded: GameSaveData) => void;
}

type TabType = 'playstore' | 'android_package' | 'install_pwa' | 'save_backup';

export const PublishAndSaveModal: React.FC<PublishAndSaveModalProps> = ({
  isOpen,
  onClose,
  currentSave,
  onManualSave,
  onSaveLoaded,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('playstore');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleExport = () => {
    exportSaveFile(currentSave);
    setSaveStatus('Save file exported successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const loaded = importSaveFile(content);
      if (loaded) {
        onSaveLoaded(loaded);
        setSaveStatus('Save file loaded successfully!');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        alert('Invalid save file format.');
      }
    };
    reader.readAsText(file);
  };

  // Google Play Store Metadata
  const playStoreTitle = "Raj's Ransom Run: 2D Platformer";
  const playStoreShortDesc =
    "Help Raj leap across Jaipur & Old Delhi to rescue Simran in an epic Indian run!";
  const playStoreFullDesc = `🇮🇳 Experience the vibrant energy of India in "Raj's Ransom Run", an authentic 2D side-scrolling platformer video game set in the royal bazaars and courtyards of Jaipur and Old Delhi!

👑 THE STORY & QUEST:
Play as Raj, a fearless youth wearing a saffron silk kurta and fluttering kamarbandh waist sash. Simran, Raj's beloved in bridal lehenga, has been locked inside a royal golden birdcage by the Wealthy Dragon! The greedy dragon demands a royal ransom of 50,000 Rupees (₹) to buy Simran's freedom.

Can you leap across sandstone arches, dodge crafty pickpockets, smash clay matkas, and conquer traditional street games to gather the fortune and liberate Simran?

🌟 GAMEPLAY FEATURES:
• BAZAAR HEIST RUN: Sprint across tiered sandstone rooftops and carved jali balconies. Watch out for tricky turbaned pickpockets fleeing with stolen coin pouches, and shady scammer merchants!
• SMASHABLE MATKAS: Whack authentic terracotta clay pots with your bamboo lathi staff to release hidden silver and gold rupees.
• TRADITIONAL STREET SPORT MINI-GAME - GILLI-DANDA: Land in the street sport zone to strike the wooden Gilli with the Danda stick for massive rooftop distance multipliers and bonus currency!
• GULAB CHACHA'S ROYAL BAZAAR EMPORIUM: Spend your collected rupees on 4 authentic cultural outfits (Royal Maharaja Sherwani, Midnight Dacoit Rebel, Diwali Brocade, Bazaar Kurta) and power-ups like Kolhapuri Chappals of Haste, Vayu 2x Jump Sash, and Suraksha Anti-Theft Talisman.
• EPIC FINAL BOSS BATTLE: Face off against the Wealthy Dragon in the palace courtyard terrace at sunset or midnight under glowing Diwali sky lanterns.
• DUAL ATMOSPHERIC THEMES: Play in the vibrant Saffron Sunset or the starry Midnight Dark Theme with illuminated diya oil lamps and glowing full moon.
• COMFORTABLE MOBILE CONTROLS: Specially tuned virtual brass D-pad and responsive A/B action buttons with haptic feedback.
• 100% OFFLINE & PROGRESS SAVED: Automatically saves your rupees, unlocked outfits, and high scores.`;

  const privacyPolicy = `# Privacy Policy for Raj's Ransom Run
Effective Date: October 10, 2026
1. No Personal Data Collection: The Game does not collect, track, or share any personal information.
2. Local Storage Only: Progression is stored strictly locally on your device via standard browser storage.
3. No Ads or Analytics: Zero third-party telemetry, ads, or tracking SDKs.
4. Permissions: Network for caching offline assets; Vibration for tactile touch controls.
Contact: Navrishamgrewal@gmail.com`;

  const buildPlayStoreCommand = `npm run release:android`;

  const keystoreCommand = `keytool -genkey -v -keystore release-keystore.jks -alias raj_release_key -keyalg RSA -keysize 2048 -validity 10000`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900 border-4 border-amber-500 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.6)] overflow-hidden flex flex-col text-amber-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-500/50 p-4 bg-amber-950/80">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🚀</span>
            <div>
              <h2 className="font-yatra text-xl sm:text-2xl font-black text-amber-300">
                Android Play Store &amp; Publishing Suite
              </h2>
              <p className="text-xs text-amber-300/80">
                Official Google Play Console Release, Android Package (AAB/APK) &amp; PWA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex flex-wrap border-b border-amber-700/50 bg-black/50 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'playstore'
                ? 'bg-amber-900/70 text-yellow-300 border-b-2 border-yellow-400'
                : 'text-amber-400/70 hover:text-amber-200'
            }`}
          >
            <span>🏪</span> Play Store Listing
          </button>

          <button
            onClick={() => setActiveTab('android_package')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'android_package'
                ? 'bg-amber-900/70 text-yellow-300 border-b-2 border-yellow-400'
                : 'text-amber-400/70 hover:text-amber-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" /> Android AAB/APK
          </button>

          <button
            onClick={() => setActiveTab('install_pwa')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'install_pwa'
                ? 'bg-amber-900/70 text-yellow-300 border-b-2 border-yellow-400'
                : 'text-amber-400/70 hover:text-amber-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" /> Direct Install &amp; PWA
          </button>

          <button
            onClick={() => setActiveTab('save_backup')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'save_backup'
                ? 'bg-amber-900/70 text-yellow-300 border-b-2 border-yellow-400'
                : 'text-amber-400/70 hover:text-amber-200'
            }`}
          >
            <Save className="w-4 h-4 text-yellow-400" /> Save &amp; Backup
          </button>
        </div>

        {/* Status notice */}
        {saveStatus && (
          <div className="bg-emerald-950 border-b border-emerald-500 px-4 py-2 flex items-center gap-2 text-xs text-emerald-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {saveStatus}
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          
          {/* TAB 1: GOOGLE PLAY STORE LISTING */}
          {activeTab === 'playstore' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/50 border border-emerald-600/50 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-yatra text-base text-emerald-300 font-bold flex items-center gap-2">
                    <span>✅</span> Google Play Store Package Generated
                  </h3>
                  <p className="text-emerald-200/80 text-[11px] mt-0.5">
                    Release artifacts compiled in <code className="text-yellow-300 bg-black/50 px-1 py-0.5 rounded">/release-android-playstore</code> ready for the Google Play Developer Console.
                  </p>
                </div>
                <button
                  onClick={() => copyText(buildPlayStoreCommand, 'cmd')}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 text-xs shadow shrink-0"
                >
                  {copiedKey === 'cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Rebuild Package</span>
                </button>
              </div>

              {/* Title & Short Desc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-yellow-400 text-xs">App Title (≤ 30 chars):</span>
                    <button
                      onClick={() => copyText(playStoreTitle, 'title')}
                      className="text-[10px] text-amber-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="p-2 bg-black/60 rounded font-bold text-amber-100 text-xs">
                    {playStoreTitle}
                  </div>
                </div>

                <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-yellow-400 text-xs">Short Description (≤ 80 chars):</span>
                    <button
                      onClick={() => copyText(playStoreShortDesc, 'shortDesc')}
                      className="text-[10px] text-amber-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === 'shortDesc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="p-2 bg-black/60 rounded text-amber-200/90 text-[11px]">
                    {playStoreShortDesc}
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-400 text-xs">Full Store Description (ASO Optimized):</span>
                  <button
                    onClick={() => copyText(playStoreFullDesc, 'fullDesc')}
                    className="text-[10px] px-2 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded border border-amber-600 flex items-center gap-1"
                  >
                    {copiedKey === 'fullDesc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Full Description</span>
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto p-2.5 bg-black/70 rounded text-[11px] text-stone-300 whitespace-pre-wrap font-sans border border-stone-800">
                  {playStoreFullDesc}
                </div>
              </div>

              {/* Store Assets & Feature Graphic Preview */}
              <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-600/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-400 text-sm flex items-center gap-2">
                    <span>🎨</span> Play Store Visual Assets (Mandatory for Review):
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-mono">
                    High Resolution Ready
                  </span>
                </div>

                {/* Feature Graphic Banner Preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-200">
                      Feature Graphic (1024 × 500 px JPEG/PNG, No Alpha):
                    </span>
                    <a
                      href="/playstore-feature-graphic.jpg"
                      download="raj_playstore_feature_graphic_1024x500.jpg"
                      className="text-[10px] text-yellow-300 hover:text-white underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download Graphic
                    </a>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/60 shadow-lg aspect-[1024/500] max-h-48 bg-stone-900 group">
                    <img
                      src="/playstore-feature-graphic.jpg"
                      alt="Play Store Feature Graphic - Raj's Ransom Run"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[11px] font-yatra text-yellow-300 drop-shadow">
                        Raj's Ransom Run • Official 1024x500 Google Play Store Banner
                      </span>
                    </div>
                  </div>
                </div>

                {/* Icons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/60 p-3 rounded-xl border border-amber-900/60 flex items-center gap-3">
                    <img
                      src="/pwa-512x512.png"
                      alt="App Icon 512x512"
                      className="w-14 h-14 rounded-2xl border border-amber-400 shadow-md bg-stone-900 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <span className="font-bold text-yellow-300 text-xs block">
                        App Icon (512 × 512 px)
                      </span>
                      <p className="text-[10px] text-stone-300">
                        Square 32-bit PNG with Pagri &amp; Temple Arch
                      </p>
                      <a
                        href="/pwa-512x512.png"
                        download="icon_512x512.png"
                        className="text-[10px] text-amber-400 hover:text-yellow-200 underline inline-flex items-center gap-0.5"
                      >
                        <Download className="w-2.5 h-2.5" /> Download Icon
                      </a>
                    </div>
                  </div>

                  <div className="bg-black/60 p-3 rounded-xl border border-amber-900/60 flex items-center gap-3">
                    <img
                      src="/pwa-maskable-512x512.png"
                      alt="Maskable Icon"
                      className="w-14 h-14 rounded-full border border-amber-400 shadow-md bg-stone-900 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <span className="font-bold text-cyan-300 text-xs block">
                        Adaptive / Maskable Icon
                      </span>
                      <p className="text-[10px] text-stone-300">
                        Safe zone padding for Samsung &amp; Pixel squircle masks
                      </p>
                      <a
                        href="/pwa-maskable-512x512.png"
                        download="icon_maskable_512x512.png"
                        className="text-[10px] text-cyan-400 hover:text-cyan-200 underline inline-flex items-center gap-0.5"
                      >
                        <Download className="w-2.5 h-2.5" /> Download Maskable
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Policy */}
              <div className="bg-amber-950/50 p-3.5 rounded-xl border border-amber-600/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Mandatory Privacy Policy (Google Play Policy Compliance):</span>
                  </span>
                  <button
                    onClick={() => copyText(privacyPolicy, 'priv')}
                    className="text-[10px] text-amber-300 hover:text-white flex items-center gap-1 px-2 py-0.5 bg-amber-900/70 rounded border border-amber-600"
                  >
                    {copiedKey === 'priv' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Policy Text</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Google Play Console requires a Privacy Policy URL for all submissions. This game collects zero personal data and stores save states strictly on-device. The policy markdown is located in <code className="text-xs bg-black/40 px-1 rounded text-yellow-300">release-android-playstore/store-listing/PRIVACY_POLICY.md</code>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID AAB / APK BUNDLE PACKAGE */}
          {activeTab === 'android_package' && (
            <div className="space-y-4">
              {/* Method 1: PWABuilder (Fastest, No Install) */}
              <div className="bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-stone-950/80 p-4 rounded-xl border border-cyan-500/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <span className="font-yatra text-cyan-300 font-bold text-sm">
                      Method 1: PWABuilder (Fastest, 1-Click Signed .AAB)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-cyan-900/80 text-cyan-200 border border-cyan-500/50 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-cyan-100/90 leading-relaxed">
                  Generate a Google Play-ready signed <code className="text-yellow-300">.aab</code> (Android App Bundle) directly in your browser without installing Android Studio:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-cyan-200/90 pl-1">
                  <li>Visit <strong className="text-white">pwabuilder.com</strong></li>
                  <li>Paste the live game URL: <code className="bg-black/60 px-1.5 py-0.5 rounded text-yellow-300 select-all font-mono">https://ais-pre-nncvqcprezbrvtzh75nlbk-504272527330.us-east1.run.app</code></li>
                  <li>Click <strong className="text-emerald-300">"Package for Android"</strong> &rarr; enter package ID <code className="text-yellow-300 font-mono">com.raj.ransomrun</code></li>
                  <li>Click <strong className="text-emerald-300">"Generate Package"</strong> and download your signed Play Store <code className="text-emerald-300">.aab</code> bundle!</li>
                </ol>
                <div className="pt-1 flex gap-2">
                  <a
                    href="https://www.pwabuilder.com?url=https://ais-pre-nncvqcprezbrvtzh75nlbk-504272527330.us-east1.run.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-bold rounded-xl flex items-center gap-1.5 text-xs shadow transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open PWABuilder with App URL</span>
                  </a>
                  <button
                    onClick={() => copyText('https://ais-pre-nncvqcprezbrvtzh75nlbk-504272527330.us-east1.run.app', 'liveUrl')}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-cyan-200 font-bold rounded-xl flex items-center gap-1.5 text-xs border border-cyan-800 transition"
                  >
                    {copiedKey === 'liveUrl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Live URL</span>
                  </button>
                </div>
              </div>

              {/* Package ID metadata card */}
              <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>Android Package Configuration:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-black/50 p-2 rounded-lg">
                    <span className="text-stone-400 block">Package ID</span>
                    <span className="font-mono text-emerald-400 font-bold">com.raj.ransomrun</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-lg">
                    <span className="text-stone-400 block">Version Code</span>
                    <span className="font-mono text-yellow-400 font-bold">1</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-lg">
                    <span className="text-stone-400 block">Version Name</span>
                    <span className="font-mono text-yellow-400 font-bold">1.0.0</span>
                  </div>
                  <div className="bg-black/50 p-2 rounded-lg">
                    <span className="text-stone-400 block">Target SDK</span>
                    <span className="font-mono text-cyan-400 font-bold">34 (Android 14)</span>
                  </div>
                </div>
              </div>

              {/* Method 2: Google Bubblewrap CLI */}
              <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Method 2: Google Bubblewrap CLI:</span>
                  </span>
                  <button
                    onClick={() => copyText('bubblewrap build --manifest=./twa-manifest.json', 'bubbleCmd')}
                    className="text-[10px] px-2 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded border border-amber-600 flex items-center gap-1"
                  >
                    {copiedKey === 'bubbleCmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Command</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/90 rounded font-mono text-cyan-300 text-[11px] border border-stone-800 overflow-x-auto">
                  {`# 1. Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Build signed Android App Bundle (.aab) with pre-configured manifest
bubblewrap build --manifest=./twa-manifest.json`}
                </pre>
              </div>

              {/* Method 3: Rebuild Play Store Release artifacts */}
              <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Method 3: Native Gradle / Android Studio:</span>
                  </span>
                  <button
                    onClick={() => copyText('npm run release:android', 'buildCmd')}
                    className="text-[10px] px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 rounded border border-emerald-500 flex items-center gap-1"
                  >
                    {copiedKey === 'buildCmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Run npm run release:android</span>
                  </button>
                </div>
                <p className="text-stone-300 text-[11px]">
                  Open <code className="text-yellow-300">release-android-playstore/android-project</code> in Android Studio, select <strong className="text-yellow-300">Build &gt; Generate Signed Bundle / APK</strong>, and choose Android App Bundle.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT INSTALL & PWA */}
          {activeTab === 'install_pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-yatra text-base text-emerald-300 font-bold mb-1">
                    Instant Android &amp; Chrome PWA Install
                  </h3>
                  <p className="text-emerald-200/90 text-[11px] leading-relaxed">
                    Install Raj's Ransom Run onto your Android device home screen immediately with full offline caching and standalone landscape mode!
                  </p>
                </div>
                {isInstalled ? (
                  <div className="px-4 py-2 bg-emerald-900 text-emerald-200 rounded-xl font-bold border border-emerald-500 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>App Installed</span>
                  </div>
                ) : (
                  <button
                    onClick={install}
                    disabled={!isInstallable}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition active:scale-95 ${
                      isInstallable
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 border border-emerald-300'
                        : 'bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-stone-950" />
                    <span>{isInstallable ? 'Install App Now' : 'Installed / Ready in Browser'}</span>
                  </button>
                )}
              </div>

              {/* Digital Asset Links */}
              <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-2">
                <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Digital Asset Links (.well-known/assetlinks.json):</span>
                </span>
                <p className="text-stone-300 text-[11px]">
                  Configured in <code className="text-yellow-300">public/.well-known/assetlinks.json</code> to bind the host domain to Android package <code className="text-emerald-400">com.raj.ransomrun</code>, hiding browser URL bars when running from the Play Store.
                </p>
              </div>

              {/* Offline Workbox Caching */}
              <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-2">
                <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Offline Service Worker Caching (Workbox):</span>
                </span>
                <p className="text-stone-300 text-[11px]">
                  All game graphics, sound synthesizers, Google Fonts, and level assets are precached for 100% offline gameplay.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SAVE & BACKUP */}
          {activeTab === 'save_backup' && (
            <div className="space-y-4">
              {/* Current save stats card */}
              <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/40">
                <h3 className="font-yatra text-base text-yellow-300 mb-2">Current Run Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-black/40 p-2 rounded-lg">
                    <span className="text-amber-400 block">Savings</span>
                    <span className="font-bold text-yellow-300">{currentSave.savings.toLocaleString()} ₹</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-lg">
                    <span className="text-amber-400 block">Life Hearts</span>
                    <span className="font-bold text-rose-400">{currentSave.lives} / {currentSave.maxLives}</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-lg">
                    <span className="text-amber-400 block">Active Outfit</span>
                    <span className="font-bold text-emerald-300 capitalize">{currentSave.equippedOutfit}</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-lg">
                    <span className="text-amber-400 block">Gilli Record</span>
                    <span className="font-bold text-yellow-400">{currentSave.highScoreMeters}m</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onManualSave();
                    setSaveStatus('Game saved to browser local storage!');
                    setTimeout(() => setSaveStatus(null), 3000);
                  }}
                  className="p-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-emerald-50 font-bold text-sm flex items-center justify-center gap-2 shadow-lg border border-emerald-400 transition active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  Save Game Now
                </button>

                <button
                  onClick={handleExport}
                  className="p-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg border border-yellow-300 transition active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Export Save (.JSON)
                </button>
              </div>

              {/* Import / Restore */}
              <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Import or Restore Game Save
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="w-full sm:w-auto flex-1 cursor-pointer py-2 px-3 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-2 text-stone-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload JSON Save File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => {
                      if (confirm('Reset game save back to starting state (27,450 ₹, 2 hearts)?')) {
                        const reset = resetGameState();
                        onSaveLoaded(reset);
                        setSaveStatus('Save reset to starting default!');
                        setTimeout(() => setSaveStatus(null), 3000);
                      }
                    }}
                    className="w-full sm:w-auto py-2 px-3 bg-red-950/80 hover:bg-red-900 border border-red-700/60 rounded-lg text-xs font-semibold text-red-300"
                  >
                    Reset Progress
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-amber-950/80 border-t border-amber-600/40 flex items-center justify-between">
          <span className="text-[11px] text-amber-300/80 hidden sm:inline">
            Android Package: <code className="text-yellow-300">com.raj.ransomrun</code> (v1.0.0)
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-900 hover:bg-amber-800 text-amber-200 rounded-xl font-bold text-xs border border-amber-600 transition"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
