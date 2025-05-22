
import { useCallback } from 'react';

export const useScrollHandler = (messagesEndRef: React.RefObject<HTMLDivElement>) => {
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesEndRef]);

  return { scrollToBottom };
};
