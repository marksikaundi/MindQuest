import { View } from 'react-native';

import { hairColors, outfitColors, skinTones, optionColor } from '@/data/characters';
import type { Character } from '@/types/game';

export function Avatar({ character, size = 120 }: { character: Character; size?: number }) {
  const skin = optionColor(skinTones, character.skinTone, '#E2B08A');
  const hair = optionColor(hairColors, character.hairColor, '#6B3E26');
  const cloth = outfitColors[character.outfit] ?? '#6C63FF';
  const head = size * 0.42;

  return (
    <View style={{ width: size, height: size * 1.15, alignItems: 'center' }} accessibilityLabel="Player character">
      <View style={{ width: head, height: head, marginTop: size * 0.08 }}>
        {character.hairStyle === 'bob' ? (
          <View style={{ position: 'absolute', top: head * 0.35, left: -head * 0.08, right: -head * 0.08, height: head * 0.7, backgroundColor: hair, borderBottomLeftRadius: head, borderBottomRightRadius: head }} />
        ) : null}
        {character.hairStyle === 'curly' ? (
          <View style={{ position: 'absolute', top: -head * 0.08, left: -head * 0.06, width: head * 1.12, height: head * 0.62, backgroundColor: hair, borderRadius: head }} />
        ) : null}
        {character.hairStyle === 'bun' ? (
          <View style={{ position: 'absolute', top: -head * 0.22, alignSelf: 'center', left: head * 0.28, width: head * 0.44, height: head * 0.44, backgroundColor: hair, borderRadius: head }} />
        ) : null}
        {character.hairStyle === 'short' || character.hairStyle === 'spiky' ? (
          <View
            style={{
              position: 'absolute',
              top: character.hairStyle === 'spiky' ? -head * 0.12 : -head * 0.02,
              left: 0,
              width: head,
              height: head * 0.48,
              backgroundColor: hair,
              borderTopLeftRadius: head,
              borderTopRightRadius: head,
              transform: [{ scaleY: character.hairStyle === 'spiky' ? 1.15 : 1 }],
            }}
          />
        ) : null}
        <View style={{ width: head, height: head, borderRadius: head, backgroundColor: skin }} />
        <View style={{ position: 'absolute', top: head * 0.38, left: head * 0.22, width: head * 0.12, height: head * 0.12, borderRadius: 99, backgroundColor: '#24243E' }} />
        <View style={{ position: 'absolute', top: head * 0.38, right: head * 0.22, width: head * 0.12, height: head * 0.12, borderRadius: 99, backgroundColor: '#24243E' }} />
        <View style={{ position: 'absolute', top: head * 0.62, alignSelf: 'center', left: head * 0.38, width: head * 0.24, height: head * 0.08, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#C46B6B' }} />
        {character.accessory === 'glasses' ? (
          <View style={{ position: 'absolute', top: head * 0.32, left: head * 0.1, right: head * 0.1, height: head * 0.22, borderWidth: 2, borderColor: '#24243E', borderRadius: 8 }} />
        ) : null}
        {character.accessory === 'flower' ? (
          <View style={{ position: 'absolute', top: head * 0.05, right: -2, width: head * 0.22, height: head * 0.22, borderRadius: 99, backgroundColor: '#E85D75' }} />
        ) : null}
        {character.accessory === 'crown' ? (
          <View style={{ position: 'absolute', top: -head * 0.16, left: head * 0.12, width: head * 0.76, height: head * 0.22, backgroundColor: '#FFC857', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
        ) : null}
        {character.accessory === 'star-pin' ? (
          <View style={{ position: 'absolute', top: head * 0.02, left: -2, width: head * 0.18, height: head * 0.18, backgroundColor: '#FFC857', transform: [{ rotate: '45deg' }] }} />
        ) : null}
      </View>
      <View style={{ marginTop: 6, width: size * 0.62, height: size * 0.48, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: cloth, alignItems: 'center' }}>
        {character.accessory === 'scarf' ? (
          <View style={{ marginTop: 4, width: size * 0.4, height: 10, borderRadius: 8, backgroundColor: '#FFC857' }} />
        ) : null}
      </View>
    </View>
  );
}
