import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useSettingsStore } from '@/stores/settingsStore';

export async function playEffect(kind: 'tap' | 'success' | 'error' | 'reward') {
  const { sound, volume } = useSettingsStore.getState();
  if (!sound || volume <= 0 || Platform.OS === 'web') return;
  try {
    if (kind === 'success' || kind === 'reward') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }
    if (kind === 'error') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics are optional on simulators and some devices.
  }
}
