
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { chatDB } from '@/lib/db';
import { Chat } from '@/lib/db';
import { toast } from "sonner";

export const useTeacherChats = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatTitle, setEditingChatTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    } else if (currentUser) {
      loadTeacherChats();
    }
  }, [currentUser, authLoading, navigate]);

  const loadTeacherChats = async () => {
    try {
      setIsDataLoading(true);
      const allChats = await chatDB.getAllChats();
      
      // Filter for teacher-related chats
      const teacherChats = allChats.filter(chat => 
        chat.title.toLowerCase().includes('teach') || 
        chat.title.toLowerCase().includes('learn') ||
        chat.title.toLowerCase().includes('educat') ||
        chat.title.toLowerCase().includes('school') ||
        chat.title.toLowerCase().includes('class') ||
        chat.messages.some(msg => 
          msg.content.toLowerCase().includes('teach') ||
          msg.content.toLowerCase().includes('learn') ||
          msg.content.toLowerCase().includes('educat') ||
          msg.content.toLowerCase().includes('school') ||
          msg.content.toLowerCase().includes('class')
        )
      );
      
      // Sort by timestamp (newest first)
      teacherChats.sort((a, b) => b.timestamp - a.timestamp);
      
      setChats(teacherChats);
    } catch (error) {
      console.error('Error loading teacher chats:', error);
      toast.error('Failed to load teacher chats');
    } finally {
      setIsDataLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteChat = async (chatId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      await chatDB.deleteChat(chatId);
      toast.success('Chat deleted successfully');
      
      // Refresh the list
      setChats(chats.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  };

  const handleChatClick = (chatId: string) => {
    navigate('/', { state: { activeChatId: chatId } });
  };

  const handleEditChat = async (chatId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Find the chat and set it for editing
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setEditingChatId(chatId);
      setEditingChatTitle(chat.title);
    }
  };

  const saveEditedChat = async () => {
    if (!editingChatId || !editingChatTitle.trim()) {
      toast.error('Chat title cannot be empty');
      return;
    }

    try {
      const chatToUpdate = chats.find(chat => chat.id === editingChatId);
      if (chatToUpdate) {
        const updatedChat = { ...chatToUpdate, title: editingChatTitle };
        await chatDB.saveChat(updatedChat);
        
        // Update local state
        setChats(chats.map(chat => 
          chat.id === editingChatId 
            ? { ...chat, title: editingChatTitle } 
            : chat
        ));
        
        setEditingChatId(null);
        toast.success('Chat updated successfully');
      }
    } catch (error) {
      console.error('Error updating chat:', error);
      toast.error('Failed to update chat');
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return {
    chats: filteredChats,
    isLoading: authLoading,
    isDataLoading,
    searchTerm,
    setSearchTerm,
    editingChatId,
    editingChatTitle,
    setEditingChatTitle,
    handleChatClick,
    handleEditChat,
    handleDeleteChat,
    saveEditedChat,
    formatDate,
    formatTime,
    cancelEditing: () => setEditingChatId(null)
  };
};
