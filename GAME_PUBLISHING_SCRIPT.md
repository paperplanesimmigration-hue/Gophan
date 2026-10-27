# 🇮🇳 Raj's Ransom Run: Game Publishing & Deployment Guide

Welcome to the official publishing manual for **Raj's Ransom Run: Indian Cultural 2D Platformer**. This document provides the complete deployment pipeline, store copy, store keywords, and build instructions for publishing across Android (Google Play Store), Progressive Web Apps (PWA), and Web Game portals (itch.io / CrazyGames).

---

## 🚀 Quick Publish Command

To build, type-check, package, and generate a clean release distribution:

```bash
chmod +x scripts/publish.sh
./scripts/publish.sh
```

Or run via npm:
```bash
npm run build
```

This compiles your optimized web bundle into `dist/` ready for web hosting or native mobile wrapping.

---

## 📱 Publishing to Android (Google Play Store)

### Option A: Direct Capacitor Packaging (Recommended for Native APK/AAB)
1. Install Capacitor in your project:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Raj's Ransom Run" "com.raj.ransomrun" --web-dir=dist
   ```
2. Build the project and add Android platform:
   ```bash
   npm run build
   npx cap add android
   npx cap sync
   ```
3. Open in Android Studio:
   ```bash
   npx cap open android
   ```
4. In Android Studio:
   - Select **Build > Generate Signed Bundle / APK**.
   - Create your keystore and choose **Android App Bundle (.aab)** for Google Play.
   - Upload the `.aab` to Google Play Console.

### Option B: Progressive Web App (PWA) / Trusted Web Activity (TWA)
- Wrap using Google's **Bubblewrap CLI**:
  ```bash
  npm i -g @bubblewrap/cli
  bubblewrap init --manifest=https://your-domain.com/manifest.json
  bubblewrap build
  ```

---

## 📝 Google Play Store Listing Copy

### App Title
**Raj's Ransom Run: 2D Indian Platformer** (30 characters)

### Short Description (80 chars)
Leap across vibrant bazaar rooftops, dodge pickpockets, and rescue Simran!

### Full Description
Step into the colorful, bustling streets of traditional India in **Raj's Ransom Run** — an authentic, action-packed 2D side-scrolling platformer!

Join Raj, a spirited young man in his vibrant festive kurta, as he embarks on an epic quest to free his beloved Simran from the clutches of the mythical Wealthy Dragon in the royal palace courtyards. But danger lurks around every carved sandstone pillar! Sneaky turbaned pickpockets are snatching rupees, shady merchants are setting traps, and losing your entire savings means Bankruptcy Game Over!

**KEY FEATURES:**
* **Bazaar Rooftop Heist**: Vault over tiered sandstone arches, smash ancient clay *matkas* for hidden treasures, and dodge cunning scammers.
* **Gilli-Danda Street Strike Mini-Game**: Play India's iconic street sport (गिल्ली डंडा)! Tip the wooden peg, master the pendulum strike swing, and watch the gilli ricochet off temple bells and royal havelis for massive rupee bounties.
* **Gulab Chacha's Royal Emporium**: Customize Raj with the Royal Maharaja Sherwani, Midnight Dacoit Rebel vest, and Diwali Festival Brocade, plus speed-boosting Kolhapuri Chappals and sacred anti-theft charms!
* **Epic Dragon Boss Showdown**: Face the jeweled Wealthy Dragon perched upon glittering mounds of gold coins. Choose your destiny: earn 50,000 ₹ to peacefully pay the ransom, or battle through fiery combat!
* **Authentic Indian Atmosphere**: Rich sunset skies with temple *shikharas*, fragrant marigold *torans*, clay *diyas*, and dynamic sitar & dhol soundscapes.
* **Dual Control Modes**: Translucent on-screen touch D-pad & action buttons tuned for mobile, plus full desktop keyboard arcade support.

---

## 🎯 Store Search Keywords (ASO / SEO)
`Indian platformer`, `desi game`, `gilli danda game`, `2d platformer android`, `bazaar run`, `raj ransom`, `traditional indian adventure`, `arcade side scroller`, `india mobile game`

---

## 💾 Save File Architecture
- **Storage**: Automatically synced to `localStorage['raj_ransom_run_save_v1']`.
- **Export / Import**: JSON export allows players to back up their high score, rupee savings, unlocked outfits, and quest state, or transfer saves between mobile devices and desktop.
