/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, User, Heart, Shield, Sparkles, Check, Shirt, Trophy } from 'lucide-react';
import { PlayerState, OutfitId } from '../types/game';
import { soundManager } from '../utils/audio';

interface CharacterInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerState;
  onEquipOutfit: (outfitId: OutfitId) => void;
}

type CharacterTab = 'raj' | 'simran' | 'pickpocket';

export const CharacterInspectorModal: React.FC<CharacterInspectorModalProps> = ({
  isOpen,
  onClose,
  player,
  onEquipOutfit,
}) => {
  const [activeTab, setActiveTab] = useState<CharacterTab>('raj');
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitId>(player.equippedOutfit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900 border-4 border-amber-500 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.6)] overflow-hidden flex flex-col text-amber-100">
        
        {/* Ornate Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-500/50 p-4 bg-amber-950/70">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <div>
              <h2 className="font-yatra text-xl sm:text-2xl font-black text-amber-300">
                Hero &amp; Character Showcase • पात्र परिचय
              </h2>
              <p className="text-xs text-amber-300/80">
                High-definition character appearances, costumes &amp; cultural lore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-600 transition"
            aria-label="Close Character Showcase"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-amber-700/50 bg-black/40">
          <button
            onClick={() => setActiveTab('raj')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'raj'
                ? 'bg-amber-900/70 text-yellow-300 border-b-2 border-yellow-400'
                : 'text-amber-400/70 hover:text-amber-200'
            }`}
          >
            <User className="w-4 h-4" /> Raj (Protagonist)
          </button>
          <button
            onClick={() => setActiveTab('simran')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'simran'
                ? 'bg-amber-900/70 text-yellow-300 border-b-2 border-yellow-400'
                : 'text-amber-400/70 hover:text-amber-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" /> Simran (Princess)
          </button>
          <button
            onClick={() => setActiveTab('pickpocket')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'pickpocket'
                ? 'bg-amber-900/70 text-yellow-300 border-b-2 border-yellow-400'
                : 'text-amber-400/70 hover:text-amber-200'
            }`}
          >
            <Shield className="w-4 h-4 text-yellow-400" /> Pickpocket (Rival)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: RAJ */}
          {activeTab === 'raj' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Character Visual Showcase Frame */}
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] bg-gradient-to-b from-amber-950 via-stone-900 to-black flex items-center justify-center">
                <img
                  src={
                    selectedOutfit === 'maharaja'
                      ? '/src/assets/images/raj_hero_maharaja_1791602987241.jpg'
                      : '/src/assets/images/raj_portrait_night_1791603507656.jpg'
                  }
                  alt="Raj Protagonist"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md rounded-xl p-2 border border-amber-500/40 text-center">
                  <div className="font-yatra text-sm text-yellow-300 font-bold">
                    {selectedOutfit === 'maharaja' ? 'Royal Maharaja Sherwani' : 'Classic Bazaar Kurta'}
                  </div>
                  <div className="text-[10px] text-amber-200/80">
                    {selectedOutfit === 'maharaja' ? 'शाही महाराजा पोशाक' : 'राजप्रासाद छत पर राज'}
                  </div>
                </div>
              </div>

              {/* Character Details & Wardrobe */}
              <div className="space-y-3 text-xs">
                <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-600/40">
                  <h3 className="font-yatra text-base text-yellow-300 font-bold mb-1">
                    Raj • साहसी राज
                  </h3>
                  <p className="text-amber-100/80 leading-relaxed text-[11px]">
                    A high-spirited, agile youth navigating the bustling courtyards and terracotta rooftops of Old Delhi and Jaipur. Armed with a sturdy bamboo staff (lathi) and fearless parkour acrobatics, Raj is determined to rescue Simran from the dragon's royal hoard!
                  </p>
                </div>

                {/* Cultural Attire Breakdown */}
                <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-1.5 text-[11px]">
                  <div className="font-bold text-yellow-400 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Cultural Attire Highlights:
                  </div>
                  <p>• <strong className="text-amber-300">Kurta &amp; Embroidery:</strong> Festive saffron-yellow silk with red border trims and hand-embroidered neckline.</p>
                  <p>• <strong className="text-amber-300">Kamarbandh:</strong> Flowing white silk waist sash that trails dynamically as Raj leaps across arches.</p>
                  <p>• <strong className="text-amber-300">Mojari Shoes:</strong> Traditional handcrafted curled-toe leather footwear for rooftop grip.</p>
                </div>

                {/* Outfit Selector for Raj */}
                <div className="space-y-1.5">
                  <span className="font-bold text-xs text-amber-300">Switch Preview &amp; Equip:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedOutfit('bazaar');
                        onEquipOutfit('bazaar');
                        soundManager.playCoin();
                      }}
                      className={`p-2 rounded-xl border text-left transition flex items-center justify-between ${
                        player.equippedOutfit === 'bazaar'
                          ? 'bg-amber-900/80 border-yellow-400 shadow'
                          : 'bg-stone-900 border-stone-700 hover:border-amber-500'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[11px] text-yellow-200">Bazaar Kurta</div>
                        <div className="text-[9px] text-amber-400">Default Saffron</div>
                      </div>
                      {player.equippedOutfit === 'bazaar' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOutfit('maharaja');
                        if (player.ownedOutfits.includes('maharaja')) {
                          onEquipOutfit('maharaja');
                          soundManager.playCoin();
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition flex items-center justify-between ${
                        player.equippedOutfit === 'maharaja'
                          ? 'bg-amber-900/80 border-yellow-400 shadow'
                          : player.ownedOutfits.includes('maharaja')
                          ? 'bg-stone-900 border-amber-600'
                          : 'bg-stone-950 border-stone-800 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[11px] text-yellow-200">Maharaja Sherwani</div>
                        <div className="text-[9px] text-amber-400">
                          {player.ownedOutfits.includes('maharaja') ? 'Equipped' : 'Shop Unlock'}
                        </div>
                      </div>
                      {player.equippedOutfit === 'maharaja' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOutfit('dacoit');
                        if (player.ownedOutfits.includes('dacoit')) {
                          onEquipOutfit('dacoit');
                          soundManager.playCoin();
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition flex items-center justify-between ${
                        player.equippedOutfit === 'dacoit'
                          ? 'bg-amber-900/80 border-yellow-400 shadow'
                          : player.ownedOutfits.includes('dacoit')
                          ? 'bg-stone-900 border-amber-600'
                          : 'bg-stone-950 border-stone-800 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[11px] text-yellow-200">Midnight Dacoit</div>
                        <div className="text-[9px] text-amber-400">
                          {player.ownedOutfits.includes('dacoit') ? 'Equipped' : 'Shop Unlock'}
                        </div>
                      </div>
                      {player.equippedOutfit === 'dacoit' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOutfit('diwali');
                        if (player.ownedOutfits.includes('diwali')) {
                          onEquipOutfit('diwali');
                          soundManager.playCoin();
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition flex items-center justify-between ${
                        player.equippedOutfit === 'diwali'
                          ? 'bg-amber-900/80 border-yellow-400 shadow'
                          : player.ownedOutfits.includes('diwali')
                          ? 'bg-stone-900 border-amber-600'
                          : 'bg-stone-950 border-stone-800 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[11px] text-yellow-200">Diwali Festival</div>
                        <div className="text-[9px] text-amber-400">
                          {player.ownedOutfits.includes('diwali') ? 'Equipped' : 'Shop Unlock'}
                        </div>
                      </div>
                      {player.equippedOutfit === 'diwali' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRINCESS SIMRAN */}
          {activeTab === 'simran' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)] bg-gradient-to-b from-rose-950 via-stone-900 to-black flex items-center justify-center">
                <img
                  src="/src/assets/images/simran_portrait_night_1791603517003.jpg"
                  alt="Princess Simran"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md rounded-xl p-2 border border-rose-500/40 text-center">
                  <div className="font-yatra text-sm text-rose-300 font-bold">
                    Princess Simran • राजकुमारी सिमरन
                  </div>
                  <div className="text-[10px] text-rose-200/80">
                    Royal Bridal Lehenga with Zari Embroidery
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-rose-950/60 p-3 rounded-xl border border-rose-600/40">
                  <h3 className="font-yatra text-base text-rose-300 font-bold mb-1">
                    Simran • The Royal Beloved
                  </h3>
                  <p className="text-rose-100/80 leading-relaxed text-[11px]">
                    Daughter of the royal haveli, captured and guarded by the Wealthy Dragon in the palace courtyard terrace. She awaits Raj’s arrival, trusting in his courage to either collect the 50,000 ₹ ransom or vanquish the mythical beast!
                  </p>
                </div>

                <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-1.5 text-[11px]">
                  <div className="font-bold text-rose-400 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Bridal Attire &amp; Jewels:
                  </div>
                  <p>• <strong className="text-rose-300">Bridal Lehenga:</strong> Rich crimson silk adorned with pure gold *zari* floral motifs and kalis.</p>
                  <p>• <strong className="text-rose-300">Maang Tikka &amp; Nath:</strong> Royal forehead medallion and delicate pearl-chain nose ring symbolizing virtue and royalty.</p>
                  <p>• <strong className="text-rose-300">Sheer Dupatta:</strong> Hand-woven veil sprinkled with gold sparkles that cascade gracefully.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SNEAKY PICKPOCKET */}
          {activeTab === 'pickpocket' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)] bg-gradient-to-b from-amber-950 via-stone-900 to-black flex items-center justify-center">
                <img
                  src="/src/assets/images/pickpocket_portrait_night_1791603527743.jpg"
                  alt="Sneaky Pickpocket"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md rounded-xl p-2 border border-yellow-500/40 text-center">
                  <div className="font-yatra text-sm text-yellow-300 font-bold">
                    The Sneaky Pickpocket • चतुर जेबकतरा
                  </div>
                  <div className="text-[10px] text-amber-200/80">
                    Nimble Rooftop Thief in Night Alleyway
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-600/40">
                  <h3 className="font-yatra text-base text-yellow-300 font-bold mb-1">
                    Bazaar Thief • गली का उचक्का
                  </h3>
                  <p className="text-amber-100/80 leading-relaxed text-[11px]">
                    Fast-footed and mischievous, this turbaned scoundrel sneaks behind unsuspecting travelers to snatch gold coin pouches (-5,000 ₹). Hit him with Raj’s bamboo lathi to stun him and recover all your stolen wealth!
                  </p>
                </div>

                <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-1.5 text-[11px]">
                  <div className="font-bold text-yellow-400 text-xs flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Combat Strategy &amp; Counters:
                  </div>
                  <p>• <strong className="text-amber-300">Whack with Lathi [Button B]:</strong> Knocks the thief out and immediately refunds +5,000 ₹.</p>
                  <p>• <strong className="text-amber-300">Suraksha Talisman:</strong> Buy from Gulab Chacha’s shop to gain 90s immunity from pickpockets!</p>
                  <p>• <strong className="text-amber-300">Kolhapuri Chappals:</strong> Speed boost helps Raj sprint ahead and intercept fleeing thieves.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-950/70 border-t border-amber-600/40 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 bg-amber-900 hover:bg-amber-800 text-amber-200 rounded-xl font-bold text-xs border border-amber-600 transition"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
