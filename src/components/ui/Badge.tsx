import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/tokens';

export function Badge({ label, color, textColor = '#24243E' }: { label: string; color: string; textColor?: string }) {
  return (
    <View style={{ backgroundColor: color, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
      <AppText size={12} weight="800" color={textColor}>
        {label}
      </AppText>
    </View>
  );
}
