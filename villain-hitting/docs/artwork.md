# 打小人 Artwork Generation Prompts

All sprites use **cute Japanese chibi 8-bit/16-bit pixel art style** with transparent backgrounds.
Generate in **Gemini Imagen** or similar AI image tool.

> **Important**: Granny is always **empty-handed** in all animations. The weapon is a separate sprite layer composited onto her hand at runtime based on user selection.

---

## 1. Granny Idle Sprite Sheet

```
Create a pixel art sprite sheet of a cute chibi elderly Hong Kong granny character (神婆).
4 frames in a single horizontal row, each frame 64x64 pixels (total image: 256x64).
Idle breathing animation cycle.
She has grey hair in a bun, round friendly face with rosy cheeks, wearing a purple traditional Chinese top (唐裝) and dark pants.
Her right hand is open and empty, resting at her side (weapon will be added separately as a game overlay).
8-bit/16-bit retro game style, clean pixel edges, transparent background.
The 4 frames show subtle breathing: normal → slight rise → peak → back down.
```

## 2. Granny Normal Slap Animation

```
Create a pixel art sprite sheet of a cute chibi elderly Hong Kong granny (神婆) doing a downward slap attack motion with her EMPTY right hand.
6 frames in a single horizontal row, each frame 64x64 pixels (total image: 384x64).
Animation sequence: wind up with arm back → arm raised high → swing forward and down → hand at impact point (open palm down) → follow through → return to idle.
Her right hand is EMPTY throughout — no weapon, no object. Just her bare hand swinging down in a slapping motion.
The weapon sprite will be composited on top of her hand separately in the game engine.
Grey hair bun, rosy cheeks, purple Chinese top, dark pants. 8-bit/16-bit retro game style, transparent background.
```

## 3. Granny Combo Slap Animation

```
Create a pixel art sprite sheet of a cute chibi elderly Hong Kong granny (神婆) doing a rapid triple slap combo with her EMPTY right hand.
8 frames in a single horizontal row, each frame 64x64 pixels (total image: 512x64).
Animation: wind up → slap right → recover → slap left → recover → slap right → wind down → return to idle.
Rapid swinging motion with her bare open hand. Speed lines on impact frames.
Her hand is EMPTY in all frames — no weapon. The weapon is overlaid separately by the game.
Grey hair bun, rosy cheeks, purple Chinese top. 8-bit/16-bit retro pixel art style, transparent background.
```

## 4. Granny Overhead Slam Animation

```
Create a pixel art sprite sheet of a cute chibi elderly Hong Kong granny (神婆) doing a jumping overhead slam attack with her EMPTY right hand.
8 frames in a single horizontal row, each frame 64x64 pixels (total image: 512x64).
Animation: crouch → jump up → both hands raised high overhead → slam down with right fist → impact pose with small shockwave lines → bounce up slightly → land → return to idle.
Her hands are EMPTY — no weapon held. The weapon is a separate layer added by the game engine.
Exaggerated chibi proportions. Grey hair bun, rosy cheeks, purple Chinese top.
8-bit/16-bit retro pixel art style, transparent background.
```

## 5. Granny Whirlwind Spin Animation

```
Create a pixel art sprite sheet of a cute chibi elderly Hong Kong granny (神婆) doing a 360-degree spinning whirlwind attack with her EMPTY right arm extended.
8 frames in a single horizontal row, each frame 64x64 pixels (total image: 512x64).
Animation: wind up → spin 90° → spin 180° → spin 270° → full 360° → second rotation → slow down → stop.
Right arm extended outward during spin, hand open and EMPTY. Circular motion lines around her.
The weapon is added as a separate overlay by the game engine.
Grey hair bun, rosy cheeks, purple Chinese top. 8-bit/16-bit retro pixel art style, transparent background.
```

## 6. Granny Ultimate Attack Animation

```
Create a pixel art sprite sheet of a cute chibi elderly Hong Kong granny (神婆) performing her ultimate attack "神婆之怒" (Granny's Wrath) with EMPTY hands.
12 frames in 2 horizontal rows (6 per row), each frame 64x64 pixels (total image: 384x128).
Row 1 (charge up): glowing golden aura appears → energy gathering around body → eyes glowing white → power stance with fists clenched → chi energy visible as golden sparks → ready pose, both fists raised.
Row 2 (attack barrage): leap forward → rapid right-hand strikes (empty hand) → multi-hit pose with star impacts → explosive finish with big golden burst → dust cloud settling → victory pose standing tall.
Hands are EMPTY throughout — weapon overlay is handled by the game engine.
Golden/yellow energy aura effect. Grey hair bun, rosy cheeks, purple Chinese top.
8-bit/16-bit retro pixel art style, transparent background.
```

## 7. Granny Victory Celebration

```
Create a pixel art sprite sheet of a cute chibi elderly Hong Kong granny (神婆) celebrating victory with EMPTY hands.
6 frames in a single horizontal row, each frame 64x64 pixels (total image: 384x64).
Animation: surprised joy (mouth open) → jump for joy (feet off ground) → clap both hands together → raise both fists triumphantly → big smile pose with ^_^ eyes and peace sign → peaceful satisfied pose with hands on hips.
Hands are EMPTY — no weapon. Weapon overlay handled separately.
Happy expressions throughout. Grey hair bun, rosy cheeks, purple Chinese top.
8-bit/16-bit retro pixel art style, transparent background.
```

---

## 8. Weapons Sprite Sheet — Static Icons (for UI selection)

```
Create a pixel art sprite sheet of 5 weapon icons used in Hong Kong villain hitting ritual (打小人).
5 items in a single horizontal row, each item 32x32 pixels (total image: 160x32).
From left to right:
1. 拖鞋 (pink/red rubber sandal/slipper) — the classic default weapon, flip-flop style
2. 木屐 (brown wooden clog) — traditional carved wooden shoe with raised base
3. 磚頭 (grey/red brick) — a rectangular building brick
4. 香爐 (bronze/gold incense burner) — small round ceremonial burner with decorative handles
5. 報紙 (white/grey rolled-up newspaper) — tightly rolled newspaper tube

Each item drawn as a cute game icon, front-facing. 8-bit/16-bit retro pixel art style, transparent background.
```

## 8b. Weapons In-Hand Sprite Sheet — Angled for Attack Overlay

```
Create a pixel art sprite sheet of 5 weapons held at an angle, as if gripped in a hand swinging downward.
5 items in a single horizontal row, each item 32x32 pixels (total image: 160x32).
Each weapon is drawn at a ~45 degree angle (top-left to bottom-right), as if being swung down to strike.
The grip/handle end is at the top-left, the striking end is at the bottom-right.
From left to right:
1. 拖鞋 (pink/red rubber sandal) — sole facing outward for slapping
2. 木屐 (brown wooden clog) — heavy base facing down
3. 磚頭 (grey/red brick) — angled for smashing
4. 香爐 (bronze/gold incense burner) — swung by the rim
5. 報紙 (rolled-up newspaper) — tube angled for whacking

These will be composited on top of the granny's empty hand during attack animations.
8-bit/16-bit retro pixel art style, transparent background.
```

---

## 9. Paper Villain Effigy — 5 Tear States

```
Create a pixel art sprite sheet showing 5 states of a traditional Hong Kong paper villain effigy (小人紙) being progressively destroyed.
5 frames in a single horizontal row, each frame 64x96 pixels (total image: 320x96).
The effigy is a simple paper cutout figure on yellowish/tan rice paper with a red "小人" label banner at the top, and a simple stick-figure body drawn in brown/black ink lines.
A blank square area (about 24x24 pixels) centered on the head area where the villain's photo will be composited by the game.

States from left to right:
1. Clean — perfect pristine paper, sharp edges, no damage at all
2. Corner tears — small triangular tears on top-right and bottom-left corners, paper slightly yellowed
3. Visible rips — horizontal rip across the middle body, more corner damage, some creases
4. Major tears — large chunks torn off edges, paper very crumpled, shoe print marks, big diagonal rip
5. Nearly destroyed — barely held together, only center fragment remains, edges are ragged tatters, almost unrecognizable

Traditional Chinese joss paper craft look. 8-bit/16-bit retro pixel art style, transparent background.
```

## 10. Background — 鵝頸橋 Battle Scene (Canal Road Flyover)

```
Create a pixel art background scene of the underside of Canal Road Flyover (鵝頸橋) in Wan Chai, Hong Kong — the famous villain hitting spot.
Single image, 360x640 pixels (portrait mobile game orientation).

Scene composition (top to bottom):
- Top: concrete overpass/flyover beams and pillars, grey with weathering
- Middle: the ritual area underneath, dimly lit
  - A low wooden stool on the left (where granny sits)
  - A small ground-level shrine/altar in the center-back with:
    - Red altar cloth
    - Incense pot with 3 burning sticks (orange glow)
    - Two red candles flanking the pot
    - Small offerings arranged around
  - Paper talismans/符 hanging from strings above
- Bottom: concrete ground with scattered joss paper and peanut shells

Lighting: warm orange/amber glow from candles and incense in the center, fading to cool dark blue/grey at the edges. Atmospheric and moody but inviting, not scary.

8-bit/16-bit retro pixel art style, rich color palette, detailed. NOT transparent — full solid background.
```

## 10b. Background — Title Screen

```
Create a pixel art background for a mobile game title screen, 360x640 pixels (portrait).
Scene shows a wide view of the Canal Road Flyover (鵝頸橋) area in Wan Chai, Hong Kong at dusk/evening.
The flyover bridge is prominent across the upper portion.
Below the bridge, warm golden light spills out from the villain-hitting shrine area.
City buildings and neon signs visible in the background (purple, pink, blue neon glow).
A few wisps of incense smoke rising from under the bridge.
Moody Hong Kong evening atmosphere — mix of traditional and urban.
Bottom area is darker (UI elements will overlay here).
8-bit/16-bit retro pixel art style, rich colors. NOT transparent — full solid background.
```

## 11. Ceremony Items Sprite Sheet

```
Create a pixel art sprite sheet of 8 ceremonial items used in Hong Kong villain hitting ritual (打小人).
8 items in a single horizontal row, each item 32x32 pixels (total image: 256x32).
From left to right:
1. 香 (incense sticks) — 3 thin red sticks with glowing orange tips, small grey smoke wisps curling up
2. 蠟燭 (candle) — red traditional Chinese candle on a small gold holder, bright yellow flame
3. 白虎紙 (white tiger paper) — paper cutout of a fierce white tiger with open jaws, yellow eyes, on yellow paper
4. 生豬肉 (raw pork) — a small slab of raw pork with visible fat marbling, pink and white
5. 金元寶 (gold ingot) — traditional boat/sycee-shaped gold paper ingot, shiny metallic gold with red trim
6. 貴人紙 (noble person paper) — a paper figure like the effigy but in auspicious red and gold colors, smiling face
7. 筊杯 (divination blocks) — a pair of crescent/moon-shaped red wooden blocks side by side
8. 花生 (peanuts) — a small pile of 4-5 unshelled brown peanuts with visible shell texture

Each item as a cute detailed game icon. 8-bit/16-bit retro pixel art style, transparent background.
```

## 12. Hit Effects Sprite Sheet

```
Create a pixel art sprite sheet of hit/impact effects for a retro beat-em-up game.
Two rows:

Row 1: Impact burst animation — 6 frames, each 32x32 pixels (total row: 192x32).
  Classic manga-style impact starburst, yellow/white/orange colors.
  Frame sequence: tiny spark dot → small expanding star → medium burst with 4 rays → peak burst with 8 rays and speed lines → fading burst with scattered dots → empty/gone.

Row 2: Paper tear particles — 6 different torn paper fragment variations, each 32x32 pixels (total row: 192x32).
  Torn rice paper fragments in tan/cream/yellowish colors with ragged edges.
  Each is a uniquely shaped torn piece — triangular, rectangular, curved, crumpled, folded, shredded strip.
  These fly off the villain effigy when it gets hit.

Total image: 192x64 pixels. 8-bit/16-bit retro pixel art style, transparent background.
```

## 13. Ceremony Cutscene Illustrations

> These are single static illustrations shown during the ceremony 過場 screens (before and after battle). Larger images for visual storytelling.

### 13a. 請神 (Invite Deities) Scene

```
Create a pixel art illustration for a game cutscene, 320x240 pixels.
Scene: A cute chibi granny (神婆) kneeling on a small stool under a concrete flyover at night.
She is lighting 3 incense sticks from a red candle. Smoke wisps rising up.
A small altar in front of her with offerings: fruit, candles, incense pot.
Warm amber candlelight illuminates her face. Dark moody atmosphere around.
She has grey hair bun, rosy cheeks, purple Chinese top.
Serene, respectful mood. 8-bit/16-bit retro pixel art style, full background (not transparent).
```

### 13b. 稟告 (Declaration) Scene

```
Create a pixel art illustration for a game cutscene, 320x240 pixels.
Scene: The same cute chibi granny (神婆) holding up a paper effigy (小人紙) — a yellowish paper cutout with a blank face area.
She is presenting it to the altar/shrine, declaring the villain to the gods.
Red candles flickering on both sides. Incense smoke in the air.
The paper effigy is prominent and centered. A mystical golden glow around the effigy.
Grey hair bun, rosy cheeks, purple Chinese top.
Dramatic, ceremonial mood. 8-bit/16-bit retro pixel art style, full background.
```

### 13c. 祭白虎 (Feed White Tiger) Scene

```
Create a pixel art illustration for a game cutscene, 320x240 pixels.
Scene: The cute chibi granny (神婆) is feeding a piece of raw pork to a large paper white tiger cutout (白虎紙).
The paper tiger is propped up against the altar, mouth open wide with painted fangs.
The granny is smearing the pork fat on the tiger's mouth with a determined expression.
Incense smoke in background. Candlelight.
Grey hair bun, rosy cheeks, purple Chinese top.
Slightly humorous, traditional mood. 8-bit/16-bit retro pixel art style, full background.
```

### 13d. 化解 (Dissolve Bad Luck) Scene

```
Create a pixel art illustration for a game cutscene, 320x240 pixels.
Scene: The cute chibi granny (神婆) sweeping scattered peanut shells, sesame seeds, and torn paper bits on the ground with a small broom.
The defeated villain effigy (badly torn paper) lies crumpled on the ground.
Particles and debris scattering as she sweeps. A sense of cleansing.
Grey hair bun, rosy cheeks, purple Chinese top. Satisfied expression.
Clean, purifying mood with warm lighting. 8-bit/16-bit retro pixel art style, full background.
```

### 13e. 進寶 (Burn Offerings) Scene

```
Create a pixel art illustration for a game cutscene, 320x240 pixels.
Scene: The cute chibi granny (神婆) tossing gold paper ingots (金元寶) and joss paper into a small metal burn barrel/bin.
Bright orange and red flames rising from the barrel. Gold paper pieces mid-air.
Smoke rising upward into the dark flyover ceiling.
Sparks and embers floating around. The granny has a thankful, peaceful expression.
Grey hair bun, rosy cheeks, purple Chinese top.
Warm, sacred mood. 8-bit/16-bit retro pixel art style, full background.
```

### 13f. 擲筊 (Divination) Scene

```
Create a pixel art illustration for a game cutscene, 320x240 pixels.
Scene: The cute chibi granny (神婆) tossing two crescent-shaped wooden divination blocks (筊杯) into the air.
The blocks are mid-air, spinning. A golden divine light beams down from above.
She is kneeling with hands together in prayer, looking up expectantly.
The altar with incense and candles visible behind her.
Grey hair bun, rosy cheeks, purple Chinese top.
Suspenseful, hopeful mood. 8-bit/16-bit retro pixel art style, full background.
```

---

## Sprite Slicing Guide

After generating, save all images to `src/assets/sprites/` with these filenames:

| # | Filename | Size | Frames | Notes |
|---|---|---|---|---|
| 1 | `granny-idle.png` | 256×64 | 4 × 64×64 | Empty-handed |
| 2 | `granny-slap.png` | 384×64 | 6 × 64×64 | Empty-handed |
| 3 | `granny-combo.png` | 512×64 | 8 × 64×64 | Empty-handed |
| 4 | `granny-slam.png` | 512×64 | 8 × 64×64 | Empty-handed |
| 5 | `granny-whirlwind.png` | 512×64 | 8 × 64×64 | Empty-handed |
| 6 | `granny-ultimate.png` | 384×128 | 12 × 64×64 (2 rows) | Empty-handed |
| 7 | `granny-victory.png` | 384×64 | 6 × 64×64 | Empty-handed |
| 8a | `weapons-icons.png` | 160×32 | 5 × 32×32 | Front-facing for UI |
| 8b | `weapons-inhand.png` | 160×32 | 5 × 32×32 | Angled 45° for overlay |
| 9 | `villain-effigy.png` | 320×96 | 5 × 64×96 | Has blank face area |
| 10a | `bg-battle.png` | 360×640 | 1 (full image) | Battle background |
| 10b | `bg-title.png` | 360×640 | 1 (full image) | Title screen background |
| 11 | `ceremony-items.png` | 256×32 | 8 × 32×32 | — |
| 12 | `hit-effects.png` | 192×64 | 2 rows × 6 × 32×32 | — |
| 13a | `scene-invite.png` | 320×240 | 1 | 請神 cutscene |
| 13b | `scene-declare.png` | 320×240 | 1 | 稟告 cutscene |
| 13c | `scene-tiger.png` | 320×240 | 1 | 祭白虎 cutscene |
| 13d | `scene-dissolve.png` | 320×240 | 1 | 化解 cutscene |
| 13e | `scene-burn.png` | 320×240 | 1 | 進寶 cutscene |
| 13f | `scene-divination.png` | 320×240 | 1 | 擲筊 cutscene |

**Total: 19 images to generate.**

Once sprites are saved, I can help build the `SpriteSheet.ts` loader and weapon overlay system to composite the selected weapon onto granny's hand at runtime.
