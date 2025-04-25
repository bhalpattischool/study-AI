
import { useState, useEffect } from 'react';
import { getGroupDetails, getUserName, listenForMessages, sendMessage } from '@/lib/firebase';
import { toast } from "sonner";

// Export the sendMessage function from firebase for convenience
export { sendMessage } from '@/lib/firebase';

// Re-export the useChat hook from the .ts file for backward compatibility
export { useChat, useChatData } from './useChat.ts';
