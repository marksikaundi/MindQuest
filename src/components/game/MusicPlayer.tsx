import { useEffect } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { art } from '@/constants/art';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';

export function MusicPlayer() {
  const player = useAudioPlayer(art.music);
  const music = useSettingsStore((state) => state.music);
  const volume = useSettingsStore((state) => state.volume);
  const onboarded = usePlayerStore((state) => state.onboarded);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => undefined);
  }, []);

  useEffect(() => {
    player.loop = true;
    const audible = music && onboarded && volume > 0;
    player.volume = audible ? volume / 100 : 0;
    try {
      if (audible) player.play();
      else player.pause();
    } catch {
      // Audio can be unavailable in some simulators.
    }
  }, [music, onboarded, player, volume]);

  return null;
}
