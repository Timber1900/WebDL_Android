import React from 'react';
import Layout from './components/Layout';
import ProgressProvider from './contexts/progressContext';

export default function App() {

  return (
    <ProgressProvider>
      <Layout />
    </ProgressProvider>
  );
}
