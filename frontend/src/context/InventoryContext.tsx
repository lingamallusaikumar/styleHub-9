import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InventoryContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <InventoryContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventoryContext must be used within a InventoryProvider');
  return context;
};
