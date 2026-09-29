import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius, touch } from '@/constants/tokens';
import { useGameTheme } from '@/hooks/use-game-theme';

type Option = { id: string; label: string };

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
}) {
  const { colors, highContrast } = useGameTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.id)}
            style={{
              minHeight: touch.min,
              paddingHorizontal: 14,
              borderRadius: radius.pill,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? colors.primary : colors.surface,
              borderWidth: highContrast ? 2 : 1,
              borderColor: selected ? colors.primaryDark : colors.line,
            }}>
            <AppText size={14} weight="800" color={selected ? '#FFFFFF' : colors.text}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
      <View />
    </ScrollView>
  );
}
