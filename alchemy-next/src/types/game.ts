export type AlchemistType = 'naturalist' | 'craftsman' | 'philosopher';

export interface Alchemist {
  id: AlchemistType;
  name: string;
  emoji: string;
  description: string;
  rule: string;
}

export interface Element {
  id: string; // Unique identifier (usually the name in English or Japanese)
  name: string;
  emoji: string;
  imageUrl?: string; // 生成された画像がある場合はBase64を保持
  discoveredBy?: AlchemistType | 'initial'; // Which alchemist created this (or 'initial' for starter items)
  isNew?: boolean; // Used for UI animation when newly discovered
}

export interface CombinationResult {
  result: string;
  englishName: string;
  emoji: string;
  reason: string;
}

// 最初の基本4元素
export const INITIAL_ELEMENTS: Element[] = [
  { id: 'fire', name: '火', emoji: '🔥', discoveredBy: 'initial' },
  { id: 'water', name: '水', emoji: '💧', discoveredBy: 'initial' },
  { id: 'earth', name: '土', emoji: '🪨', discoveredBy: 'initial' },
  { id: 'air', name: '風', emoji: '💨', discoveredBy: 'initial' },
];

export const ALCHEMISTS: Record<AlchemistType, Alchemist> = {
  naturalist: {
    id: 'naturalist',
    name: '自然派の錬金術師',
    emoji: '🌿',
    description: '自然界の物質や現象を重んじる。',
    rule: '人工的な道具や抽象概念は絶対に作り出さず、自然現象、動植物、鉱物などの「物質」を生成する。',
  },
  craftsman: {
    id: 'craftsman',
    name: '職人派の錬金術師',
    emoji: '🛠️',
    description: '道具や機械、人工的な発明を好む。',
    rule: '素材を加工・組み合わせ、人間が使う「道具」「建築」「機械」「料理」などを生成する。',
  },
  philosopher: {
    id: 'philosopher',
    name: '概念派の錬金術師',
    emoji: '💭',
    description: '物事の意味や哲学的な概念を見出す。',
    rule: '物理的な物体だけでなく、「感情」「状態」「科学的現象」「概念」などを生成する。',
  },
};
