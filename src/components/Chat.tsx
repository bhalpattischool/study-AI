
import React, { useState, useRef, useEffect } from 'react';
import { chatDB, Message as MessageType } from '@/lib/db';
import { generateResponse } from '@/lib/gemini';
import { toast } from "sonner";
import Message from './Message';
import EmptyChatUI from './EmptyChatUI';
import ChatFooter from './ChatFooter';
import MessageLimitAlert from './MessageLimitAlert';
import StudyFeatures from './StudyFeatures';
import { useAuth } from '@/contexts/AuthContext';
import { getTimeBasedGreeting } from '@/utils/timeUtils';

interface ChatProps {
  chatId: string;
  onChatUpdated?: () => void;
}

const FREE_MESSAGE_LIMIT = 5;

const Chat: React.FC<ChatProps> = ({ chatId, onChatUpdated }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser, messageLimitReached, setMessageLimitReached } = useAuth();

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      const chat = await chatDB.getChat(chatId);
      if (chat) {
        setMessages(chat.messages);
        scrollToBottom();
        
        // Check if unauthenticated user has reached message limit
        if (!currentUser && chat.messages.filter(m => m.role === 'user').length >= FREE_MESSAGE_LIMIT) {
          setMessageLimitReached(true);
        }
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
    
    // Check message limit for unauthenticated users
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (!currentUser && userMessageCount >= FREE_MESSAGE_LIMIT) {
      setMessageLimitReached(true);
      setShowLimitAlert(true);
      return;
    }

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
      
      // Check if user has reached limit after this exchange
      if (!currentUser && userMessageCount + 1 >= FREE_MESSAGE_LIMIT) {
        setMessageLimitReached(true);
        setShowLimitAlert(true);
      }
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

  const handleFeatureSelect = (prompt: string) => {
    handleSend(prompt);
  };

  const getWelcomeMessage = () => {
    const greeting = getTimeBasedGreeting();
    const username = currentUser?.displayName || "";
    return `${greeting}${username ? ', ' + username : ''}! How can I assist you with your studies today?`;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-purple-50 dark:from-gray-800 dark:to-gray-900">
      {showLimitAlert && (
        <MessageLimitAlert onClose={() => setShowLimitAlert(false)} />
      )}
      
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="pb-48 px-4 pt-4">
            <EmptyChatUI 
              onCreateImage={() => handleSend("Help me understand quantum physics concepts")}
              onSurpriseMe={() => handleSend("Explain machine learning in simple terms")}
              onAnalyzeImages={() => handleSend("Give me a study plan for IELTS exam")}
              onSummarizeText={() => handleSend("Summarize the key concepts of organic chemistry")}
              onMore={() => {}}
            />
            
            <div className="my-6 max-w-3xl mx-auto">
              <StudyFeatures onFeatureSelect={handleFeatureSelect} />
            </div>
            
            <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-6">
              <h2 className="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Getting Started</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Welcome to Study AI! Ask me any study-related question, or try one of these:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
                <li>"Create a study schedule for my final exams"</li>
                <li>"Explain the process of photosynthesis"</li>
                <li>"What are the key events of World War II?"</li>
                <li>"Help me solve this math problem: ..."</li>
                <li>"Give me practice questions for my biology test"</li>
              </ul>
            </div>
          </div>
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
        isDisabled={isResponding || messageLimitReached}
      />
    </div>
  );
};

export default Chat;
