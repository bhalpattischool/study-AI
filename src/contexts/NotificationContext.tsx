
import React, { createContext, useContext } from 'react';
import { useNotifications, Notification } from '../hooks/useNotifications';

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
