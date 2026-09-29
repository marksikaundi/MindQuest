import { Modal, Pressable, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KenneyIcon } from '@/components/ui/KenneyIcon';
import { useGameTheme } from '@/hooks/use-game-theme';
import { useReducedMotion } from '@/hooks/use-game-theme';
import { useGameStore } from '@/stores/gameStore';
import { playEffect } from '@/utils/feedback';

export function RewardModal({
  title,
  body,
  coins = 0,
  xp = 0,
  stars = 0,
  onClose,
}: {
  title: string;
  body: string;
  coins?: number;
  xp?: number;
  stars?: number;
  onClose: () => void;
}) {
  const { colors } = useGameTheme();
  const reduced = useReducedMotion();
  return (
    <Modal transparent animationType={reduced ? 'none' : 'fade'} visible onRequestClose={onClose}>
      <Pressable accessibilityRole="button" onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(28,28,51,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Animated.View entering={reduced ? undefined : ZoomIn.duration(280)} style={{ width: '100%', maxWidth: 420 }}>
          <Card>
            <AppText size={28} weight="800" center>
              {title}
            </AppText>
            <AppText center color={colors.muted} style={{ marginTop: 8 }}>
              {body}
            </AppText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 18 }}>
              <RewardBit icon="star" color={colors.coin} label={`+${coins}`} caption="Coins" />
              <RewardBit icon="trophy" color={colors.primary} label={`+${xp}`} caption="XP" />
              <RewardBit icon="medal" color={colors.star} label={`+${stars}`} caption="Stars" />
            </View>
            {!reduced ? <CoinFlight /> : null}
            <Button label="Continue" onPress={onClose} />
          </Card>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

function RewardBit({ icon, color, label, caption }: { icon: 'star' | 'trophy' | 'medal'; color: string; label: string; caption: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <KenneyIcon name={icon} color={color} size={22} />
      <AppText weight="800">{label}</AppText>
      <AppText size={12} color="#73738C">
        {caption}
      </AppText>
    </View>
  );
}

function CoinFlight() {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={{ height: 28, alignItems: 'center' }}>
      <Animated.View entering={FadeIn.delay(80)}>
        <KenneyIcon name="star" color="#E8A317" />
      </Animated.View>
    </Animated.View>
  );
}

export function CelebrationHost() {
  const current = useGameStore((state) => state.celebrations[0]);
  const dismiss = useGameStore((state) => state.dismissCelebration);

  if (!current) return null;

  const close = () => {
    void playEffect('reward');
    dismiss();
  };

  if (current.kind === 'level-up') {
    return <RewardModal title="LEVEL UP!" body={`You reached level ${current.level}. The Great Tree noticed.`} onClose={close} />;
  }
  if (current.kind === 'quest') {
    return (
      <RewardModal
        title="Quest Complete!"
        body={current.title}
        coins={current.rewards.coins}
        xp={current.rewards.xp}
        stars={current.rewards.stars}
        onClose={close}
      />
    );
  }
  if (current.kind === 'daily') {
    return (
      <RewardModal
        title="Daily Complete!"
        body={current.title}
        coins={current.rewards.coins}
        xp={current.rewards.xp}
        stars={current.rewards.stars}
        onClose={close}
      />
    );
  }
  return <RewardModal title="Achievement Unlocked" body={`${current.title}. ${current.description}`} stars={1} onClose={close} />;
}
