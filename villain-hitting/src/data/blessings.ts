export interface Blessing {
  id: string;
  i18nKey: string;
  emoji: string;
}

export const BLESSINGS: Blessing[] = [
  { id: "peace", i18nKey: "blessings.peace", emoji: "🙏" },
  { id: "wealth", i18nKey: "blessings.wealth", emoji: "💰" },
  { id: "health", i18nKey: "blessings.health", emoji: "💪" },
  { id: "love", i18nKey: "blessings.love", emoji: "❤️" },
  { id: "career", i18nKey: "blessings.career", emoji: "📈" },
  { id: "family", i18nKey: "blessings.family", emoji: "🏠" },
];
