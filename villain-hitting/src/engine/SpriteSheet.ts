export interface SpriteSheetConfig {
  source: any; // require() result
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  frameCount: number;
  sheetWidth: number;
  sheetHeight: number;
}

export interface FrameRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getFrameRect(config: SpriteSheetConfig, frameIndex: number): FrameRect {
  const col = frameIndex % config.columns;
  const row = Math.floor(frameIndex / config.columns);
  return {
    x: col * config.frameWidth,
    y: row * config.frameHeight,
    width: config.frameWidth,
    height: config.frameHeight,
  };
}

export function getClipStyle(config: SpriteSheetConfig, frameIndex: number, scale: number = 1) {
  const frame = getFrameRect(config, frameIndex);
  const displayW = config.frameWidth * scale;
  const displayH = config.frameHeight * scale;
  return {
    container: {
      width: displayW,
      height: displayH,
      overflow: "hidden" as const,
    },
    image: {
      width: config.sheetWidth * scale,
      height: config.sheetHeight * scale,
      position: "absolute" as const,
      left: -frame.x * scale,
      top: -frame.y * scale,
    },
  };
}

export const SPRITES = {
  grannyIdle: {
    source: require("../assets/sprites/granny-idle.png"),
    frameWidth: 64, frameHeight: 64,
    columns: 4, rows: 1, frameCount: 4,
    sheetWidth: 256, sheetHeight: 64,
  } as SpriteSheetConfig,

  grannySlap: {
    source: require("../assets/sprites/granny-slap.png"),
    frameWidth: 64, frameHeight: 64,
    columns: 6, rows: 1, frameCount: 6,
    sheetWidth: 384, sheetHeight: 64,
  } as SpriteSheetConfig,

  grannyCombo: {
    source: require("../assets/sprites/granny-combo.png"),
    frameWidth: 64, frameHeight: 64,
    columns: 8, rows: 1, frameCount: 8,
    sheetWidth: 512, sheetHeight: 64,
  } as SpriteSheetConfig,

  grannySlam: {
    source: require("../assets/sprites/granny-slam.png"),
    frameWidth: 64, frameHeight: 64,
    columns: 8, rows: 1, frameCount: 8,
    sheetWidth: 512, sheetHeight: 64,
  } as SpriteSheetConfig,

  grannyWhirlwind: {
    source: require("../assets/sprites/granny-whirlwind.png"),
    frameWidth: 64, frameHeight: 64,
    columns: 8, rows: 1, frameCount: 8,
    sheetWidth: 512, sheetHeight: 64,
  } as SpriteSheetConfig,

  grannyUltimate: {
    source: require("../assets/sprites/granny-ultimate.png"),
    frameWidth: 64, frameHeight: 64,
    columns: 6, rows: 2, frameCount: 12,
    sheetWidth: 384, sheetHeight: 128,
  } as SpriteSheetConfig,

  grannyVictory: {
    source: require("../assets/sprites/granny-victory.png"),
    frameWidth: 64, frameHeight: 64,
    columns: 6, rows: 1, frameCount: 6,
    sheetWidth: 384, sheetHeight: 64,
  } as SpriteSheetConfig,

  weaponsIcons: {
    source: require("../assets/sprites/weapons-icons.png"),
    frameWidth: 32, frameHeight: 32,
    columns: 5, rows: 1, frameCount: 5,
    sheetWidth: 160, sheetHeight: 32,
  } as SpriteSheetConfig,

  weaponsInhand: {
    source: require("../assets/sprites/weapons-inhand.png"),
    frameWidth: 32, frameHeight: 32,
    columns: 5, rows: 1, frameCount: 5,
    sheetWidth: 160, sheetHeight: 32,
  } as SpriteSheetConfig,

  villainEffigy: {
    source: require("../assets/sprites/villain-effigy.png"),
    frameWidth: 64, frameHeight: 96,
    columns: 5, rows: 1, frameCount: 5,
    sheetWidth: 320, sheetHeight: 96,
  } as SpriteSheetConfig,

  ceremonyItems: {
    source: require("../assets/sprites/ceremony-items.png"),
    frameWidth: 32, frameHeight: 32,
    columns: 8, rows: 1, frameCount: 8,
    sheetWidth: 256, sheetHeight: 32,
  } as SpriteSheetConfig,

  hitEffects: {
    source: require("../assets/sprites/hit-effects.png"),
    frameWidth: 32, frameHeight: 32,
    columns: 6, rows: 2, frameCount: 12,
    sheetWidth: 192, sheetHeight: 64,
  } as SpriteSheetConfig,

  bgBattle: {
    source: require("../assets/sprites/bg-battle.png"),
    frameWidth: 360, frameHeight: 640,
    columns: 1, rows: 1, frameCount: 1,
    sheetWidth: 360, sheetHeight: 640,
  } as SpriteSheetConfig,

  bgTitle: {
    source: require("../assets/sprites/bg-title.png"),
    frameWidth: 360, frameHeight: 640,
    columns: 1, rows: 1, frameCount: 1,
    sheetWidth: 360, sheetHeight: 640,
  } as SpriteSheetConfig,

  sceneInvite: {
    source: require("../assets/sprites/scene-invite.png"),
    frameWidth: 320, frameHeight: 240,
    columns: 1, rows: 1, frameCount: 1,
    sheetWidth: 320, sheetHeight: 240,
  } as SpriteSheetConfig,

  sceneDeclare: {
    source: require("../assets/sprites/scene-declare.png"),
    frameWidth: 320, frameHeight: 240,
    columns: 1, rows: 1, frameCount: 1,
    sheetWidth: 320, sheetHeight: 240,
  } as SpriteSheetConfig,

  sceneTiger: {
    source: require("../assets/sprites/scene-tiger.png"),
    frameWidth: 320, frameHeight: 240,
    columns: 1, rows: 1, frameCount: 1,
    sheetWidth: 320, sheetHeight: 240,
  } as SpriteSheetConfig,

  sceneDissolve: {
    source: require("../assets/sprites/scene-dissolve.png"),
    frameWidth: 320, frameHeight: 240,
    columns: 1, rows: 1, frameCount: 1,
    sheetWidth: 320, sheetHeight: 240,
  } as SpriteSheetConfig,

  sceneBurn: {
    source: require("../assets/sprites/scene-burn.png"),
    frameWidth: 320, frameHeight: 240,
    columns: 1, rows: 1, frameCount: 1,
    sheetWidth: 320, sheetHeight: 240,
  } as SpriteSheetConfig,

  sceneDivination: {
    source: require("../assets/sprites/scene-divination.png"),
    frameWidth: 320, frameHeight: 240,
    columns: 1, rows: 1, frameCount: 1,
    sheetWidth: 320, sheetHeight: 240,
  } as SpriteSheetConfig,
};

// Weapon ID to sprite index mapping
export const WEAPON_SPRITE_INDEX: Record<string, number> = {
  sandal: 0,
  clog: 1,
  brick: 2,
  incenseBurner: 3,
  newspaper: 4,
};

// Move ID to granny sprite sheet mapping
export const MOVE_SPRITE_MAP: Record<string, SpriteSheetConfig> = {
  normalSlap: SPRITES.grannySlap,
  comboSole: SPRITES.grannyCombo,
  justiceFromAbove: SPRITES.grannySlam,
  whirlwindSweep: SPRITES.grannyWhirlwind,
  ultimate: SPRITES.grannyUltimate,
};
