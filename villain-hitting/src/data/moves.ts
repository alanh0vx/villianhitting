export interface Move {
  id: string;
  i18nKey: string;
  damageMultiplier: number;
  hits: number;
  slow: boolean;
  chargeRequired: number;
  description: string;
}

export const MOVES: Move[] = [
  {
    id: "normalSlap",
    i18nKey: "moves.normalSlap",
    damageMultiplier: 1.0,
    hits: 1,
    slow: false,
    chargeRequired: 0,
    description: "基本攻擊",
  },
  {
    id: "comboSole",
    i18nKey: "moves.comboSole",
    damageMultiplier: 0.5,
    hits: 3,
    slow: false,
    chargeRequired: 0,
    description: "三連擊",
  },
  {
    id: "justiceFromAbove",
    i18nKey: "moves.justiceFromAbove",
    damageMultiplier: 2.0,
    hits: 1,
    slow: true,
    chargeRequired: 0,
    description: "跳起重擊",
  },
  {
    id: "whirlwindSweep",
    i18nKey: "moves.whirlwindSweep",
    damageMultiplier: 1.5,
    hits: 1,
    slow: false,
    chargeRequired: 0,
    description: "360度掃蕩",
  },
  {
    id: "ultimate",
    i18nKey: "moves.ultimate",
    damageMultiplier: 5.0,
    hits: 1,
    slow: false,
    chargeRequired: 3,
    description: "蓄力必殺技",
  },
];
