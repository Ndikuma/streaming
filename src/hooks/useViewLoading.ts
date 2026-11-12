import { useState, useEffect } from 'react';

export const useViewLoading = (durationMs = 400) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs]);

  const triggerReload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, durationMs);
  };

  return { isLoading, triggerReload };
};
