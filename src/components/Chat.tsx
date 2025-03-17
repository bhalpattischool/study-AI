
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
  const [isResponding, setIsResponding] = useState(false);
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
    if (!input.trim() || isLoading || isResponding) return;

    try {
      setIsLoading(true);
      setIsResponding(true);
      
      // Add user message
      const userMessage = await chatDB.addMessage(chatId, input.trim(), 'user');
      setMessages((prev) => [...prev, userMessage]);
      scrollToBottom();
      
      if (onChatUpdated) onChatUpdated();

      // Get current conversation history
      const currentChat = await chatDB.getChat(chatId);
      const chatHistory = currentChat?.messages || [];
      
      console.log("Sending chat with history length:", chatHistory.length);

      // Get AI response with complete conversation history
      const response = await generateResponse(input.trim(), chatHistory);
      
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
      setIsResponding(false);
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
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-indigo-500 border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-purple-300 border-l-transparent animate-spin animation-delay-300"></div>
                  </div>
                  <p className="mt-4 text-sm text-purple-700 dark:text-purple-300 font-medium animate-pulse">
                    Study AI is thinking...
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <ChatFooter 
        onSend={handleSend} 
        isLoading={isLoading} 
        isDisabled={isResponding}
      />
    </div>
  );
};

export default Chat;
