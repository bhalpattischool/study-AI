
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LockKeyhole, LogIn, UserPlus } from 'lucide-react';

interface MessageLimitAlertProps {
  onClose: () => void;
}

const MessageLimitAlert: React.FC<MessageLimitAlertProps> = ({ onClose }) => {
  return (
    <Alert className="max-w-3xl mx-auto mt-4 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 animate-in fade-in-50 slide-in-from-top-5 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="bg-purple-100 dark:bg-purple-800/50 rounded-full p-2 flex-shrink-0">
          <LockKeyhole className="h-5 w-5 text-purple-600 dark:text-purple-300" />
        </div>
        
        <div className="flex-1">
          <AlertTitle className="text-purple-800 dark:text-purple-300">
            मैसेज लिमिट पूरी हो गई
          </AlertTitle>
          <AlertDescription className="text-purple-700/80 dark:text-purple-400/80 mt-1">
            Study AI के साथ चैट जारी रखने के लिए कृपया लॉगिन करें या नया अकाउंट बनाएं। लॉगिन करने के बाद आप बिना किसी लिमिट के चैट कर सकते हैं।
          </AlertDescription>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-auto"
            onClick={onClose}
          >
            बाद में
          </Button>
          <Button 
            className="flex-1 sm:flex-auto"
            asChild
          >
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-2" />
              लॉगिन करें
            </Link>
          </Button>
          <Button
            variant="secondary"
            className="flex-1 sm:flex-auto"
            asChild
          >
            <Link to="/signup">
              <UserPlus className="h-4 w-4 mr-2" />
              रजिस्टर करें
            </Link>
          </Button>
        </div>
      </div>
    </Alert>
  );
};

export default MessageLimitAlert;

