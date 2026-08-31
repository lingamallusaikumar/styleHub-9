import { useState, useEffect } from 'react';

export function useTheme() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData({ initialized: true, hook: 'useTheme' });
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}
