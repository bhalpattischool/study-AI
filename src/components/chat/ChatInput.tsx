
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Image as ImageIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ((message.trim() || file) && !isLoading) {
      onSendMessage(message.trim(), file ? file : undefined);
      setMessage('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2 bg-white dark:bg-gray-800 items-end">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message or select image..."
        className="min-h-[50px] max-h-[120px] flex-1 resize-none"
        disabled={isLoading}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{display:'none'}}
        onChange={onFileChange}
      />
      <Button
        type="button"
        size="icon"
        className="self-end h-10 w-10"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        title="Attach image"
      >
        <ImageIcon className="h-5 w-5" />
      </Button>
      <Button
        type="submit"
        size="icon"
        className="self-end h-10 w-10"
        disabled={(!message.trim() && !file) || isLoading}
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
