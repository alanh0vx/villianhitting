import { Platform } from "react-native";

export interface FaceValidation {
  valid: boolean;
  message: string;
}

export function validateFaceImage(width: number, height: number): FaceValidation {
  if (width < 100 || height < 100) {
    return { valid: false, message: "相片太細，最少要 100x100 像素" };
  }
  const ratio = width / height;
  if (ratio < 0.5 || ratio > 2.0) {
    return { valid: false, message: "請上傳正方形或接近正方形嘅相片" };
  }
  return { valid: true, message: "" };
}

/**
 * Pixelate an image to 8-bit/16-bit style.
 * On web: uses Canvas. On native: returns original URI.
 */
export async function pixelateImage(uri: string): Promise<string> {
  if (Platform.OS !== "web") {
    return uri;
  }

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const PIXEL_SIZE = 32;
        const OUTPUT_SIZE = 128;

        // Step 1: Draw original onto tiny canvas (pixelation)
        const tinyCanvas = document.createElement("canvas");
        tinyCanvas.width = PIXEL_SIZE;
        tinyCanvas.height = PIXEL_SIZE;
        const tinyCtx = tinyCanvas.getContext("2d")!;
        tinyCtx.imageSmoothingEnabled = false;
        tinyCtx.drawImage(img, 0, 0, PIXEL_SIZE, PIXEL_SIZE);

        // Step 2: Color quantization — reduce to ~16 colors
        const imageData = tinyCtx.getImageData(0, 0, PIXEL_SIZE, PIXEL_SIZE);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // Quantize each channel to 4 levels (64 total colors, looks ~16-bit)
          data[i] = Math.round(data[i] / 64) * 64;       // R
          data[i + 1] = Math.round(data[i + 1] / 64) * 64; // G
          data[i + 2] = Math.round(data[i + 2] / 64) * 64; // B
        }
        tinyCtx.putImageData(imageData, 0, 0);

        // Step 3: Scale up with nearest-neighbor
        const outCanvas = document.createElement("canvas");
        outCanvas.width = OUTPUT_SIZE;
        outCanvas.height = OUTPUT_SIZE;
        const outCtx = outCanvas.getContext("2d")!;
        outCtx.imageSmoothingEnabled = false;
        outCtx.drawImage(tinyCanvas, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

        // Step 4: Add black outline (edge detection)
        const outData = outCtx.getImageData(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
        const pixels = outData.data;
        const outlineData = new Uint8ClampedArray(pixels);
        const blockSize = OUTPUT_SIZE / PIXEL_SIZE;

        for (let by = 0; by < PIXEL_SIZE; by++) {
          for (let bx = 0; bx < PIXEL_SIZE; bx++) {
            const idx = (by * PIXEL_SIZE + bx) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];

            // Check if this block differs from right or bottom neighbor
            let isEdge = false;
            if (bx < PIXEL_SIZE - 1) {
              const nIdx = (by * PIXEL_SIZE + bx + 1) * 4;
              const dr = Math.abs(r - data[nIdx]) + Math.abs(g - data[nIdx + 1]) + Math.abs(b - data[nIdx + 2]);
              if (dr > 80) isEdge = true;
            }
            if (by < PIXEL_SIZE - 1) {
              const nIdx = ((by + 1) * PIXEL_SIZE + bx) * 4;
              const dr = Math.abs(r - data[nIdx]) + Math.abs(g - data[nIdx + 1]) + Math.abs(b - data[nIdx + 2]);
              if (dr > 80) isEdge = true;
            }

            if (isEdge) {
              // Draw black outline on right/bottom edge of this block
              const px = bx * blockSize;
              const py = by * blockSize;
              for (let d = 0; d < blockSize; d++) {
                // Right edge
                const ri = ((py + d) * OUTPUT_SIZE + px + blockSize - 1) * 4;
                outlineData[ri] = 0; outlineData[ri + 1] = 0; outlineData[ri + 2] = 0;
                // Bottom edge
                const bi = ((py + blockSize - 1) * OUTPUT_SIZE + px + d) * 4;
                outlineData[bi] = 0; outlineData[bi + 1] = 0; outlineData[bi + 2] = 0;
              }
            }
          }
        }

        // Apply outline
        for (let i = 0; i < pixels.length; i++) {
          if (outlineData[i] === 0 && i % 4 !== 3) {
            pixels[i] = outlineData[i];
          }
        }
        outCtx.putImageData(outData, 0, 0);

        resolve(outCanvas.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = uri;
  });
}
