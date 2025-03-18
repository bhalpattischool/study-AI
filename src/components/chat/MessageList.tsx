
import React from 'react';
import { Message as MessageType } from '@/lib/db';
import Message from '../Message';
import LoadingIndicator from './LoadingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  onMessageEdited: () => void;
  onMessageDeleted: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  onMessageEdited, 
  onMessageDeleted 
}) => {
  return (
    <div className="pb-48">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          onEdited={onMessageEdited}
          onDeleted={onMessageDeleted}
        />
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  );
};

export default MessageList;
