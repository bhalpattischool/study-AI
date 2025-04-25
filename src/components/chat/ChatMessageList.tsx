
import { useEffect, useRef, useState, memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import MessageActions from './MessageActions';

interface ChatMessageListProps {
  messages: any[];
  isGroup: boolean;
  chatId: string;
  onMessageUpdated: () => void;
}

// Using memo to prevent unnecessary re-renders
const ChatMessageList = memo(({ messages, isGroup, chatId, onMessageUpdated }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const messageTimerRef = useRef<number | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);
  
  // Only scroll when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatMessageTimestamp = (timestamp: number) => {
    if (!timestamp) return '';
    return format(new Date(timestamp), 'HH:mm');
  };
  
  const isImageMessage = (text: string) => {
    return text.startsWith('[image:') && text.endsWith(']');
  };
  
  const extractImageUrl = (text: string) => {
    if (isImageMessage(text)) {
      return text.substring(7, text.length - 1);
    }
    return '';
  };

  const handleMessageClick = (messageId: string) => {
    // Clear any existing timer
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    // Set this message as active
    setActiveMessageId(messageId);

    // Set a timeout to hide the actions after 3 seconds
    messageTimerRef.current = window.setTimeout(() => {
      setActiveMessageId(null);
    }, 3000);
  };

  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  // Stable message rendering
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-500">
          <p>No messages yet. Send a message to start the conversation.</p>
        </div>
      ) : (
        messages.map((msg) => {
          const isCurrentUser = msg.sender === currentUser?.uid;
          const isImage = isImageMessage(msg.text);
          const imageUrl = isImage ? extractImageUrl(msg.text) : '';
          const isSaved = msg.saved === true;
          const isExpiringSoon = msg.expiresAt && !isSaved && 
            (msg.expiresAt - Date.now() < 4 * 60 * 60 * 1000); // Less than 4 hours remaining
          
          return (
            <div 
              key={msg.id} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`relative max-w-[75%] rounded-lg p-3 ${
                  isCurrentUser 
                    ? 'bg-purple-500 text-white rounded-br-none' 
                    : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                } ${isSaved ? 'border-l-4 border-amber-500' : ''}
                  ${isExpiringSoon ? 'border-red-500 border' : ''}`}
                onClick={() => handleMessageClick(msg.id)}
              >
                {isGroup && !isCurrentUser && (
                  <div className="text-xs font-medium mb-1">
                    {msg.senderName}
                  </div>
                )}
                
                {isImage ? (
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={imageUrl} 
                      alt="Shared image" 
                      className="max-h-60 rounded"
                    />
                  </a>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
                
                <div 
                  className={`text-xs ${
                    isCurrentUser ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                  } text-right mt-1 flex justify-end items-center space-x-2`}
                >
                  <span>{formatMessageTimestamp(msg.timestamp)}</span>
                  {isExpiringSoon && !isSaved && (
                    <span className="text-red-500 text-xs">
                      {Math.ceil((msg.expiresAt - Date.now()) / (60 * 60 * 1000))}h left
                    </span>
                  )}
                </div>

                {activeMessageId === msg.id && (
                  <MessageActions 
                    messageId={msg.id}
                    chatId={chatId}
                    isGroup={isGroup}
                    isSaved={isSaved}
                    onActionComplete={onMessageUpdated}
                  />
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
});

export default ChatMessageList;
