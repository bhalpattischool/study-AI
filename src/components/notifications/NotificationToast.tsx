
import React, { useEffect } from 'react';
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { useNotificationContext } from '@/contexts/NotificationContext';

const NotificationToast: React.FC = () => {
  const { notifications } = useNotificationContext();
  
  // Show toast when a new unread notification arrives
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      const latestNotification = unreadNotifications[0];
      
      // Check if this notification has been shown as a toast already
      const shownToasts = JSON.parse(localStorage.getItem('shown_notification_toasts') || '[]');
      
      if (!shownToasts.includes(latestNotification.id)) {
        // Show toast for this notification
        toast(latestNotification.title, {
          description: latestNotification.message,
          icon: <Bell size={16} className="text-purple-500" />,
          duration: 5000,
        });
        
        // Mark this notification as shown in a toast
        localStorage.setItem(
          'shown_notification_toasts', 
          JSON.stringify([...shownToasts, latestNotification.id])
        );
      }
    }
  }, [notifications]);
  
  // Component doesn't render anything directly
  return null;
};

export default NotificationToast;
