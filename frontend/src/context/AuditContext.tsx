import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuditContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <AuditContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAuditContext = () => {
  const context = useContext(AuditContext);
  if (!context) throw new Error('useAuditContext must be used within a AuditProvider');
  return context;
};
