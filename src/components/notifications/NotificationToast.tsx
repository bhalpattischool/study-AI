
import React, { useEffect, useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotificationToast: React.FC = () => {
  const { notifications, markAsRead, deleteNotification } = useNotification();
  const [visibleNotification, setVisibleNotification] = useState<null | {
    id: string;
    title: string;
    message: string;
    chatId?: string;
    groupId?: string;
  }>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for new unread notifications
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length > 0 && !visibleNotification) {
      const notification = unreadNotifications[0];
      setVisibleNotification({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        chatId: notification.chatId,
        groupId: notification.groupId
      });

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, visibleNotification]);

  const handleClose = () => {
    if (visibleNotification) {
      // Only mark as read but don't delete
      markAsRead(visibleNotification.id);
      setVisibleNotification(null);
    }
  };

  const handleClick = () => {
    if (!visibleNotification) return;
    
    // Only mark as read but don't delete
    markAsRead(visibleNotification.id);
    
    // Navigate based on notification type
    if (visibleNotification.groupId) {
      navigate(`/chat?id=${visibleNotification.groupId}`);
    } else if (visibleNotification.chatId) {
      navigate(`/chat?id=${visibleNotification.chatId}`);
    }
    
    setVisibleNotification(null);
  };

  return (
    <AnimatePresence>
      {visibleNotification && (
        <motion.div
          key={visibleNotification.id}
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed left-1/2 top-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-purple-200 dark:border-purple-900 p-3 w-80 max-w-[90vw]"
        >
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">{visibleNotification.title}</h4>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {visibleNotification.message}
          </p>
          <div className="mt-2">
            <button
              onClick={handleClick}
              className="w-full text-center text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
            >
              View
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
