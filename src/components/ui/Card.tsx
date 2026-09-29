import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, shadow, spacing } from '@/constants/tokens';
import { useGameTheme } from '@/hooks/use-game-theme';

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors, borderWidth } = useGameTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth,
          borderColor: colors.line,
        },
        shadow,
        style,
      ]}>
      {children}
    </View>
  );
}
