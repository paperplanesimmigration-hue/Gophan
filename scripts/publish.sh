#!/usr/bin/env bash
# ==============================================================================
# Raj's Ransom Run: Indian Cultural 2D Platformer - Automated Game Publishing Script
# Target Platforms: Web, Mobile PWA, Capacitor Android APK, itch.io, Google Play Store
# ==============================================================================

set -e

echo "=========================================================="
echo "🇮🇳  RAJ'S RANSOM RUN: INDIAN 2D PLATFORMER RELEASE PIPELINE"
echo "=========================================================="
echo "Step 1: Validating environment and build dependencies..."

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node version: $NODE_VERSION"

# Step 2: Lint and Type Check
echo ""
echo "Step 2: Running TypeScript compile validation..."
npm run lint

# Step 3: Clean previous builds
echo ""
echo "Step 3: Cleaning release artifacts directory..."
rm -rf dist release-package
mkdir -p release-package

# Step 4: Execute production bundle
echo ""
echo "Step 4: Compiling production assets with Vite..."
npm run build

# Step 5: Verify build outputs
if [ -d "dist" ]; then
  echo "✓ Web build succeeded! Copying to release package..."
  cp -r dist/* release-package/
else
  echo "❌ Error: dist folder not created!"
  exit 1
fi

# Step 6: Generate Release Manifest & Metadata
echo ""
echo "Step 6: Packaging Android/PWA Game Metadata..."

cat << 'EOF' > release-package/app-manifest.json
{
  "name": "Raj's Ransom Run: Indian Cultural 2D Platformer",
  "short_name": "Raj's Ransom",
  "version": "1.0.0",
  "theme_color": "#b45309",
  "background_color": "#451a03",
  "display": "standalone",
  "orientation": "landscape",
  "description": "Help Raj leap across Old Delhi and Jaipur rooftops to rescue Simran from the Wealthy Dragon! Featuring authentic Gilli-Danda street mini-games, Gulab Chacha's bazaar emporium, and scammer avoidance platforming."
}
EOF

cat << 'EOF' > release-package/RELEASE_NOTES.txt
=== RAJ'S RANSOM RUN - VERSION 1.0.0 RELEASE NOTES ===
* Stage 1: The Old Delhi Bazaar Heist featuring tricky pickpockets, rooftop chases, and smashable matkas.
* Stage 2: The Wealthy Dragon Boss Courtyard & Simran's Royal Golden Cage (Collect 50,000 ₹ or defeat the dragon!).
* Traditional Indian Street Sport Mini-Game: Gilli-Danda Street Strike (गिल्ली डंडा) with rooftop trajectory multipliers.
* Gulab Chacha's Royal Emporium: 4 authentic outfits (Maharaja Sherwani, Dacoit, Diwali Brocade) and speed/jump powerups.
* Full Android Touch D-Pad & Action buttons + Responsive Desktop Arcade controls.
* Complete local persistent save system & JSON export.
EOF

echo ""
echo "=========================================================="
echo "✅  RELEASE BUILD COMPLETE!"
echo "Distribution directory ready at: /release-package"
echo "Total asset size: $(du -sh release-package | cut -f1)"
echo "To preview production build locally: npm run preview"
echo "=========================================================="
