import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalyticsContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <AnalyticsContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error('useAnalyticsContext must be used within a AnalyticsProvider');
  return context;
};
