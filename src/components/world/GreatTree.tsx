import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { useReducedMotion } from '@/hooks/use-game-theme';
import { treeStage } from '@/utils/progression';

export function GreatTree({ level, onPress }: { level: number; onPress?: () => void }) {
  const stage = treeStage(level);
  const reduced = useReducedMotion();
  const glow = useSharedValue(0.4);

  useEffect(() => {
    glow.value = reduced ? 0.7 : withRepeat(withTiming(1, { duration: 1400 }), -1, true);
  }, [glow, reduced]);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));
  const scale = stage === 1 ? 0.72 : stage === 2 ? 0.88 : 1;

  return (
    <View accessibilityRole="button" accessibilityLabel={`Great Tree, growth stage ${stage}`} onTouchEnd={onPress} style={{ width: 150, height: 170, alignItems: 'center', justifyContent: 'flex-end' }}>
      {stage === 3 ? (
        <Animated.View style={[{ position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: '#C9B8FF' }, glowStyle]} />
      ) : null}
      <Svg width={150 * scale} height={160 * scale} viewBox="0 0 150 160">
        <Ellipse cx="75" cy="150" rx="36" ry="8" fill="rgba(36,36,62,0.18)" />
        <Path d="M75 150 L68 78 L82 78 Z" fill="#8A5A3A" />
        <Circle cx="75" cy={stage === 1 ? 78 : 70} r={stage === 1 ? 28 : stage === 2 ? 36 : 42} fill="#2F9E6B" />
        <Circle cx={stage === 1 ? 58 : 48} cy={stage === 1 ? 88 : 82} r={stage === 1 ? 16 : 22} fill="#45C4B0" />
        <Circle cx={stage === 1 ? 96 : 104} cy={stage === 1 ? 90 : 80} r={stage === 1 ? 14 : 20} fill="#3EAF78" />
        {stage >= 2 ? <Circle cx="74" cy="48" r="8" fill="#D8FF7A" /> : null}
        {stage >= 2 ? <Circle cx="96" cy="58" r="6" fill="#FFE38A" /> : null}
        {stage === 3 ? <Circle cx="54" cy="60" r="7" fill="#FFFFFF" /> : null}
        {stage === 3 ? <Circle cx="112" cy="96" r="5" fill="#FFC857" /> : null}
      </Svg>
    </View>
  );
}
