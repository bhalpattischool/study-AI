
import { useState, useEffect } from 'react';

// Define the notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
  type?: 'group' | 'message' | 'system'; // Added type property
  groupId?: string; // Added groupId property
  chatId?: string; // Added chatId property
  senderName?: string; // Added senderName property
  isRead?: boolean; // For compatibility with existing code
}

// Sample notifications for demonstration
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'पाठ्यक्रम अपडेट',
    message: 'आपका गणित का पाठ्यक्रम अपडेट किया गया है। नए अध्याय जोड़े गए हैं।',
    read: false,
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    type: 'system'
  },
  {
    id: '2',
    title: 'अध्ययन अनुस्मारक',
    message: 'आपका दैनिक अध्ययन लक्ष्य अभी तक पूरा नहीं हुआ है। आज के लिए 30 मिनट अध्ययन बाकी है।',
    read: false,
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    type: 'system'
  },
  {
    id: '3',
    title: 'क्विज़ परिणाम',
    message: 'बधाई हो! आपने विज्ञान क्विज़ में 90% स्कोर किया है। अपने परिणाम देखें।',
    read: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    type: 'system'
  },
  {
    id: '4',
    title: 'शिक्षक संदेश',
    message: 'आपके शिक्षक श्री कुमार ने आपके प्रोजेक्ट पर टिप्पणी छोड़ी है। जवाब दें।',
    read: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    type: 'message',
    senderName: 'Kumar'
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Try to load notifications from localStorage
    const savedNotifications = localStorage.getItem('study_ai_notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : DEMO_NOTIFICATIONS;
  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('study_ai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Mark a specific notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...notification,
      read: false,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Play notification sound
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.play();
    } catch (err) {
      console.error('Failed to play notification sound:', err);
    }
  };

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearNotifications
  };
}
