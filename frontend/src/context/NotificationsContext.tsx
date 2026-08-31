import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationsContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <NotificationsContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  return context;
};
