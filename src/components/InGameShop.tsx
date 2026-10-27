/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, ShoppingCart, Zap, Shield, Sparkles, Heart, Sword, Shirt } from 'lucide-react';
import { Outfit, OutfitId, PlayerState } from '../types/game';
import { soundManager } from '../utils/audio';

interface InGameShopProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerState;
  onPurchaseOutfit: (outfitId: OutfitId, price: number) => void;
  onEquipOutfit: (outfitId: OutfitId) => void;
  onPurchaseItem: (itemId: string, price: number) => void;
}

export const OUTFIT_CATALOG: Outfit[] = [
  {
    id: 'bazaar',
    name: 'Classic Bazaar Kurta',
    hindiName: 'बाज़ार कुर्ता',
    description: 'Raj’s iconic vibrant yellow & red kurta with white waist sash and light trousers.',
    price: 0,
    unlocked: true,
    colors: {
      kurta: '#f59e0b',
      turban: '#b45309',
      sash: '#ffffff',
      pants: '#fef3c7',
    },
    perk: 'Standard street agility and iconic look.',
  },
  {
    id: 'maharaja',
    name: 'Royal Maharaja Sherwani',
    hindiName: 'शाही महाराजा शेरवानी',
    description: 'Gilded gold silk embroidered with emerald brooches and a royal peacock feather turban.',
    price: 6000,
    unlocked: false,
    colors: {
      kurta: '#eab308',
      turban: '#7e22ce',
      sash: '#10b981',
      pants: '#fef08a',
      glow: '#fbbf24',
    },
    perk: 'Generates +10% extra rupees from smashing matkas!',
  },
  {
    id: 'dacoit',
    name: 'Midnight Dacoit Rebel',
    hindiName: 'डाकू बागी पोशाक',
    description: 'Rugged indigo vest with crimson forehead bandana. Strikes fear into rooftop pickpockets.',
    price: 4500,
    unlocked: false,
    colors: {
      kurta: '#312e81',
      turban: '#dc2626',
      sash: '#ef4444',
      pants: '#1e1b4b',
    },
    perk: 'Bamboo lathi strikes push enemies twice as far!',
  },
  {
    id: 'diwali',
    name: 'Diwali Festival Brocade',
    hindiName: 'दिवाली उत्सव पोशाक',
    description: 'Shimmering saffron and marigold brocade illuminated by festive diya sparkles.',
    price: 7500,
    unlocked: false,
    colors: {
      kurta: '#ea580c',
      turban: '#f97316',
      sash: '#facc15',
      pants: '#ffedd5',
      glow: '#f97316',
    },
    perk: 'Shimmers with divine light that scares away scammers.',
  },
];

export const SHOP_ITEMS = [
  {
    id: 'kolhapuri_chappals',
    name: 'Kolhapuri Chappals of Haste',
    hindiName: 'कोल्हापुरी चप्पल',
    category: 'powerup',
    price: 2500,
    description: '+50% Running sprint speed boost for 60 seconds. Outrun any nimble pickpocket!',
    icon: 'zap',
  },
  {
    id: 'vayu_sash',
    name: 'Vayu Double-Jump Sash',
    hindiName: 'वायु छलांग कमरबंद',
    category: 'powerup',
    price: 4000,
    description: 'Ancient silk waist sash blessed by the wind. Unlocks mid-air double jump ability!',
    icon: 'sparkles',
  },
  {
    id: 'suraksha_talisman',
    name: 'Suraksha Anti-Theft Talisman',
    hindiName: 'सुरक्षा ताबीज',
    category: 'powerup',
    price: 3500,
    description: 'Sacred brass amulet that protects your purse. Scammers cannot steal rupees for 90s!',
    icon: 'shield',
  },
  {
    id: 'heavy_lathi',
    name: 'Heavy Bamboo Lathi',
    hindiName: 'मजबूत बांस की लाठी',
    category: 'weapon',
    price: 3000,
    description: 'Reinforced brass-tipped bamboo staff with 2x attack reach and instant enemy stun.',
    icon: 'sword',
  },
  {
    id: 'masala_chai',
    name: 'Kullhad Masala Chai',
    hindiName: 'कुल्हड़ मसाला चाय',
    category: 'health',
    price: 1500,
    description: 'Steaming clay cup of aromatic cardamom tea. Instantly restores +1 Life Heart.',
    icon: 'heart',
  },
  {
    id: 'amrit_elixir',
    name: 'Royal Amrit Elixir',
    hindiName: 'शाही अमृत रस',
    category: 'health',
    price: 8000,
    description: 'Mythical golden nectar. Permanently expands Raj’s maximum health by +1 Heart container!',
    icon: 'heart',
  },
];

export const InGameShop: React.FC<InGameShopProps> = ({
  isOpen,
  onClose,
  player,
  onPurchaseOutfit,
  onEquipOutfit,
  onPurchaseItem,
}) => {
  const [activeTab, setActiveTab] = useState<'outfits' | 'powerups'>('outfits');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 border-4 border-amber-500 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.6)] overflow-hidden flex flex-col text-amber-100">
        
        {/* Header with High-Fidelity Artwork */}
        <div className="relative border-b-2 border-amber-500/50 p-4 bg-amber-950/70 overflow-hidden">
          {/* Backdrop artwork blur */}
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <img
              src="/src/assets/images/gulab_chacha_shop_1791599018919.jpg"
              alt="Gulab Chacha Royal Emporium"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-lg bg-amber-900 flex-shrink-0">
                <img
                  src="/src/assets/images/gulab_chacha_shop_1791599018919.jpg"
                  alt="Gulab Chacha"
                  className="w-full h-full object-cover object-left-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to stylized SVG avatar
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h2 className="font-yatra text-lg sm:text-2xl font-black text-amber-300 drop-shadow">
                  चाचा गुलाब की दुकान • Gulab Chacha’s Emporium
                </h2>
                <p className="text-xs text-amber-200/90 italic drop-shadow">
                  “Aao beta Raj! The finest royal turbans, chappals &amp; talismans in all of Jaipur!”
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-600 transition"
              aria-label="Close Shop"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Player Savings Bar in Shop */}
        <div className="flex items-center justify-between bg-black/50 px-4 py-2 border-b border-amber-600/30 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold">Your Savings:</span>
            <span className="font-yatra text-base font-black text-yellow-300">
              {player.savings.toLocaleString()} ₹
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('outfits')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeTab === 'outfits'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-amber-950/60 text-amber-300 hover:bg-amber-900'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              Raj's Outfits
            </button>
            <button
              onClick={() => setActiveTab('powerups')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeTab === 'powerups'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-amber-950/60 text-amber-300 hover:bg-amber-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Power-Ups &amp; Chai
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'outfits' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OUTFIT_CATALOG.map((outfit) => {
                const isOwned = player.ownedOutfits.includes(outfit.id);
                const isEquipped = player.equippedOutfit === outfit.id;
                const canAfford = player.savings >= outfit.price;

                return (
                  <div
                    key={outfit.id}
                    className={`relative p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      isEquipped
                        ? 'bg-amber-900/60 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                        : isOwned
                        ? 'bg-stone-900/80 border-amber-600/60'
                        : 'bg-stone-950/80 border-amber-800/40'
                    }`}
                  >
                    <div>
                      {/* Outfit Header & Colors Badge */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="font-yatra text-base font-bold text-amber-200">
                            {outfit.name}
                          </div>
                          <div className="text-[11px] font-semibold text-amber-400/80">
                            {outfit.hindiName}
                          </div>
                        </div>
                        {/* Color swatches preview */}
                        <div className="flex -space-x-1">
                          <span
                            className="w-4 h-4 rounded-full border border-black shadow"
                            style={{ backgroundColor: outfit.colors.kurta }}
                            title="Kurta color"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black shadow"
                            style={{ backgroundColor: outfit.colors.turban }}
                            title="Turban color"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black shadow"
                            style={{ backgroundColor: outfit.colors.sash }}
                            title="Sash color"
                          />
                        </div>
                      </div>

                      <p className="text-xs text-amber-100/70 mb-2 leading-relaxed">
                        {outfit.description}
                      </p>
                      <div className="text-[10px] text-amber-300 bg-amber-950/80 border border-amber-600/40 rounded px-2 py-1 mb-3">
                        ✨ <span className="font-semibold">Perk:</span> {outfit.perk}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-amber-700/30">
                      <div className="text-xs font-bold">
                        {isOwned ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Owned
                          </span>
                        ) : (
                          <span className="text-yellow-400 font-yatra">
                            {outfit.price.toLocaleString()} ₹
                          </span>
                        )}
                      </div>

                      {isEquipped ? (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/60 rounded-lg text-xs font-bold">
                          Equipped
                        </span>
                      ) : isOwned ? (
                        <button
                          onClick={() => {
                            soundManager.playCoin();
                            onEquipOutfit(outfit.id);
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg text-xs font-bold transition"
                        >
                          Wear Outfit
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            soundManager.playCoin();
                            onPurchaseOutfit(outfit.id, outfit.price);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                            canAfford
                              ? 'bg-yellow-500 hover:bg-yellow-400 text-stone-950 shadow'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="w-3 h-3" /> Buy
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHOP_ITEMS.map((item) => {
                const canAfford = player.savings >= item.price;
                const isAlreadyHas =
                  (item.id === 'vayu_sash' && player.buffs.hasVayuSash) ||
                  (item.id === 'heavy_lathi' && player.buffs.hasHeavyLathi);

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-stone-950/80 border-2 border-amber-800/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-amber-900/60 text-yellow-400 border border-amber-600/40">
                            {item.icon === 'zap' && <Zap className="w-4 h-4" />}
                            {item.icon === 'sparkles' && <Sparkles className="w-4 h-4" />}
                            {item.icon === 'shield' && <Shield className="w-4 h-4" />}
                            {item.icon === 'sword' && <Sword className="w-4 h-4" />}
                            {item.icon === 'heart' && <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />}
                          </div>
                          <div>
                            <div className="font-yatra text-sm sm:text-base font-bold text-amber-200">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-semibold text-amber-400/80">
                              {item.hindiName}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-amber-100/70 my-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-amber-700/30">
                      <span className="font-yatra text-sm font-bold text-yellow-400">
                        {item.price.toLocaleString()} ₹
                      </span>

                      {isAlreadyHas ? (
                        <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-600 rounded-lg text-xs font-bold">
                          Active
                        </span>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            soundManager.playCoin();
                            onPurchaseItem(item.id, item.price);
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 shadow'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="w-3 h-3" /> Purchase
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-950/60 border-t border-amber-600/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-amber-900 hover:bg-amber-800 text-amber-200 rounded-xl font-bold text-xs border border-amber-600 transition"
          >
            Close Shop
          </button>
        </div>
      </div>
    </div>
  );
};
