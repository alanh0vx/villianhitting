# CLAUDE.md

## Project Overview
打小人 (Villain Hitting) — A Hong Kong traditional folk ritual game built with Expo/React Native. User uploads a villain's photo (or uses a default sample), it gets pixelated into an 8-bit paper effigy, then a cute chibi granny beats it with a sandal following the traditional 8-step ceremony. Players can name their villain and add custom chants.

## Tech Stack
- **Framework**: Expo SDK 55 (managed workflow) — Web + iOS + Android
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Animation**: react-native-reanimated 4.x
- **State**: Zustand
- **i18n**: i18next + react-i18next (default: zh-HK Cantonese)
- **Image**: expo-image-picker, expo-asset
- **Dev Environment**: Docker (all deps run in container, no host installs needed)

## Development Commands
```bash
# Start dev server (runs inside Docker)
docker compose up

# Access the web app
# http://localhost:8081

# Run a one-off command in container
docker compose exec dev <command>

# Rebuild container (after Dockerfile changes)
docker compose up --build

# Export web build (inside container)
docker compose exec dev npx expo export --platform web

# Process sprites (remove checker BG, resize, save to assets)
docker compose exec dev python3 scripts/process-sprites.py
```

## Project Structure
```
villain-hitting/           # Expo app root
├── app/                   # Expo Router screens
│   ├── _layout.tsx        # Root layout (phone-width frame on desktop)
│   ├── index.tsx          # Title screen (with tutorial modal)
│   ├── ceremony/          # Pre/post battle ceremony screens
│   ├── battle/            # Main battle screen
│   └── victory/           # Victory screen
├── src/
│   ├── components/game/   # Battle components (HitterSprite, VillainEffigy, HPBar, etc.)
│   ├── components/ceremony/ # Ceremony animations
│   ├── components/ui/     # Reusable UI (PixelButton, PixelText, MenuPanel)
│   ├── engine/            # Game logic (GameState.ts, SpriteSheet.ts, DamageCalculator.ts)
│   ├── data/              # Static data (chants, weapons, moves, blessings)
│   ├── hooks/             # Custom hooks (useCeremonyGuard.ts)
│   ├── i18n/              # Translations (zh-HK default, en)
│   ├── utils/             # Helpers (pixelateImage.ts)
│   └── assets/sprites/    # Processed sprite sheets + sample-villain.jpg
├── scripts/               # Build scripts
├── docs/                  # Artwork prompts
images/                    # Raw Gemini-generated sprites (input)
Dockerfile                 # Node 20 slim + git
docker-compose.yml         # Dev service config
```

## Key Conventions
- Default locale is **zh-HK** (Cantonese). All UI text goes through i18next.
- Sprites are generated externally (Gemini) and processed via `scripts/process-sprites.py` which removes fake checker transparency and resizes to correct dimensions.
- Granny sprites are **empty-handed** — weapons are overlaid at runtime from `weapons-inhand.png`.
- Battle layout is **vertical** (traditional style): granny stands above, hitting DOWN at the paper effigy lying on the ground.
- The `SPRITES` object in `SpriteSheet.ts` uses `require()` for Metro bundler compatibility.
- Game state is managed with Zustand in `src/engine/GameState.ts`.
- On web desktop, the app is constrained to 430px max-width (phone portrait) and centered.
- Ceremony flow is enforced via `useCeremonyGuard` hook — direct URL navigation to later steps is blocked with an alert and redirect to title.
- Pre-battle ceremony (`invite-gods.tsx`) is a multi-phase screen showing ① Invite Gods → ② Declaration before upload.
- Post-battle ceremony flows automatically: Victory → ⑤ Dissolve → ⑥ Blessing → ⑦ Burn → ⑧ Divination → Complete.
- Battle chant selection uses a **dropdown** (not grid) to keep poem text readable.
- Villain face overlay on the paper effigy uses **percentage-based positioning** (`top/left/width/height` as %) inside the sprite container so it scales correctly at any size.
- Villain name is optional — defaults to "小人". Stored in Zustand, used in HP bar, victory screen, and i18n strings via `{{name}}` interpolation.
- Custom chants are stored in Zustand `customChants[]` and appear in the battle chant dropdown with a ★ prefix.
- A default sample villain image (`sample-villain.jpg`) is bundled and loaded via `expo-asset` when the user taps "Use default villain".
- Favicon is the 👵 granny emoji (Twemoji).
- Chant history marquee scrolls horizontally under the HP bar using Reanimated `withRepeat` + `withTiming`.
- Title screen includes a tutorial modal explaining the ceremony tradition and gameplay tips.

## Important Notes
- Do NOT install node dependencies on host — use Docker (`docker compose exec dev npm install <pkg>`)
- `react-native-worklets@0.7.x` must be used (not 0.8.x) for Reanimated 4.x compatibility
- Sprite sheets use overflow:hidden + image positioning for frame extraction (no Skia needed)
- The `images/` folder contains raw Gemini output; `src/assets/sprites/` contains processed game-ready assets
