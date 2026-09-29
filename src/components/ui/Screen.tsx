import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/game/BottomNav';
import { useGameTheme } from '@/hooks/use-game-theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  tabBar?: boolean;
  padded?: boolean;
  header?: ReactNode;
};

export function Screen({ children, scroll = true, tabBar = false, padded = true, header }: Props) {
  const { colors } = useGameTheme();
  const insets = useSafeAreaInsets();
  const bottom = (tabBar ? 88 : 16) + insets.bottom;
  const body = scroll ? (
    <ScrollView contentContainerStyle={{ padding: padded ? 16 : 0, paddingBottom: bottom, gap: 16 }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, padding: padded ? 16 : 0, paddingBottom: bottom }}>{children}</View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center' }}>
        {header}
        {body}
      </View>
      {tabBar ? <BottomNav /> : null}
    </SafeAreaView>
  );
}
