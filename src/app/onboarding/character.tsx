import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { Avatar } from '@/components/player/Avatar';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { hairColors, hairStyles, skinTones, defaultCharacter } from '@/data/characters';
import { createAdventure } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';
import type { Character } from '@/types/game';

const outfits = [
  { id: 'traveler', label: 'Traveler' },
  { id: 'explorer', label: 'Explorer' },
  { id: 'scholar', label: 'Scholar' },
  { id: 'ranger', label: 'Ranger' },
  { id: 'mage', label: 'Mage' },
];

const accessories = [
  { id: 'none', label: 'None' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'flower', label: 'Flower' },
  { id: 'scarf', label: 'Scarf' },
  { id: 'star-pin', label: 'Star' },
  { id: 'crown', label: 'Crown' },
];

export default function CharacterCreateScreen() {
  const { colors, highContrast } = useGameTheme();
  const [name, setName] = useState('');
  const [character, setCharacter] = useState<Character>({ ...defaultCharacter });
  const [error, setError] = useState('');

  const update = (patch: Partial<Character>) => setCharacter((current) => ({ ...current, ...patch }));

  return (
    <Screen>
      <AppText size={28} weight="800" center>
        Create your traveler
      </AppText>
      <View style={{ alignItems: 'center' }}>
        <Avatar character={character} size={150} />
      </View>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={colors.muted}
        maxLength={16}
        accessibilityLabel="Character name"
        style={{
          minHeight: 54,
          borderRadius: 16,
          paddingHorizontal: 16,
          backgroundColor: colors.surface,
          color: colors.text,
          fontSize: 18,
          borderWidth: highContrast ? 2 : 1,
          borderColor: colors.line,
        }}
      />
      <OptionRow label="Skin tone" options={skinTones.map((item) => ({ id: item.id, label: item.label, color: item.color }))} value={character.skinTone} onChange={(id) => update({ skinTone: id })} />
      <OptionRow label="Hair style" options={hairStyles} value={character.hairStyle} onChange={(id) => update({ hairStyle: id })} />
      <OptionRow label="Hair color" options={hairColors.map((item) => ({ id: item.id, label: item.label, color: item.color }))} value={character.hairColor} onChange={(id) => update({ hairColor: id })} />
      <OptionRow label="Clothing" options={outfits} value={character.outfit} onChange={(id) => update({ outfit: id })} />
      <OptionRow label="Accessory" options={accessories} value={character.accessory} onChange={(id) => update({ accessory: id })} />
      {error ? (
        <AppText center color={colors.danger}>
          {error}
        </AppText>
      ) : null}
      <Button
        label="Start My Adventure"
        onPress={() => {
          const trimmed = name.trim().replace(/\s+/g, ' ');
          if (trimmed.length < 2 || trimmed.length > 16) {
            setError('Choose a name between 2 and 16 characters.');
            return;
          }
          createAdventure(trimmed, character);
          router.replace('/game');
        }}
      />
    </Screen>
  );
}

function OptionRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string; color?: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const { colors } = useGameTheme();
  return (
    <View style={{ gap: 8 }}>
      <AppText weight="800">{label}</AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <Button
              key={option.id}
              label={option.label}
              variant={selected ? 'primary' : 'ghost'}
              onPress={() => onChange(option.id)}
              style={{ minWidth: 88 }}
            />
          );
        })}
      </ScrollView>
      {options.some((option) => option.color) ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {options.map((option) =>
            option.color ? (
              <View key={option.id} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: option.color, borderWidth: option.id === value ? 3 : 0, borderColor: colors.ink }} />
            ) : null,
          )}
        </View>
      ) : null}
    </View>
  );
}
