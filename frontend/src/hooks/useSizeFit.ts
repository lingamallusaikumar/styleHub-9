import { useState, useEffect } from 'react';

export function useSizeFit() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData({ initialized: true, hook: 'useSizeFit' });
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}
