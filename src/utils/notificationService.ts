
/**
 * A unified notification service that works across web browsers and WebView
 */

// Define notification types
export interface NotificationData {
  title: string;
  message: string;
  icon?: string;
  duration?: number;
}

// Keep track of active notifications
let activeNotifications: NotificationData[] = [];

// Function to check if we're in a WebView
export const isInWebView = (): boolean => {
  // Check for common WebView user agent patterns
  const ua = navigator.userAgent;
  return /wv/.test(ua) || /Android.*Version\/[0-9]/.test(ua) || window.Android !== undefined;
};

// Check if browser notifications are supported and permitted
export const areBrowserNotificationsSupported = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === "granted") return true;
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
};

// Show a notification using the best available method
export const showNotification = async (data: NotificationData): Promise<void> => {
  // Add to active notifications
  activeNotifications.push(data);
  
  // First try native WebView bridge if available
  if (window.Android?.showNotification) {
    console.log('Using Android WebView bridge for notification');
    window.Android.showNotification(data.title, data.message);
    return;
  }
  
  // Then try browser notifications
  const canUseSystemNotifications = await areBrowserNotificationsSupported();
  if (canUseSystemNotifications) {
    try {
      console.log('Using browser notification API');
      const notification = new Notification(data.title, {
        body: data.message,
        icon: data.icon || '/notification-icon.png'
      });
      
      // Auto-close the notification after duration
      if (data.duration) {
        setTimeout(() => notification.close(), data.duration);
      }
      
      return;
    } catch (error) {
      console.error('Failed to show browser notification:', error);
      // Fall through to UI notification
    }
  }

  console.log('Falling back to UI notification');
  // Finally, fall back to the notification context for UI notifications
  // This will be handled by NotificationContext
  
  // Play notification sound if available
  try {
    const audio = new Audio('/notification-sound.mp3');
    audio.play().catch(err => console.log('Could not play notification sound', err));
  } catch (err) {
    console.log('Error with notification sound', err);
  }
};

// Get current active notifications
export const getActiveNotifications = (): NotificationData[] => {
  return [...activeNotifications];
};

// Clear a specific notification
export const clearNotification = (index: number): void => {
  if (index >= 0 && index < activeNotifications.length) {
    activeNotifications.splice(index, 1);
  }
};

// Clear all notifications
export const clearAllNotifications = (): void => {
  activeNotifications = [];
};

// Declare WebView interface for TypeScript
declare global {
  interface Window {
    Android?: {
      showNotification: (title: string, message: string) => void;
    };
  }
}
