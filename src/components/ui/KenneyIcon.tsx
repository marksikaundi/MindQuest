import { Image } from 'react-native';

import { kenney, type KenneyName } from '@/constants/art';

export function KenneyIcon({ name, size = 22, color = '#24243E' }: { name: KenneyName; size?: number; color?: string }) {
  return (
    <Image
      source={kenney[name]}
      accessibilityIgnoresInvertColors
      style={{ width: size, height: size, tintColor: color }}
    />
  );
}
