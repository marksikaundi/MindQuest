export type AppearanceOption = {
  id: string;
  label: string;
  color?: string;
};

export const skinTones: AppearanceOption[] = [
  { id: 'fair', label: 'Fair', color: '#F6D3B8' },
  { id: 'warm', label: 'Warm', color: '#E2B08A' },
  { id: 'tan', label: 'Tan', color: '#C68642' },
  { id: 'bronze', label: 'Bronze', color: '#A56A3A' },
  { id: 'deep', label: 'Deep', color: '#6B3E26' },
  { id: 'rich', label: 'Rich', color: '#3E2418' },
];

export const hairStyles: AppearanceOption[] = [
  { id: 'short', label: 'Short' },
  { id: 'bob', label: 'Bob' },
  { id: 'curly', label: 'Curly' },
  { id: 'bun', label: 'Bun' },
  { id: 'spiky', label: 'Spiky' },
  { id: 'bald', label: 'Bald' },
];

export const hairColors: AppearanceOption[] = [
  { id: 'black', label: 'Black', color: '#2A211C' },
  { id: 'brown', label: 'Brown', color: '#6B3E26' },
  { id: 'honey', label: 'Honey', color: '#C4843C' },
  { id: 'blonde', label: 'Blonde', color: '#F0D48A' },
  { id: 'auburn', label: 'Auburn', color: '#A33B32' },
  { id: 'violet', label: 'Violet', color: '#7A5CFF' },
];

export const outfitColors: Record<string, string> = {
  traveler: '#6C63FF',
  explorer: '#2F8F6B',
  scholar: '#3D7EA6',
  ranger: '#C46B3A',
  mage: '#8E4EC6',
};

export const defaultCharacter = {
  skinTone: 'warm',
  hairStyle: 'short',
  hairColor: 'brown',
  outfit: 'traveler',
  accessory: 'none',
} as const;

export function optionColor(list: AppearanceOption[], id: string, fallback: string) {
  return list.find((item) => item.id === id)?.color ?? fallback;
}
