import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Share from './src/Share';
import Watch from './src/Watch';
import { Btn, C, s } from './src/ui';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'share' | 'watch'>('home');
  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.screen}>
        <StatusBar style="light" />
        {screen === 'home' && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={[s.code, { letterSpacing: 1, fontSize: 36, marginBottom: 32 }]}>cLocation</Text>
            <Btn label="Share" onPress={() => setScreen('share')} />
            <Btn label="Watch" color={C.card} onPress={() => setScreen('watch')} />
          </View>
        )}
        {screen === 'share' && <Share onBack={() => setScreen('home')} />}
        {screen === 'watch' && <Watch onBack={() => setScreen('home')} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
