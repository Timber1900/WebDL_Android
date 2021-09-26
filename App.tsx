import React, { useEffect } from 'react';
import Layout from './src/components/Layout';
import ProgressProvider from './src/contexts/ProgressContext';
import QueueProvider from './src/contexts/QueueContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <QueueProvider>
          <Layout />
        </QueueProvider>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
