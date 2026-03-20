import { create } from "zustand";
import type { Chant, ChantTarget } from "../data/chants";
import type { Weapon } from "../data/weapons";
import type { Move } from "../data/moves";
import { CHANTS } from "../data/chants";
import { WEAPONS } from "../data/weapons";
import { MOVES } from "../data/moves";

export type CeremonyStep =
  | "title"
  | "invite-gods"
  | "create-villain"
  | "battle"
  | "feed-tiger"
  | "dissolve"
  | "blessing"
  | "burn-offerings"
  | "divination"
  | "victory";

export type TearState = "clean" | "cornerTears" | "visibleRips" | "majorTears" | "nearlyDestroyed";

export function getTearState(hp: number, maxHp: number): TearState {
  const pct = (hp / maxHp) * 100;
  if (pct > 80) return "clean";
  if (pct > 60) return "cornerTears";
  if (pct > 40) return "visibleRips";
  if (pct > 20) return "majorTears";
  return "nearlyDestroyed";
}

export interface GameState {
  ceremonyStep: CeremonyStep;
  villainImageUri: string | null;
  villainName: string;
  customChants: string[];
  villainHp: number;
  villainMaxHp: number;
  grannyStamina: number;
  grannyMaxStamina: number;
  selectedChant: Chant;
  selectedWeapon: Weapon;
  selectedMove: Move;
  turn: number;
  chargeCount: number;
  tigerActive: boolean;
  tigerBonusDamage: number;
  dotDamage: number;
  defDebuff: number;
  isAnimating: boolean;
  lastDamage: number;
  lastCrit: boolean;

  // Actions
  setCeremonyStep: (step: CeremonyStep) => void;
  setVillainImage: (uri: string) => void;
  setVillainName: (name: string) => void;
  setCustomChants: (chants: string[]) => void;
  initVillain: () => void;
  selectChant: (id: ChantTarget) => void;
  selectWeapon: (id: string) => void;
  selectMove: (id: string) => void;
  performAttack: () => number;
  applyDot: () => void;
  triggerTiger: () => void;
  feedTiger: () => void;
  dismissTiger: () => void;
  consumeStamina: (amount: number) => boolean;
  regenStamina: () => void;
  setAnimating: (v: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  ceremonyStep: "title",
  villainImageUri: null,
  villainName: "",
  customChants: [],
  villainHp: 500,
  villainMaxHp: 500,
  grannyStamina: 100,
  grannyMaxStamina: 100,
  selectedChant: CHANTS[0],
  selectedWeapon: WEAPONS[0],
  selectedMove: MOVES[0],
  turn: 1,
  chargeCount: 0,
  tigerActive: false,
  tigerBonusDamage: 0,
  dotDamage: 0,
  defDebuff: 0,
  isAnimating: false,
  lastDamage: 0,
  lastCrit: false,

  setCeremonyStep: (step) => set({ ceremonyStep: step }),

  setVillainImage: (uri) => set({ villainImageUri: uri }),

  setVillainName: (name) => set({ villainName: name }),

  setCustomChants: (chants) => set({ customChants: chants }),

  initVillain: () => {
    const hp = Math.floor(Math.random() * 900) + 100; // 100-999
    set({ villainHp: hp, villainMaxHp: hp, turn: 1, chargeCount: 0, dotDamage: 0, defDebuff: 0, grannyStamina: 100 });
  },

  selectChant: (id) => {
    const chant = CHANTS.find((c) => c.id === id) ?? CHANTS[0];
    set({ selectedChant: chant });
  },

  selectWeapon: (id) => {
    const weapon = WEAPONS.find((w) => w.id === id) ?? WEAPONS[0];
    set({ selectedWeapon: weapon });
  },

  selectMove: (id) => {
    const move = MOVES.find((m) => m.id === id) ?? MOVES[0];
    set({ selectedMove: move });
  },

  performAttack: () => {
    const state = get();
    const { selectedChant, selectedWeapon, selectedMove, defDebuff, tigerBonusDamage } = state;

    // Check charge requirement
    if (selectedMove.chargeRequired > 0 && state.chargeCount < selectedMove.chargeRequired) {
      // Not enough charge, increment and do small damage
      set({ chargeCount: state.chargeCount + 1, lastDamage: 0, lastCrit: false });
      return 0;
    }

    const baseDamage = 30;
    let totalDamage = 0;
    let wasCrit = false;

    for (let i = 0; i < selectedMove.hits; i++) {
      let dmg = baseDamage * selectedWeapon.damageMultiplier * selectedMove.damageMultiplier;

      // Defense debuff bonus
      dmg *= 1 + defDebuff;

      // Attack up from chant
      dmg *= 1 + selectedChant.attackUp;

      // Tiger bonus
      dmg += tigerBonusDamage;

      // Newspaper multi-hit
      if (selectedWeapon.special === "multiHit") {
        dmg *= 0.5; // Already factored into hits but newspaper does 3 extra
      }

      // Critical hit
      const critChance = 0.1 + selectedChant.critBonus;
      if (Math.random() < critChance) {
        dmg *= 2;
        wasCrit = true;
      }

      // Variance ±20%
      dmg *= 0.8 + Math.random() * 0.4;
      totalDamage += Math.floor(dmg);
    }

    // Apply new debuffs from chant
    const newDefDebuff = defDebuff + selectedChant.defDebuff;
    const newDot = state.dotDamage + selectedChant.dot;

    const newHp = Math.max(0, state.villainHp - totalDamage);
    const resetCharge = selectedMove.chargeRequired > 0 ? 0 : state.chargeCount + 1;

    set({
      villainHp: newHp,
      turn: state.turn + 1,
      chargeCount: resetCharge,
      defDebuff: Math.min(newDefDebuff, 0.75),
      dotDamage: newDot,
      tigerBonusDamage: 0,
      lastDamage: totalDamage,
      lastCrit: wasCrit,
    });

    return totalDamage;
  },

  applyDot: () => {
    const state = get();
    if (state.dotDamage > 0) {
      const newHp = Math.max(0, state.villainHp - state.dotDamage);
      set({ villainHp: newHp });
    }
  },

  triggerTiger: () => set({ tigerActive: true, isAnimating: true }),

  feedTiger: () => set({ tigerBonusDamage: 50, tigerActive: false, isAnimating: false }),

  dismissTiger: () => set({ tigerActive: false, isAnimating: false }),

  consumeStamina: (amount) => {
    const { grannyStamina } = get();
    if (grannyStamina < amount) return false;
    set({ grannyStamina: grannyStamina - amount });
    return true;
  },

  regenStamina: () => {
    const { grannyStamina, grannyMaxStamina } = get();
    if (grannyStamina < grannyMaxStamina) {
      set({ grannyStamina: Math.min(grannyStamina + 5, grannyMaxStamina) });
    }
  },

  setAnimating: (v) => set({ isAnimating: v }),

  reset: () =>
    set({
      ceremonyStep: "title",
      villainImageUri: null,
      villainName: "",
      customChants: [],
      villainHp: 500,
      villainMaxHp: 500,
      grannyStamina: 100,
      grannyMaxStamina: 100,
      selectedChant: CHANTS[0],
      selectedWeapon: WEAPONS[0],
      selectedMove: MOVES[0],
      turn: 1,
      chargeCount: 0,
      tigerActive: false,
      tigerBonusDamage: 0,
      dotDamage: 0,
      defDebuff: 0,
      isAnimating: false,
      lastDamage: 0,
      lastCrit: false,
    }),
}));
