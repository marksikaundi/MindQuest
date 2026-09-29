import { router } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';

export default function NotFoundScreen() {
  return (
    <Screen>
      <AppText size={28} weight="800">That path is not on the map.</AppText>
      <Button label="Back to Questland" onPress={() => router.replace('/game')} />
    </Screen>
  );
}
