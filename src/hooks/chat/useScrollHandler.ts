
import { useCallback } from 'react';

export const useScrollHandler = (ref: React.RefObject<HTMLDivElement>) => {
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [ref]);

  return { scrollToBottom };
};
