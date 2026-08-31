import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentsContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export const PaymentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <PaymentsContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePaymentsContext = () => {
  const context = useContext(PaymentsContext);
  if (!context) throw new Error('usePaymentsContext must be used within a PaymentsProvider');
  return context;
};
