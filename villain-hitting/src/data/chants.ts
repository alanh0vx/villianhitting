export type ChantTarget =
  | "head"
  | "face"
  | "eyes"
  | "ears"
  | "mouth"
  | "belly"
  | "hands"
  | "feet";

export interface Chant {
  id: ChantTarget;
  i18nKey: string;
  effect: string;
  critBonus: number;
  defDebuff: number;
  accuracyDebuff: number;
  silence: boolean;
  attackUp: number;
  dot: number;
  disarm: boolean;
  slow: boolean;
}

export const CHANTS: Chant[] = [
  {
    id: "head",
    i18nKey: "chants.head",
    effect: "criticalHit",
    critBonus: 0.3,
    defDebuff: 0,
    accuracyDebuff: 0,
    silence: false,
    attackUp: 0,
    dot: 0,
    disarm: false,
    slow: false,
  },
  {
    id: "face",
    i18nKey: "chants.face",
    effect: "defenseDebuff",
    critBonus: 0,
    defDebuff: 0.25,
    accuracyDebuff: 0,
    silence: false,
    attackUp: 0,
    dot: 0,
    disarm: false,
    slow: false,
  },
  {
    id: "eyes",
    i18nKey: "chants.eyes",
    effect: "accuracyDebuff",
    critBonus: 0,
    defDebuff: 0,
    accuracyDebuff: 0.3,
    silence: false,
    attackUp: 0,
    dot: 0,
    disarm: false,
    slow: false,
  },
  {
    id: "ears",
    i18nKey: "chants.ears",
    effect: "silence",
    critBonus: 0,
    defDebuff: 0,
    accuracyDebuff: 0,
    silence: true,
    attackUp: 0,
    dot: 0,
    disarm: false,
    slow: false,
  },
  {
    id: "mouth",
    i18nKey: "chants.mouth",
    effect: "attackUp",
    critBonus: 0,
    defDebuff: 0,
    accuracyDebuff: 0,
    silence: false,
    attackUp: 0.25,
    dot: 0,
    disarm: false,
    slow: false,
  },
  {
    id: "belly",
    i18nKey: "chants.belly",
    effect: "dot",
    critBonus: 0,
    defDebuff: 0,
    accuracyDebuff: 0,
    silence: false,
    attackUp: 0,
    dot: 15,
    disarm: false,
    slow: false,
  },
  {
    id: "hands",
    i18nKey: "chants.hands",
    effect: "disarm",
    critBonus: 0,
    defDebuff: 0,
    accuracyDebuff: 0,
    silence: false,
    attackUp: 0,
    dot: 0,
    disarm: true,
    slow: false,
  },
  {
    id: "feet",
    i18nKey: "chants.feet",
    effect: "slow",
    critBonus: 0,
    defDebuff: 0,
    accuracyDebuff: 0,
    silence: false,
    attackUp: 0,
    dot: 0,
    disarm: false,
    slow: true,
  },
];
