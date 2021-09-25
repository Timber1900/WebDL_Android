import React, { useEffect } from 'react';
import Layout from './components/Layout';
import ProgressProvider from './contexts/ProgressContext';
import QueueProvider from './contexts/QueueContext';
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
