
import React from 'react';
import ChatContainer from './chat/ChatContainer';

interface ChatProps {
  chatId: string;
  onChatUpdated?: () => void;
}

const Chat: React.FC<ChatProps> = ({ chatId, onChatUpdated }) => {
  return <ChatContainer chatId={chatId} onChatUpdated={onChatUpdated} />;
};

export default Chat;
