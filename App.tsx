import React from 'react';
import Layout from './components/Layout';
import ProgressProvider from './contexts/ProgressContext';
import QueueProvider from './contexts/QueueContext';

export default function App() {

  return (
    <ProgressProvider>
      <QueueProvider>
        <Layout />
      </QueueProvider>
    </ProgressProvider>
  );
}
