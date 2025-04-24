
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface ChatMessageListProps {
  messages: any[];
  isGroup: boolean;
}

const ChatMessageList = ({ messages, isGroup }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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
          
          return (
            <div 
              key={msg.id} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] rounded-lg p-3 ${
                  isCurrentUser 
                    ? 'bg-purple-500 text-white rounded-br-none' 
                    : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                }`}
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
                      onLoad={scrollToBottom}
                    />
                  </a>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
                
                <div 
                  className={`text-xs ${
                    isCurrentUser ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                  } text-right mt-1`}
                >
                  {formatMessageTimestamp(msg.timestamp)}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
