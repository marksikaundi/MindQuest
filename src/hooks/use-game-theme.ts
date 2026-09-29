import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { contrastColors, colors, type Palette } from '@/constants/tokens';
import { useSettingsStore } from '@/stores/settingsStore';

export function useGameTheme() {
  const highContrast = useSettingsStore((state) => state.highContrast);
  const largeText = useSettingsStore((state) => state.largeText);
  const colorFriendly = useSettingsStore((state) => state.colorFriendly);
  const palette: Palette = highContrast ? contrastColors : colors;
  return {
    colors: palette,
    fontScale: largeText ? 1.18 : 1,
    highContrast,
    colorFriendly,
    borderWidth: highContrast ? 2 : 0,
  };
}

export function useReducedMotion() {
  const motion = useSettingsStore((state) => state.motion);
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) setSystemReduced(enabled);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setSystemReduced);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return motion === 'reduced' || systemReduced;
}
