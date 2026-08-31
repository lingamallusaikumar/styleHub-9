import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReviewsContextType {
  state: any;
  setState: (val: any) => void;
  isLoading: boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <ReviewsContext.Provider value={{ state, setState, isLoading }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviewsContext = () => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviewsContext must be used within a ReviewsProvider');
  return context;
};
