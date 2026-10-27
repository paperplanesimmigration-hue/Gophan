#!/usr/bin/env bash
# ==============================================================================
# Raj's Ransom Run: Indian Cultural 2D Platformer - Android Play Store Release Builder
# Target: Google Play Developer Console (AAB / TWA / APK / Store Listing)
# ==============================================================================

set -e

echo "================================================================================"
echo "🇮🇳  RAJ'S RANSOM RUN: ANDROID GOOGLE PLAY STORE RELEASE PIPELINE"
echo "================================================================================"

# Step 1: Validate dependencies and icons
echo "Step 1: Generating standard Play Store launcher icons..."
node scripts/generate_pwa_icons.mjs

# Step 2: Validate Codebase & Lint
echo "Step 2: Checking TypeScript syntax and linting..."
npm run lint

# Step 3: Run Production Build
echo "Step 3: Compiling optimized production bundle with Vite PWA..."
npm run build

# Step 4: Create Android Play Store Release Distribution Directory
echo "Step 4: Assembling Play Store package directory..."
RELEASE_DIR="release-android-playstore"
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR/app-bundle"
mkdir -p "$RELEASE_DIR/store-listing"
mkdir -p "$RELEASE_DIR/digital-asset-links"

# Copy Web Assets
cp -r dist/* "$RELEASE_DIR/app-bundle/"

# Copy Digital Asset Links
cp public/.well-known/assetlinks.json "$RELEASE_DIR/digital-asset-links/"

# Copy TWA Manifest
cp twa-manifest.json "$RELEASE_DIR/"

# Copy Store Listing Assets
cp public/pwa-512x512.png "$RELEASE_DIR/store-listing/icon-512x512.png"
cp public/pwa-maskable-512x512.png "$RELEASE_DIR/store-listing/icon-maskable.png"
cp public/icon.svg "$RELEASE_DIR/store-listing/icon.svg"
if [ -f "public/playstore-feature-graphic.jpg" ]; then
  cp public/playstore-feature-graphic.jpg "$RELEASE_DIR/store-listing/feature-graphic-1024x500.jpg"
fi

# Copy Android Project files
mkdir -p "$RELEASE_DIR/android-project"
cp -r android/* "$RELEASE_DIR/android-project/"

# Generate Google Play Store Copy
cat << 'EOF' > "$RELEASE_DIR/store-listing/GOOGLE_PLAY_STORE_LISTING.txt"
================================================================================
GOOGLE PLAY STORE LISTING METADATA: RAJ'S RANSOM RUN
================================================================================

1. APP TITLE (Max 30 characters):
Raj's Ransom Run: 2D Platformer

2. SHORT DESCRIPTION (Max 80 characters):
Help Raj leap across Jaipur & Old Delhi to rescue Simran in an epic Indian run!

3. FULL DESCRIPTION (Up to 4000 characters):
🇮🇳 Experience the vibrant energy of India in "Raj's Ransom Run", an authentic 2D side-scrolling platformer video game set in the royal bazaars and courtyards of Jaipur and Old Delhi!

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
• 100% OFFLINE & PROGRESS SAVED: Automatically saves your rupees, unlocked outfits, and high scores.

🎮 CONTROLS:
• D-PAD (Left/Right): Run across rooftops
• BUTTON A: Jump / Vayu Double Jump
• BUTTON B: Lathi Staff Strike / Smash Matkas / Recover Stolen Funds
• KEY E / TOUCH: Enter Gilli-Danda Mini-Game or Gulab Chacha's Shop

Download now and begin your royal ransom adventure across the historic rooftops of India!
================================================================================
EOF

# Generate Privacy Policy for Play Store Developer Console
cat << 'EOF' > "$RELEASE_DIR/store-listing/PRIVACY_POLICY.md"
# Privacy Policy for Raj's Ransom Run

**Effective Date:** October 10, 2026

Raj's Ransom Run ("the Game") is developed as an offline-first single-player 2D platformer. We respect your privacy:

1. **No Personal Data Collection:** The Game does NOT collect, store, or transmit any personally identifiable information (PII), device identifiers, contact lists, or location data.
2. **Local Storage Only:** Game progression (Rupees saved, unlocked outfits, high scores) is stored locally on your device via standard browser localStorage. No data is sent to external tracking servers.
3. **No Third-Party Analytics / Ads:** The Game contains zero third-party telemetry, tracking SDKs, or targeted advertising networks.
4. **Permissions:** The Game requires network access strictly to load web assets and offline service worker caches. Vibration permission is used solely for tactile haptic feedback on touch controls.
5. **Contact:** For questions regarding privacy, contact support at: Navrishamgrewal@gmail.com
EOF

# Generate Play Store Release Instructions
cat << 'EOF' > "$RELEASE_DIR/PLAYSTORE_RELEASE_INSTRUCTIONS.md"
# 🚀 Google Play Store Release Guide: Raj's Ransom Run

This folder contains the complete, ready-to-upload package for the **Google Play Developer Console**.

## 1. Quick Build with Bubblewrap (Recommended TWA Method)
If using the official Google Bubblewrap CLI to generate your signed `.aab` (Android App Bundle):

```bash
# Install Bubblewrap CLI
npm install -g @bubblewrap/cli

# Initialize project from manifest
bubblewrap init --manifest=./twa-manifest.json

# Build the Android App Bundle (.aab)
bubblewrap build
```

This will produce `app-release-bundle.aab` ready for upload to Google Play!

## 2. Manual Android Studio Method
1. Open the `./android-project` folder in Android Studio.
2. Go to **Build** -> **Generate Signed Bundle / APK**.
3. Select **Android App Bundle (.aab)**.
4. Create or select your Release Keystore (e.g. `release-keystore.jks`).
5. Build the Release bundle.

## 3. Google Play Console Upload Steps
1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create app**:
   - App name: **Raj's Ransom Run: 2D Platformer**
   - Default language: **English (United States)** or **Hindi (India)**
   - App or game: **Game**
   - Free or paid: **Free**
3. In **Dashboard** -> **Set up your app**:
   - Copy and paste descriptions from `store-listing/GOOGLE_PLAY_STORE_LISTING.txt`.
   - Upload `store-listing/icon-512x512.png` as the **App Icon**.
   - Provide link to `store-listing/PRIVACY_POLICY.md`.
4. In **Release** -> **Production** (or **Closed Testing**):
   - Upload the generated `.aab` file.
   - Enter Release Name: `1.0.0 (Initial Release)`.
5. Review and roll out release to Google Play Store!
EOF

echo ""
echo "================================================================================"
echo "✅  GOOGLE PLAY STORE RELEASE PACKAGE READY!"
echo "Package directory: /release-android-playstore"
echo "Includes:"
echo "  • Store Listing Text (Title, Descriptions, Privacy Policy)"
echo "  • Hi-Res Play Store Icon (512x512) and Maskable Icon"
echo "  • Android TWA Project Files & AndroidManifest.xml"
echo "  • Digital Asset Links (assetlinks.json)"
echo "  • Complete Step-by-Step Google Play Console Guide"
echo "================================================================================"
