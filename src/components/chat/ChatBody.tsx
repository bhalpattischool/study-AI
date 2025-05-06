
import React, { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import EmptyChatState from './EmptyChatState';
import LoadingAnimation from '../ui/loading-animation';

interface ChatBodyProps {
  messages: any[];
  isLoading: boolean;
  isResponding: boolean;
  onMessageEdited: () => void;
  onMessageDeleted: () => void;
  onSendMessage: (message: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatBody: React.FC<ChatBodyProps> = ({
  messages,
  isLoading,
  isResponding,
  onMessageEdited,
  onMessageDeleted,
  onSendMessage,
  messagesEndRef
}) => {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
      {messages.length === 0 ? (
        <EmptyChatState onSendMessage={onSendMessage} />
      ) : (
        <>
          <MessageList 
            messages={messages}
            isLoading={isLoading}
            onMessageEdited={onMessageEdited}
            onMessageDeleted={onMessageDeleted}
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
  );
};

export default ChatBody;
