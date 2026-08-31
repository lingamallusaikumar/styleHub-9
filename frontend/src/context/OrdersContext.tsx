import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OrdersContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <OrdersContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersContext = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrdersContext must be used within a OrdersProvider');
  return context;
};
