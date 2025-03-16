
import React, { useState, useRef, useEffect } from 'react';
import { chatDB, Message as MessageType } from '@/lib/db';
import { generateResponse } from '@/lib/gemini';
import { toast } from "sonner";
import Message from './Message';
import EmptyChatUI from './EmptyChatUI';
import ChatFooter from './ChatFooter';

interface ChatProps {
  chatId: string;
  onChatUpdated?: () => void;
}

const Chat: React.FC<ChatProps> = ({ chatId, onChatUpdated }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      const chat = await chatDB.getChat(chatId);
      if (chat) {
        setMessages(chat.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (input: string) => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage = await chatDB.addMessage(chatId, input.trim(), 'user');
      setMessages((prev) => [...prev, userMessage]);
      scrollToBottom();
      
      if (onChatUpdated) onChatUpdated();

      // Get AI response
      const response = await generateResponse(input.trim());
      
      // Add bot message
      const botMessage = await chatDB.addMessage(chatId, response, 'bot');
      setMessages((prev) => [...prev, botMessage]);
      scrollToBottom();
      
      if (onChatUpdated) onChatUpdated();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageEdited = async () => {
    await loadMessages();
    if (onChatUpdated) onChatUpdated();
  };

  const handleMessageDeleted = async () => {
    await loadMessages();
    if (onChatUpdated) onChatUpdated();
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyChatUI 
            onCreateImage={() => handleSuggestionClick("Help me understand quantum physics concepts")}
            onSurpriseMe={() => handleSuggestionClick("Explain machine learning in simple terms")}
            onAnalyzeImages={() => handleSuggestionClick("Give me a study plan for IELTS exam")}
            onSummarizeText={() => handleSuggestionClick("Summarize the key concepts of organic chemistry")}
            onMore={() => {}}
          />
        ) : (
          <div className="pb-48">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                onEdited={handleMessageEdited}
                onDeleted={handleMessageDeleted}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <ChatFooter onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default Chat;
