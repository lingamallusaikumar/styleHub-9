import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PromotionsContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(undefined);

export const PromotionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <PromotionsContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </PromotionsContext.Provider>
  );
};

export const usePromotionsContext = () => {
  const context = useContext(PromotionsContext);
  if (!context) throw new Error('usePromotionsContext must be used within a PromotionsProvider');
  return context;
};
