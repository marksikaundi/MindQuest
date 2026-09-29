import { Pressable, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/ui/AppText';
import { useGameTheme } from '@/hooks/use-game-theme';

const tabs = [
  { href: '/game', label: 'Home', icon: 'home' },
  { href: '/world', label: 'Explore', icon: 'map' },
  { href: '/minigames', label: 'Mini-Games', icon: 'game-controller' },
  { href: '/quests', label: 'Quests', icon: 'flag' },
  { href: '/settings', label: 'About', icon: 'information-circle' },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/game') return pathname === '/game';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors, highContrast } = useGameTheme();

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 6,
        backgroundColor: colors.surface,
        borderTopWidth: highContrast ? 2 : 1,
        borderTopColor: colors.line,
        flexDirection: 'row',
      }}>
      {tabs.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Pressable
            key={tab.href}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            onPress={() => {
              if (!active) router.replace(tab.href);
            }}
            style={{ flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Ionicons name={tab.icon} size={22} color={active ? colors.primary : colors.muted} />
            <AppText size={11} weight="800" color={active ? colors.primary : colors.muted}>
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
