# 打小人 Villain Hitting Game

<p align="center">
  <img src="images/scene-declare.png" alt="打小人 Villain Hitting" width="480" />
</p>

A Hong Kong traditional 打小人 (villain hitting) folk ritual game. Upload a villain's photo, watch it transform into a pixel-art paper effigy, then let a cute chibi granny beat it with a sandal through the full traditional ceremony!

## Features

- **Traditional 8-Step Ceremony** — Full guided flow, no skipping allowed!
  1. 請神 (Invite Deities) — Granny lights incense under 鵝頸橋
  2. 稟告 (Declaration) — Declare to heaven and earth, then upload villain photo → 8-bit pixel art effigy
  3. 打小人 (Hit Villain) — Core battle with chants, weapons & moves
  4. 祭白虎 (Feed White Tiger) — Random mid-battle bonus event
  5. 化解 (Dissolve Bad Luck) — Sweep away misfortune
  6. 祈福 (Blessing) — Fortune card reveal
  7. 進寶 (Burn Offerings) — Gold paper burning animation
  8. 擲筊 (Divination) — Toss blocks to complete ceremony

- **Battle System**
  - 8 traditional chants (打小人口訣) with unique combat effects
  - 5 weapons: 拖鞋, 木屐, 磚頭, 香爐, 報紙
  - 5 attack moves from basic slap to ultimate 神婆之怒
  - Paper tear states reflecting HP damage (5 levels)
  - Animated chibi granny with per-move sprite animations

- **Villain Photo Processing**
  - Face image validation
  - On-device 8-bit/16-bit pixel art conversion (Canvas-based)
  - Color quantization + pixel outline effect
  - Composited onto traditional paper effigy sprite

- **Desktop-Friendly**: Phone portrait layout (430px max-width) on desktop browsers
- **Route Protection**: Direct URL access to ceremony steps is blocked — ritual must be followed in order!
- **Bilingual**: 廣東話 (default) / English

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 55 (Web + iOS + Android) |
| Language | TypeScript |
| Navigation | Expo Router |
| Animation | react-native-reanimated 4.x |
| State | Zustand |
| i18n | i18next (zh-HK default) |
| Dev Environment | Docker |

## Quick Start

### Prerequisites
- Docker & Docker Compose

### Run
```bash
# Clone and start
git clone <repo-url>
cd villainhitting
docker compose up
```

Open **http://localhost:8081** in your browser.

### Development

```bash
# Install a new package
docker compose exec dev npx expo install <package-name>

# Export web build (served from root "/")
docker compose exec dev npx expo export --platform web

# Export for subfolder hosting (e.g. yoursite.com/villainhitting/)
# 1. Set experiments.baseUrl in villain-hitting/app.json:
#    "experiments": { "baseUrl": "/villainhitting" }
# 2. Export:
docker compose exec dev npx expo export --platform web
# 3. Copy villain-hitting/web-export/ contents to your subfolder
# Note: Reset baseUrl to "." when switching back to root hosting.

# Process raw sprites (after generating new artwork)
docker compose exec dev python3 scripts/process-sprites.py
```

No Node.js or other dependencies needed on your host machine — everything runs inside Docker.

## Sprite Artwork

All sprites use cute Japanese chibi 8-bit/16-bit pixel art style. See [`docs/artwork.md`](villain-hitting/docs/artwork.md) for the full set of Gemini generation prompts and slicing guide.

Raw sprites go in `images/` → processed by `scripts/process-sprites.py` → output to `src/assets/sprites/`.

The processing script handles:
- Removing fake checkered transparency backgrounds from Gemini output
- Resizing from oversized Gemini output to correct game dimensions
- Saving as proper transparent PNGs

## Project Structure

```
├── villain-hitting/          # Expo app
│   ├── app/                  # Screens (Expo Router)
│   │   ├── index.tsx         # Title screen
│   │   ├── ceremony/         # Ceremony flow screens
│   │   ├── battle/           # Battle screen
│   │   └── victory/          # Victory screen
│   ├── src/
│   │   ├── components/       # UI & game components
│   │   ├── engine/           # Game state, sprites, damage calc
│   │   ├── data/             # Chants, weapons, moves, blessings
│   │   ├── hooks/            # Custom hooks (ceremony guard)
│   │   ├── i18n/             # Translations
│   │   ├── utils/            # Image processing
│   │   └── assets/sprites/   # Processed sprite sheets
│   ├── scripts/              # Build tools
│   └── docs/                 # Artwork prompts
├── images/                   # Raw Gemini sprites
├── Dockerfile
└── docker-compose.yml
```

## Game Mechanics

### Chants (打小人口訣)
| Chant | Target | Effect |
|---|---|---|
| 打你個小人頭 | Head | Critical hit chance |
| 打你個小人面 | Face | Defense debuff |
| 打你個小人眼 | Eyes | Accuracy debuff |
| 打你個小人耳 | Ears | Silence |
| 打你個小人嘴 | Mouth | Attack power up |
| 打你個小人肚 | Belly | Damage over time |
| 打你個小人手 | Hands | Disarm |
| 打你個小人腳 | Feet | Slow |

### Weapons
| Weapon | Damage | Special |
|---|---|---|
| 拖鞋 (Sandal) | 1.0x | Default |
| 木屐 (Wooden Clog) | 1.3x | Slow chance |
| 磚頭 (Brick) | 1.5x | Stun chance |
| 香爐 (Incense Burner) | 0.8x | Burn DoT |
| 報紙 (Newspaper) | 0.6x | Multi-hit (3x) |

### Moves
| Move | Effect |
|---|---|
| 普通拍打 | Base damage |
| 連環鞋底 | 3 hits × 0.5x |
| 天降正義 | 2x damage |
| 旋風掃蕩 | 1.5x AoE |
| 必殺：神婆之怒 | 5x (requires charge) |

## License

MIT
