export interface Weapon {
  id: string;
  i18nKey: string;
  damageMultiplier: number;
  special: string | null;
  specialChance: number;
  emoji: string;
}

export const WEAPONS: Weapon[] = [
  {
    id: "sandal",
    i18nKey: "weapons.sandal",
    damageMultiplier: 1.0,
    special: null,
    specialChance: 0,
    emoji: "👡",
  },
  {
    id: "clog",
    i18nKey: "weapons.clog",
    damageMultiplier: 1.3,
    special: "slow",
    specialChance: 0.2,
    emoji: "🥿",
  },
  {
    id: "brick",
    i18nKey: "weapons.brick",
    damageMultiplier: 1.5,
    special: "stun",
    specialChance: 0.15,
    emoji: "🧱",
  },
  {
    id: "incenseBurner",
    i18nKey: "weapons.incenseBurner",
    damageMultiplier: 0.8,
    special: "burn",
    specialChance: 0.4,
    emoji: "🪔",
  },
  {
    id: "newspaper",
    i18nKey: "weapons.newspaper",
    damageMultiplier: 0.6,
    special: "multiHit",
    specialChance: 1.0,
    emoji: "📰",
  },
];
