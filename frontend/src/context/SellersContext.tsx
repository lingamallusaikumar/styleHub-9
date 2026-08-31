import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SellersContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const SellersContext = createContext<SellersContextType | undefined>(undefined);

export const SellersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <SellersContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </SellersContext.Provider>
  );
};

export const useSellersContext = () => {
  const context = useContext(SellersContext);
  if (!context) throw new Error('useSellersContext must be used within a SellersProvider');
  return context;
};
