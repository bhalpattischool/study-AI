
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
            
            {/* नया मॉडर्न और अट्रैक्टिव लोडिंग एनिमेशन */}
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
