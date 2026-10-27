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
