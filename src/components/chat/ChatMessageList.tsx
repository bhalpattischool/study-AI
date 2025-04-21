
import React, { useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender: string;
  senderName: string;
  text: string;
  timestamp: number;
}

interface ChatMessageListProps {
  messages: Message[];
  isGroup?: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isGroup = false }) => {
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimestamp = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "recently";
    }
  };

  return (
    <div className="flex flex-col space-y-3 p-4 overflow-y-auto flex-1">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 my-10">
          <p>No messages yet. Say hello!</p>
        </div>
      ) : (
        <>
          {messages.map((message) => {
            const isCurrentUser = currentUser?.uid === message.sender;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isCurrentUser 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {isGroup && !isCurrentUser && (
                    <div className="text-xs font-medium mb-1">
                      {message.senderName}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  <div className={`text-xs mt-1 ${isCurrentUser ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatMessageList;
