import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { useNotificationContext } from '@/contexts/NotificationContext';

const NotificationToast: React.FC = () => {
  const { notifications } = useNotificationContext();
  const [shownNotifications, setShownNotifications] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shown_notification_toasts');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading shown notifications from storage:", error);
      return [];
    }
  });
  
  // Clean up old notifications from storage periodically
  useEffect(() => {
    try {
      // Only keep notifications from the last 24 hours
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const recentNotifications = notifications.filter(n => n.timestamp >= oneDayAgo);
      
      if (recentNotifications.length !== notifications.length) {
        // Some notifications are older than 24 hours, clean up storage
        const recentIds = recentNotifications.map(n => n.id);
        const updatedShownNotifications = shownNotifications.filter(id => 
          recentIds.includes(id)
        );
        
        setShownNotifications(updatedShownNotifications);
        localStorage.setItem('shown_notification_toasts', JSON.stringify(updatedShownNotifications));
      }
    } catch (error) {
      console.error("Error cleaning up notifications:", error);
    }
  }, [notifications]);
  
  // Show toast when a new unread notification arrives
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length > 0) {
        // Sort by timestamp to get the most recent first
        const sortedUnread = [...unreadNotifications].sort((a, b) => b.timestamp - a.timestamp);
        const latestNotification = sortedUnread[0];
        
        // Check if this notification has been shown as a toast already
        if (!shownNotifications.includes(latestNotification.id)) {
          console.log("Showing toast for notification:", latestNotification);
          
          // Show toast for this notification
          toast(latestNotification.title, {
            description: latestNotification.message,
            icon: <Bell size={16} className="text-purple-500" />,
            duration: 5000,
          });
          
          // Mark this notification as shown in a toast
          const updatedShown = [...shownNotifications, latestNotification.id];
          setShownNotifications(updatedShown);
          
          try {
            localStorage.setItem('shown_notification_toasts', JSON.stringify(updatedShown));
          } catch (storageError) {
            console.error("Error saving to localStorage:", storageError);
          }
        }
      }
    } catch (error) {
      console.error("Error processing notifications for toast:", error);
    }
  }, [notifications, shownNotifications]);
  
  // Component doesn't render anything directly
  return null;
};

export default NotificationToast;
