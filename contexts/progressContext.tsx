import React from 'react';
import { createContext, ReactNode, useState } from 'react';

export interface ProgressContextData {
  progress: number,
  vel: string,
  eta: string,
  updateProgress: (newProgress: number) => void,
  updateVel: (newVel: string) => void
  updateEta: (newEta: string) => void
}

export const ProgressContext = createContext({} as ProgressContextData);

interface ProgressProviderProps {
  children: ReactNode;
}

export default function ProgressProvider({ children }: ProgressProviderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [vel, setVel] = useState<string>('00.00MiB/s');
  const [eta, setEta] = useState<string>('00:00');

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  }

  const updateVel = (newVel: string) => {
    setVel(newVel);
  }

  const updateEta = (newEta: string) => {
    setEta(newEta);
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        vel,
        eta,
        updateProgress,
        updateVel,
        updateEta
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
