import type { Chant } from "../data/chants";
import type { Weapon } from "../data/weapons";
import type { Move } from "../data/moves";

export interface DamageResult {
  totalDamage: number;
  hits: number[];
  isCrit: boolean;
  specialTriggered: string | null;
}

export function calculateDamage(
  chant: Chant,
  weapon: Weapon,
  move: Move,
  defDebuff: number,
  tigerBonus: number
): DamageResult {
  const baseDamage = 30;
  const hits: number[] = [];
  let isCrit = false;
  let specialTriggered: string | null = null;

  const hitCount =
    weapon.special === "multiHit" ? move.hits * 3 : move.hits;

  for (let i = 0; i < hitCount; i++) {
    let dmg = baseDamage * weapon.damageMultiplier * move.damageMultiplier;
    dmg *= 1 + defDebuff;
    dmg *= 1 + chant.attackUp;
    dmg += tigerBonus;

    const critChance = 0.1 + chant.critBonus;
    if (Math.random() < critChance) {
      dmg *= 2;
      isCrit = true;
    }

    dmg *= 0.8 + Math.random() * 0.4;
    hits.push(Math.floor(dmg));
  }

  // Check weapon special
  if (weapon.special && weapon.special !== "multiHit") {
    if (Math.random() < weapon.specialChance) {
      specialTriggered = weapon.special;
    }
  }

  return {
    totalDamage: hits.reduce((a, b) => a + b, 0),
    hits,
    isCrit,
    specialTriggered,
  };
}
