
import React, { useState, useRef, useEffect } from 'react';
import { chatDB, Message as MessageType } from '@/lib/db';
import { generateResponse } from '@/lib/gemini';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SendHorizonal, Loader2 } from "lucide-react";
import Message from './Message';

interface ChatProps {
  chatId: string;
  onChatUpdated?: () => void;
}

const Chat: React.FC<ChatProps> = ({ chatId, onChatUpdated }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage = await chatDB.addMessage(chatId, input.trim(), 'user');
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
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
      
      // Focus back to textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
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

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Gemini Chat</h1>
              <p className="text-muted-foreground">
                Start a conversation with the Gemini AI. Your messages will be stored locally.
              </p>
            </div>
          </div>
        ) : (
          <div className="pb-20">
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
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="resize-none min-h-[60px]"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-10 w-10 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizonal className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
