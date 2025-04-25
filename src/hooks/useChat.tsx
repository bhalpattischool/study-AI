
import { useState, useEffect } from 'react';
import { getGroupDetails, getUserName, listenForMessages, sendMessage } from '@/lib/firebase';
import { toast } from "sonner";

// Export the sendMessage function from firebase for convenience
export { sendMessage } from '@/lib/firebase';

// Re-export the hooks from useChat.ts
export { useChat, useChatData, useGroupChat } from './useChat.ts';
