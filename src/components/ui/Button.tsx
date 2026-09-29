import { useEffect } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { radius, touch } from '@/constants/tokens';
import { playEffect } from '@/utils/feedback';
import { useGameTheme } from '@/hooks/use-game-theme';
import { useReducedMotion } from '@/hooks/use-game-theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, variant = 'primary', onPress, disabled, style, ...props }: Props) {
  const { colors, highContrast } = useGameTheme();
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    if (disabled) scale.value = 1;
  }, [disabled, scale]);

  const background =
    variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.secondary : variant === 'danger' ? colors.danger : 'transparent';
  const textColor = variant === 'ghost' ? colors.primaryDark : '#FFFFFF';

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withTiming(reduced || disabled ? 1 : 0.96, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 90 });
      }}
      onPress={(event) => {
        void playEffect('tap');
        onPress?.(event);
      }}
      style={[
        animated,
        {
          minHeight: touch.button,
          paddingHorizontal: 18,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
          opacity: disabled ? 0.45 : 1,
          borderWidth: variant === 'ghost' || highContrast ? 2 : 0,
          borderColor: variant === 'danger' ? colors.danger : colors.primaryDark,
        },
        style,
      ]}
      {...props}>
      <AppText weight="800" size={17} color={textColor}>
        {label}
      </AppText>
    </AnimatedPressable>
  );
}
