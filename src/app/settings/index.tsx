import { useState } from 'react';
import { Alert, Pressable, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KenneyIcon } from '@/components/ui/KenneyIcon';
import { Screen } from '@/components/ui/Screen';
import { CREDITS } from '@/data/credits';
import { useGameTheme } from '@/hooks/use-game-theme';
import { useSettingsStore } from '@/stores/settingsStore';
import type { Difficulty, Settings } from '@/types/game';
import { resetGameState, saveGameState } from '@/utils/storage';

export default function SettingsScreen() {
  const settings = useSettingsStore();
  const { colors } = useGameTheme();
  const [note, setNote] = useState('');

  const patch = (partial: Partial<Settings>) => useSettingsStore.setState(partial);

  return (
    <Screen tabBar>
      <AppText size={28} weight="800">About</AppText>
      <AppText weight="800">Play. Explore. Learn. Grow.</AppText>
      {note ? <AppText>{note}</AppText> : null}
      <Card>
        <AppText weight="800">Audio</AppText>
        <Toggle label="Music" icon={settings.music ? 'musicOn' : 'musicOff'} value={settings.music} onChange={(music) => patch({ music })} />
        <Toggle label="Sound effects" icon={settings.sound ? 'audioOn' : 'audioOff'} value={settings.sound} onChange={(sound) => patch({ sound })} />
        <AppText weight="700" style={{ marginTop: 8 }}>Volume {settings.volume}%</AppText>
        <VolumeBar value={settings.volume} onChange={(volume) => patch({ volume })} />
      </Card>
      <Card>
        <AppText weight="800">Gameplay</AppText>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {(['relaxed', 'standard', 'challenge'] as const).map((level) => (
            <Button key={level} label={level} variant={settings.difficulty === level ? 'primary' : 'ghost'} onPress={() => patch({ difficulty: level satisfies Difficulty })} style={{ flex: 1 }} />
          ))}
        </View>
        <AppText weight="800" style={{ marginTop: 12 }}>Motion</AppText>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button label="Normal" variant={settings.motion === 'normal' ? 'primary' : 'ghost'} onPress={() => patch({ motion: 'normal' })} style={{ flex: 1 }} />
          <Button label="Reduced" variant={settings.motion === 'reduced' ? 'primary' : 'ghost'} onPress={() => patch({ motion: 'reduced' })} style={{ flex: 1 }} />
        </View>
      </Card>
      <Card>
        <AppText weight="800">Accessibility</AppText>
        <Toggle label="Large text" icon="information" value={settings.largeText} onChange={(largeText) => patch({ largeText })} />
        <Toggle label="High contrast" icon="contrast" value={settings.highContrast} onChange={(highContrast) => patch({ highContrast })} />
        <Toggle label="Color-friendly mode" icon="target" value={settings.colorFriendly} onChange={(colorFriendly) => patch({ colorFriendly })} />
        <Toggle label="Optional timers" icon="exclamation" value={settings.timersEnabled} onChange={(timersEnabled) => patch({ timersEnabled })} />
      </Card>
      <Card>
        <AppText weight="800">Data</AppText>
        <Button
          label="Save Game"
          onPress={() => {
            void saveGameState().then((ok) => setNote(ok ? 'Game saved on this device.' : 'Save failed. Your latest changes stay in memory until the next try.'));
          }}
        />
        <Button
          label="Reset Game"
          variant="danger"
          onPress={() => {
            Alert.alert('Reset game?', 'This erases your traveler, coins, quests, and home on this device.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () => {
                  void resetGameState().then(() => router.replace('/onboarding/welcome'));
                },
              },
            ]);
          }}
          style={{ marginTop: 8 }}
        />
      </Card>
      <Card>
        <AppText weight="800">Credits</AppText>
        {CREDITS.map((credit) => (
          <View key={credit.name} style={{ marginTop: 8 }}>
            <AppText weight="800">{credit.name}</AppText>
            <AppText size={13} color={colors.muted}>{credit.use} {credit.license}. {credit.source}</AppText>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

function Toggle({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  icon: 'musicOn' | 'musicOff' | 'audioOn' | 'audioOff' | 'information' | 'contrast' | 'target' | 'exclamation';
}) {
  const { colors } = useGameTheme();
  return (
    <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <KenneyIcon name={icon} color={colors.primaryDark} />
      <AppText style={{ flex: 1 }}>{label}</AppText>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary, false: colors.line }}
      />
    </View>
  );
}

function VolumeBar({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { colors } = useGameTheme();
  const apply = (x: number, width: number) => {
    if (width <= 0) return;
    onChange(Math.round(Math.max(0, Math.min(100, (x / width) * 100))));
  };
  const gesture = Gesture.Pan().onUpdate((event) => {
    runOnJS(apply)(event.x, 280);
  });

  return (
    <GestureDetector gesture={gesture}>
      <Pressable
        accessibilityRole="adjustable"
        accessibilityLabel="Volume"
        accessibilityValue={{ min: 0, max: 100, now: value }}
        onPress={(event) => apply(event.nativeEvent.locationX, 280)}
        style={{ height: 48, justifyContent: 'center' }}>
        <View style={{ height: 12, borderRadius: 8, backgroundColor: colors.line, overflow: 'hidden' }}>
          <View style={{ width: `${value}%`, height: '100%', backgroundColor: colors.primary }} />
        </View>
      </Pressable>
    </GestureDetector>
  );
}
