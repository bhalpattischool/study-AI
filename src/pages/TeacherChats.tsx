
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { chatDB } from '@/lib/db';
import { Chat, Message } from '@/lib/db';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, School, Calendar, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const TeacherChats = () => {
  const { currentUser, isLoading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    } else if (currentUser) {
      loadTeacherChats();
    }
  }, [currentUser, isLoading, navigate]);

  const loadTeacherChats = async () => {
    try {
      setIsDataLoading(true);
      const allChats = await chatDB.getAllChats();
      
      // Filter for teacher-related chats
      // (In a real app, you would have a teacher flag on the chat or message)
      // For now, let's filter chats that mention teaching, learning, or education
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
    e?.preventDefault();
    e?.stopPropagation();
    
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

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Teacher Chats</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search teacher conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isDataLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-12">
                <School className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  No teacher conversations found
                </h3>
                <p className="text-gray-400 dark:text-gray-500 mt-2">
                  {searchTerm ? "Try a different search term" : "Start a conversation with a teacher to see it here"}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/')}
                >
                  Start a Teacher Chat
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="grid gap-4">
                  {filteredChats.map((chat) => (
                    <div 
                      key={chat.id}
                      onClick={() => handleChatClick(chat.id)}
                      className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <School className="h-5 w-5 text-green-500 mr-2" />
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {chat.title}
                            </h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{formatDate(chat.timestamp)} at {formatTime(chat.timestamp)}</span>
                          <span className="mx-2">•</span>
                          <span>{chat.messages.length} messages</span>
                        </div>
                        
                        {chat.messages.length > 0 && (
                          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {chat.messages[chat.messages.length - 1].content}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherChats;
