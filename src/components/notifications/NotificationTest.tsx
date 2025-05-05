
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationTest: React.FC = () => {
  const { showNotification } = useNotifications();

  const testWebNotification = () => {
    showNotification({
      title: "Test Notification",
      message: "This is a test notification from Study AI",
      duration: 5000
    });
  };

  const testLongNotification = () => {
    showNotification({
      title: "समूह संदेश",
      message: "अजित: क्या हाल है? आप कैसे हैं?",
      duration: 8000
    });
  };

  return (
    <div className="flex flex-col gap-3 max-w-xs mx-auto my-4">
      <Button onClick={testWebNotification}>
        Test Notification
      </Button>
      <Button variant="outline" onClick={testLongNotification}>
        हिंदी में परीक्षण सूचना
      </Button>
    </div>
  );
};

export default NotificationTest;
