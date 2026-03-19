"""
Process sprites from Gemini output:
1. Remove fake checkered transparency background → real alpha
2. Resize to correct target dimensions
3. Copy to src/assets/sprites/
"""

from PIL import Image
import numpy as np
from collections import Counter
from scipy import ndimage
import os

INPUT_DIR = "/images"
OUTPUT_DIR = "/app/src/assets/sprites"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def detect_checker_size_and_colors(arr):
    """
    Detect checker square size and two colors from multiple edge samples.
    """
    rgb = arr[:, :, :3].astype(np.int16)
    h, w = rgb.shape[:2]

    # Try detecting from each corner
    corners = [
        (0, 0),                    # top-left
        (0, w - 100),              # top-right
        (h - 100, 0),              # bottom-left
        (h - 100, w - 100),       # bottom-right
    ]

    best_size = 1
    best_c1 = rgb[0, 0]
    best_c2 = rgb[0, 1]
    best_contrast = 0

    for sy, sx in corners:
        sy = max(0, sy)
        sx = max(0, sx)
        ey = min(sy + 100, h)
        ex = min(sx + 100, w)
        sample = rgb[sy:ey, sx:ex]
        sh, sw = sample.shape[:2]
        if sh < 10 or sw < 10:
            continue

        # Walk from (0,0) right until color changes significantly
        c0 = sample[0, 0]
        size = 1
        for x in range(1, min(60, sw)):
            diff = np.abs(sample[0, x].astype(int) - c0.astype(int)).sum()
            if diff > 15:
                size = x
                break

        if size < 2:
            continue

        # Gather the two colors
        c1_pixels = []
        c2_pixels = []
        limit = min(size * 6, sh, sw)
        for y in range(limit):
            for x in range(limit):
                cxi = x // size
                cyi = y // size
                if (cxi + cyi) % 2 == 0:
                    c1_pixels.append(sample[y, x])
                else:
                    c2_pixels.append(sample[y, x])

        if not c1_pixels or not c2_pixels:
            continue

        mc1 = np.median(c1_pixels, axis=0).astype(np.int16)
        mc2 = np.median(c2_pixels, axis=0).astype(np.int16)
        contrast = np.abs(mc1.astype(int) - mc2.astype(int)).sum()

        if contrast > best_contrast:
            best_contrast = contrast
            best_size = size
            best_c1 = mc1
            best_c2 = mc2

    return best_size, best_c1, best_c2


def remove_checker_bg(img, tolerance=45):
    """Remove checkered transparency background using checker detection + flood fill."""
    arr = np.array(img.convert("RGBA"))
    rgb = arr[:, :, :3].astype(np.int16)
    h, w = rgb.shape[:2]

    checker_size, c1, c2 = detect_checker_size_and_colors(arr)
    print(f" [checker={checker_size}px, c1={c1.tolist()}, c2={c2.tolist()}]", end="")

    # Build checker pattern mask (vectorized)
    ys = np.arange(h).reshape(-1, 1)
    xs = np.arange(w).reshape(1, -1)
    cy = ys // checker_size
    cx = xs // checker_size
    is_c1 = ((cx + cy) % 2 == 0)

    # Expected color per pixel based on checker position
    expected = np.where(is_c1[:, :, None], c1[None, None, :], c2[None, None, :])
    diff = np.abs(rgb - expected).sum(axis=2)
    is_bg_strict = diff < tolerance

    # Loose match: pixel close to either color regardless of position
    diff_c1 = np.abs(rgb - c1[None, None, :]).sum(axis=2)
    diff_c2 = np.abs(rgb - c2[None, None, :]).sum(axis=2)
    is_bg_loose = (diff_c1 < tolerance + 20) | (diff_c2 < tolerance + 20)

    # Combined
    is_bg_combined = is_bg_strict | is_bg_loose

    # For sprite sheets, the checker BG can be disconnected between frames.
    # Use a two-pass approach:
    # Pass 1: any pixel matching strict checker pattern with high confidence
    strict_bg = diff < (tolerance - 15)  # tighter match = definitely BG
    # Pass 2: flood fill from edges + strict seeds through the combined mask
    edge_mask = np.zeros((h, w), dtype=bool)
    edge_mask[:3, :] = True
    edge_mask[-3:, :] = True
    edge_mask[:, :3] = True
    edge_mask[:, -3:] = True

    seed = (edge_mask | strict_bg) & is_bg_combined

    labeled, num_labels = ndimage.label(is_bg_combined)
    seed_labels = set(labeled[seed].flatten()) - {0}

    final_bg = np.isin(labeled, list(seed_labels))

    # Create output
    result = arr.copy()
    result[:, :, 3] = 255
    result[final_bg, 3] = 0

    # Anti-alias: 1px semi-transparent ring around removed areas
    dilated = ndimage.binary_dilation(final_bg, iterations=1)
    edge_ring = dilated & ~final_bg
    result[edge_ring, 3] = np.minimum(result[edge_ring, 3], 180)

    transparent_pct = (final_bg.sum() / (h * w)) * 100
    print(f" [{transparent_pct:.0f}% bg]", end="")

    return Image.fromarray(result)


def process_sprite(filename, target_w, target_h, needs_transparency=True):
    """Load, remove BG if needed, resize to target."""
    path = os.path.join(INPUT_DIR, filename)
    if not os.path.exists(path):
        print(f"  SKIP: {filename} not found")
        return None

    img = Image.open(path).convert("RGBA")
    orig_w, orig_h = img.size
    print(f"  {filename}: {orig_w}x{orig_h} -> {target_w}x{target_h}", end="")

    if needs_transparency:
        img = remove_checker_bg(img)

    img = img.resize((target_w, target_h), Image.LANCZOS)
    print(" [resized] -> saved")

    out_path = os.path.join(OUTPUT_DIR, filename)
    img.save(out_path, "PNG")
    return img


# ============================================================
print("=" * 60)
print("Processing sprite sheets")
print("=" * 60)

GRANNY_SPRITES = {
    "granny-idle.png": (4, 64, 64),
    "granny-slap.png": (6, 64, 64),
    "granny-combo.png": (8, 64, 64),
    "granny-slam.png": (8, 64, 64),
    "granny-whirlwind.png": (8, 64, 64),
    "granny-victory.png": (6, 64, 64),
}

for filename, (frames, fw, fh) in GRANNY_SPRITES.items():
    process_sprite(filename, frames * fw, fh, needs_transparency=True)

print()
process_sprite("granny-ultimate.png", 6 * 64, 2 * 64, needs_transparency=True)

print("\nWeapons:")
process_sprite("weapons-icons.png", 5 * 32, 32, needs_transparency=True)
process_sprite("weapons-inhand.png", 5 * 32, 32, needs_transparency=True)

print("\nVillain effigy:")
process_sprite("villain-effigy.png", 5 * 64, 96, needs_transparency=True)

print("\nCeremony items:")
process_sprite("ceremony-items.png", 8 * 32, 32, needs_transparency=True)

print("\nHit effects:")
process_sprite("hit-effects.png", 6 * 32, 2 * 32, needs_transparency=True)

print("\nBackgrounds:")
process_sprite("bg-battle.png", 360, 640, needs_transparency=False)
process_sprite("bg-title.png", 360, 640, needs_transparency=False)

print("\nCutscene illustrations:")
for s in ["scene-invite.png", "scene-declare.png", "scene-tiger.png",
          "scene-dissolve.png", "scene-burn.png", "scene-divination.png"]:
    process_sprite(s, 320, 240, needs_transparency=False)

print("\n" + "=" * 60)
print("Done!")
print("=" * 60)

print("\nOutput files:")
for f in sorted(os.listdir(OUTPUT_DIR)):
    img = Image.open(os.path.join(OUTPUT_DIR, f))
    alpha = img.getchannel("A")
    mn, mx = alpha.getextrema()
    status = "TRANSPARENT" if mn < 255 else "opaque"
    print(f"  {f:30s} {img.size[0]:4d}x{img.size[1]:<4d} {status}")
