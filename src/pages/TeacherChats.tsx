
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TeacherChatList from '@/components/teacher/TeacherChatList';
import TeacherChatSearch from '@/components/teacher/TeacherChatSearch';
import EmptySearch from '@/components/teacher/EmptySearch';
import { useTeacherChats } from '@/hooks/useTeacherChats';

const TeacherChats = () => {
  const navigate = useNavigate();
  const {
    chats,
    isLoading,
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
    cancelEditing
  } = useTeacherChats();

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
            <TeacherChatSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {isDataLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              </div>
            ) : chats.length === 0 ? (
              <EmptySearch searchTerm={searchTerm} />
            ) : (
              <TeacherChatList
                chats={chats}
                isDataLoading={isDataLoading}
                editingChatId={editingChatId}
                editingChatTitle={editingChatTitle}
                onChatClick={handleChatClick}
                onEditChat={handleEditChat}
                onDeleteChat={handleDeleteChat}
                onEditingTitleChange={setEditingChatTitle}
                onSaveEdit={saveEditedChat}
                onCancelEdit={cancelEditing}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherChats;
