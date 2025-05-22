
import React from 'react';
import Message from './Message';

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
  onMessageEdited: (messageId: string, newContent: string) => void;
  onMessageDeleted: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  onMessageEdited, 
  onMessageDeleted 
}) => {
  return (
    <div className="py-4 px-4 space-y-6">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          onEdit={(newContent) => onMessageEdited(message.id, newContent)}
          onDelete={() => onMessageDeleted(message.id)}
        />
      ))}
    </div>
  );
};

export default MessageList;
