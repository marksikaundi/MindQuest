import { Text, type TextProps, type TextStyle } from 'react-native';

import { useGameTheme } from '@/hooks/use-game-theme';

type Props = TextProps & {
  size?: number;
  weight?: TextStyle['fontWeight'];
  color?: string;
  center?: boolean;
};

export function AppText({ size = 16, weight = '500', color, center, style, ...props }: Props) {
  const theme = useGameTheme();
  return (
    <Text
      maxFontSizeMultiplier={1.4}
      style={[
        {
          fontSize: size * theme.fontScale,
          lineHeight: Math.round(size * theme.fontScale * 1.35),
          fontWeight: weight,
          color: color ?? theme.colors.text,
          textAlign: center ? 'center' : 'auto',
        },
        style,
      ]}
      {...props}
    />
  );
}
