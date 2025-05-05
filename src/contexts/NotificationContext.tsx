
import React, { createContext, useContext, useEffect } from 'react';
import { useNotifications, Notification } from '../hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';

// Create context for notifications
interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  playSound?: boolean;
  setPlaySound?: (value: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationUtils = useNotifications();

  // Listen for Supabase channel events as a backup for notifications
  // This helps with mobile APK reliability
  useEffect(() => {
    try {
      console.log("Setting up Supabase notification channel");
      
      // Create a channel for notification events
      const channel = supabase.channel('notification-events');
      
      channel
        .on('broadcast', { event: 'new-notification' }, (payload) => {
          try {
            console.log("Received notification via Supabase channel:", payload);
            
            if (payload.payload && 
                typeof payload.payload === 'object' && 
                'notification' in payload.payload) {
              
              const notification = payload.payload.notification as Omit<Notification, 'id' | 'timestamp' | 'read'>;
              notificationUtils.addNotification(notification);
            }
          } catch (error) {
            console.error("Error processing Supabase notification:", error);
          }
        })
        .subscribe((status) => {
          console.log("Supabase notification channel status:", status);
        });
        
      return () => {
        console.log("Cleaning up Supabase notification channel");
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error setting up Supabase notification channel:", error);
    }
  }, [notificationUtils.addNotification]);

  return (
    <NotificationContext.Provider value={notificationUtils}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

// Re-export the Notification type for convenience
export type { Notification } from '../hooks/useNotifications';
export { useNotifications } from '../hooks/useNotifications';

// Alias for backward compatibility
export const useNotification = useNotificationContext;
