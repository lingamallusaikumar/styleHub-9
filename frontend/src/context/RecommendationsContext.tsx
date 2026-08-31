import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RecommendationsContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export const RecommendationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <RecommendationsContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </RecommendationsContext.Provider>
  );
};

export const useRecommendationsContext = () => {
  const context = useContext(RecommendationsContext);
  if (!context) throw new Error('useRecommendationsContext must be used within a RecommendationsProvider');
  return context;
};
