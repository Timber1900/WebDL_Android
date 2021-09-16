import React from 'react';
import { createContext, ReactNode, useState } from 'react';

export interface QueueContextData {
}

export const QueueContext = createContext({} as QueueContextData);

interface QueueProviderProps {
  children: ReactNode;
}

export default function QueueProvider({ children }: QueueProviderProps) {

  return (
    <QueueContext.Provider
      value={{
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}
