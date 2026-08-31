import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CatalogContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <CatalogContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalogContext must be used within a CatalogProvider');
  return context;
};
