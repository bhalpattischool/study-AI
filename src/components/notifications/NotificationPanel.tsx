
import React from 'react';
import { format } from 'date-fns';
import { useNotification } from '@/contexts/NotificationContext';
import { Notification } from '@/hooks/useNotifications';
import { Bell, Check, Trash2, VolumeX, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { 
    notifications, 
    markAllAsRead, 
    markAsRead, 
    clearNotifications, 
    removeNotification: deleteNotification,
    playSound,
    setPlaySound
  } = useNotification();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [notificationToDelete, setNotificationToDelete] = React.useState<string | null>(null);

  const handleActionClick = (notification: Notification) => {
    markAsRead(notification.id);
    onClose();

    // Navigate based on notification type
    if (notification.type === 'group' && notification.groupId) {
      navigate(`/chat?id=${notification.groupId}`);
    } else if (notification.type === 'message' && notification.chatId) {
      navigate(`/chat?id=${notification.chatId}`);
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (notificationToDelete) {
      deleteNotification(notificationToDelete);
      setNotificationToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setNotificationToDelete(null);
    setDeleteDialogOpen(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yyyy');
    }
  };

  return (
    <>
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 border border-purple-200 dark:border-purple-900 animate-fade-in">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="font-semibold">आपके सूचनाएं</h3>
          </div>
          <div className="flex items-center gap-2">
            {typeof playSound !== 'undefined' && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => typeof setPlaySound === 'function' && setPlaySound(!playSound)}
                title={playSound ? "ध्वनि बंद करें" : "ध्वनि चालू करें"}
              >
                {playSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={markAllAsRead}
              title="सभी को पढ़ा हुआ मार्क करें"
            >
              <Check size={16} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={clearNotifications}
              title="सभी सूचनाएं हटाएं"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="max-h-[70vh] h-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <p>आपके पास कोई सूचना नहीं है</p>
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    !(notification.read || notification.isRead) ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                >
                  <div className="flex">
                    <div className="mr-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.type === 'group' 
                          ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                          : notification.type === 'system'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300'
                          : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300'
                      }`}>
                        {notification.senderName ? notification.senderName.charAt(0).toUpperCase() : '🔔'}
                      </div>
                    </div>
                    <div className="flex-1" onClick={() => handleActionClick(notification)}>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">{formatTime(notification.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 ml-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={(e) => handleDeleteClick(notification.id, e)}
                      title="हटाएं"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex mt-2 justify-end">
                    {!(notification.read || notification.isRead) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="h-7 text-xs"
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>सूचना हटाएं</AlertDialogTitle>
            <AlertDialogDescription>
              क्या आप इस सूचना को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती है।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>रद्द करें</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              हटाएं
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotificationPanel;
