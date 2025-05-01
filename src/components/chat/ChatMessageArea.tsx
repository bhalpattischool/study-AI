
import React, { useRef, useEffect } from 'react';
import ChatMessageList from './ChatMessageList';

interface ChatMessageAreaProps {
  messages: any[];
  isLoading: boolean;
  chatId: string;
  isGroup: boolean;
  onRefreshMessages: () => void;
}

const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({
  messages,
  isLoading,
  chatId,
  isGroup,
  onRefreshMessages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
      {isLoading && messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ChatMessageList 
          messages={messages} 
          isGroup={isGroup} 
          chatId={chatId}
          onMessageUpdated={onRefreshMessages}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageArea;
