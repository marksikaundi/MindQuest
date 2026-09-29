import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';

import { Avatar } from '@/components/player/Avatar';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { hairColors, hairStyles, outfitColors, skinTones } from '@/data/characters';
import { getItem } from '@/data/items';
import { ownsItem, purchaseItem, saveCharacter } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';
import { usePlayerStore } from '@/stores/playerStore';
import type { Character } from '@/types/game';

const outfits = ['traveler', 'explorer', 'scholar', 'ranger', 'mage'];
const accessories = ['none', 'glasses', 'flower', 'scarf', 'star-pin', 'crown'];

export default function CharacterScreen() {
  const saved = usePlayerStore((state) => state.character);
  const player = usePlayerStore((state) => state.player);
  const { colors } = useGameTheme();
  const [draft, setDraft] = useState<Character>(saved);
  const [message, setMessage] = useState('');

  const update = (patch: Partial<Character>) => setDraft((current) => ({ ...current, ...patch }));
  const outfitOwned = ownsItem(draft.outfit);
  const accessoryOwned = ownsItem(draft.accessory);

  return (
    <Screen tabBar>
      <AppText size={28} weight="800">Profile</AppText>
      <Card>
        <View style={{ alignItems: 'center' }}>
          <Avatar character={draft} size={150} />
        </View>
        <AppText size={22} weight="800" center>{player.name}</AppText>
        <AppText center color={colors.muted}>
          Level {player.level} · {player.stars} stars · {player.coins} coins
        </AppText>
      </Card>
      <Chooser label="Appearance" options={skinTones.map((item) => ({ id: item.id, label: item.label }))} value={draft.skinTone} onChange={(id) => update({ skinTone: id })} />
      <Chooser label="Hair" options={hairStyles} value={draft.hairStyle} onChange={(id) => update({ hairStyle: id })} />
      <Chooser label="Hair color" options={hairColors.map((item) => ({ id: item.id, label: item.label }))} value={draft.hairColor} onChange={(id) => update({ hairColor: id })} />
      <Chooser
        label="Clothing"
        options={outfits.map((id) => ({ id, label: `${getItem(id)?.name ?? id}${ownsItem(id) ? '' : ` · ${getItem(id)?.price ?? 0}`}` }))}
        value={draft.outfit}
        onChange={(id) => update({ outfit: id })}
      />
      <Chooser
        label="Accessories"
        options={accessories.map((id) => ({ id, label: `${getItem(id)?.name ?? id}${ownsItem(id) ? '' : ` · ${getItem(id)?.price ?? 0}`}` }))}
        value={draft.accessory}
        onChange={(id) => update({ accessory: id })}
      />
      <View style={{ height: 8, borderRadius: 8, backgroundColor: outfitColors[draft.outfit] ?? colors.primary }} />
      {message ? <AppText center>{message}</AppText> : null}
      {!outfitOwned || !accessoryOwned ? (
        <Button
          label="Unlock selected"
          variant="secondary"
          onPress={() => {
            const notes = [];
            if (!outfitOwned) notes.push(purchaseItem(draft.outfit));
            if (!accessoryOwned) notes.push(purchaseItem(draft.accessory));
            setMessage(notes.join(' '));
          }}
        />
      ) : null}
      <Button
        label="Save Changes"
        onPress={() => setMessage(saveCharacter(draft))}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Shortcut href="/inventory" icon="briefcase" label="Bag" />
        <Shortcut href="/home" icon="bed" label="Home" />
        <Shortcut href="/achievements" icon="trophy" label="Awards" />
        <Shortcut href="/settings" icon="settings" label="Settings" />
      </View>
    </Screen>
  );
}

function Shortcut({ href, icon, label }: { href: Href; icon: 'briefcase' | 'bed' | 'trophy' | 'settings'; label: string }) {
  const { colors } = useGameTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => router.push(href)} style={{ alignItems: 'center', gap: 6, minWidth: 72 }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={24} color={colors.primaryDark} />
      </View>
      <AppText size={12} weight="800">
        {label}
      </AppText>
    </Pressable>
  );
}

function Chooser({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
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
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.id)}
              style={{ minHeight: 48, paddingHorizontal: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? colors.primary : colors.surface }}>
              <AppText weight="800" color={selected ? '#FFFFFF' : colors.text}>
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
