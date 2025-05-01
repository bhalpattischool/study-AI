
import React, { useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import MessageList from './MessageList';
import EmptyChatState from './EmptyChatState';
import ChatFooter from '../ChatFooter';
import MessageLimitAlert from '../MessageLimitAlert';
import LoadingAnimation from '../ui/loading-animation';

interface ChatContainerProps {
  chatId: string;
  onChatUpdated?: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ chatId, onChatUpdated }) => {
  const { 
    messages, 
    isLoading, 
    isResponding, 
    showLimitAlert, 
    setShowLimitAlert, 
    loadMessages, 
    sendMessage,
    messageLimitReached
  } = useChat(chatId, onChatUpdated);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (input: string) => {
    sendMessage(input);
    scrollToBottom();
  };

  const handleMessageEdited = async () => {
    await loadMessages();
    if (onChatUpdated) onChatUpdated();
    scrollToBottom();
  };

  const handleMessageDeleted = async () => {
    await loadMessages();
    if (onChatUpdated) onChatUpdated();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 w-full overflow-hidden">
      {showLimitAlert && (
        <MessageLimitAlert onClose={() => setShowLimitAlert(false)} />
      )}
      
      {isResponding && (
        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-2 mb-2 flex items-center animate-pulse">
          <div className="mr-2 h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
          <p className="text-sm text-green-700 dark:text-green-300">
            शिक्षक जवाब दे रहे हैं...
          </p>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
        {messages.length === 0 ? (
          <EmptyChatState onSendMessage={handleSend} />
        ) : (
          <>
            <MessageList 
              messages={messages}
              isLoading={isLoading}
              onMessageEdited={handleMessageEdited}
              onMessageDeleted={handleMessageDeleted}
            />
            
            {/* Show our beautiful new loading animation when the AI is responding */}
            {(isLoading || isResponding) && (
              <LoadingAnimation 
                message={isLoading ? "Study AI लोड हो रहा है..." : "Study AI सोच रहा है..."}
                className="my-4"
              />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatFooter 
        onSend={handleSend} 
        isLoading={isLoading} 
        isDisabled={isResponding || messageLimitReached}
      />
    </div>
  );
};

export default ChatContainer;
