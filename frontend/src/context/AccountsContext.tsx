import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccountsContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <AccountsContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);
  if (!context) throw new Error('useAccountsContext must be used within a AccountsProvider');
  return context;
};
