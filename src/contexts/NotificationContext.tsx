
import React, { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useAuth } from './AuthContext';
import { onMessage } from '@/lib/firebase';
import notificationSound from '/notification-sound.mp3';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  type: 'message' | 'system' | 'group';
  senderId?: string;
  senderName?: string;
  chatId?: string;
  groupId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  deleteNotification: (id: string) => void;
  playSound: boolean;
  setPlaySound: (play: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [playSound, setPlaySound] = useState(true);
  const { currentUser } = useAuth();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const lastNotificationRef = React.useRef<{senderId?: string, text?: string, timestamp?: number}>({});

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Listen for new messages from Firebase
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onMessage((message) => {
      console.log('New message received:', message);
      
      // Don't notify for user's own messages
      if (message.sender === currentUser.uid) return;
      
      // Prevent duplicate notifications by checking with last notification
      const currentTime = Date.now();
      const isDuplicate = 
        message.sender === lastNotificationRef.current.senderId &&
        message.text === lastNotificationRef.current.text &&
        lastNotificationRef.current.timestamp &&
        currentTime - lastNotificationRef.current.timestamp < 5000; // 5 seconds threshold
      
      if (isDuplicate) {
        console.log('Skipping duplicate notification');
        return;
      }
      
      // Update last notification reference
      lastNotificationRef.current = {
        senderId: message.sender,
        text: message.text,
        timestamp: currentTime
      };
      
      // Create notification for new messages
      addNotification({
        title: message.isGroup ? `${message.senderName} in ${message.groupName || 'Group'}` : message.senderName || 'New Message',
        message: message.text?.startsWith('[image:') ? '📷 Sent a photo' : message.text || '',
        type: message.isGroup ? 'group' : 'message',
        senderId: message.sender,
        senderName: message.senderName,
        chatId: message.chatId,
        groupId: message.isGroup ? message.chatId : undefined
      });
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  // Play sound when new notification arrives
  useEffect(() => {
    if (unreadCount > 0 && playSound && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.log('Error playing notification sound:', error);
        });
      } catch (error) {
        console.error('Failed to play notification sound', error);
      }
    }
  }, [unreadCount, playSound]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: nanoid(),
      timestamp: Date.now(),
      isRead: false,
    };

    // Check for duplicates within the last 5 seconds
    const isDuplicate = notifications.some(
      n => n.senderId === notification.senderId &&
           n.message === notification.message &&
           Date.now() - n.timestamp < 5000
    );

    if (isDuplicate) {
      console.log('Duplicate notification detected and prevented');
      return;
    }

    setNotifications(prev => [newNotification, ...prev]);

    // Save to local storage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([newNotification, ...storedNotifications]));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    
    // Update local storage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify(
      storedNotifications.map((notification: Notification) => ({ ...notification, isRead: true }))
    ));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
    
    // Update local storage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify(
      storedNotifications.map((notification: Notification) => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    
    // Update local storage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify(
      storedNotifications.filter((notification: Notification) => notification.id !== id)
    ));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', '[]');
  };

  // Load notifications from local storage on mount
  useEffect(() => {
    try {
      const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      setNotifications(storedNotifications);
    } catch (error) {
      console.error('Failed to load notifications from localStorage', error);
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAllAsRead,
    markAsRead,
    clearNotifications,
    deleteNotification,
    playSound,
    setPlaySound,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
