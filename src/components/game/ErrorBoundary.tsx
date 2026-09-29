import { Component, type ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12, backgroundColor: '#F5F7FF' }}>
        <AppText size={24} weight="800">
          Questland stumbled
        </AppText>
        <AppText>The adventure hit a snag. Your saved progress is still on this device.</AppText>
        <Button label="Try again" onPress={() => this.setState({ error: null })} />
      </View>
    );
  }
}
