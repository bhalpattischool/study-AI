
import { ref, push, set, get, onValue, update, remove } from "firebase/database";
import { database, auth } from '../config';

// Send a message (works for both 1-on-1 and group chats)
export const sendMessage = async (chatId: string, senderUid: string, text: string, isGroup: boolean) => {
  try {
    // Get sender's display name
    const senderSnapshot = await get(ref(database, `users/${senderUid}`));
    const senderName = senderSnapshot.exists() 
      ? senderSnapshot.val().displayName || `User_${senderUid.substring(0, 5)}`
      : `User_${senderUid.substring(0, 5)}`;
    
    // Create message object with 24-hour expiration
    const message = {
      sender: senderUid,
      senderName,
      text,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours in milliseconds
      saved: false
    };
    
    // Path depends on whether it's a group or 1-on-1 chat
    const path = isGroup ? `groups/${chatId}/messages` : `chats/${chatId}/messages`;
    const messagesRef = ref(database, path);
    
    // Add message
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, message);
    
    // Update last message for easier retrieval
    const lastMessagePath = isGroup ? `groups/${chatId}` : `chats/${chatId}`;
    await update(ref(database, lastMessagePath), {
      lastMessage: text,
      lastMessageTime: message.timestamp
    });
    
    return newMessageRef.key;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Listen for messages in real-time
export const listenForMessages = (chatId: string, isGroup: boolean, callback: (messages: any[]) => void) => {
  const path = isGroup ? `groups/${chatId}/messages` : `chats/${chatId}/messages`;
  const messagesRef = ref(database, path);
  
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      const messagesList = Object.keys(messagesData).map(key => ({
        id: key,
        ...messagesData[key]
      }));
      
      // Filter out expired messages that aren't saved
      const currentTime = Date.now();
      const filteredMessages = messagesList.filter(msg => 
        msg.saved === true || !msg.expiresAt || currentTime < msg.expiresAt
      );

      // Sort by timestamp
      filteredMessages.sort((a, b) => a.timestamp - b.timestamp);
      
      callback(filteredMessages);
    } else {
      callback([]);
    }
  });
  
  return unsubscribe;
};

// Delete a specific message
export const deleteMessage = async (chatId: string, messageId: string, isGroup: boolean) => {
  try {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      throw new Error("You must be logged in to delete messages");
    }

    // Path depends on whether it's a group or 1-on-1 chat
    const path = isGroup ? `groups/${chatId}/messages/${messageId}` : `chats/${chatId}/messages/${messageId}`;
    
    // First check if the user has permission to delete this message
    const messageSnapshot = await get(ref(database, path));
    if (!messageSnapshot.exists()) {
      throw new Error("Message not found");
    }
    
    const messageData = messageSnapshot.val();
    
    // Check if user is the sender or a group admin
    let canDelete = messageData.sender === currentUserUid;
    
    if (isGroup && !canDelete) {
      // Check if user is a group admin
      const groupSnapshot = await get(ref(database, `groups/${chatId}`));
      if (groupSnapshot.exists() && groupSnapshot.val().admins && groupSnapshot.val().admins[currentUserUid]) {
        canDelete = true;
      }
    }
    
    if (!canDelete) {
      throw new Error("You don't have permission to delete this message");
    }
    
    // Delete the message
    await remove(ref(database, path));
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Toggle save status of a message (prevents auto-deletion)
export const toggleSaveMessage = async (chatId: string, messageId: string, isGroup: boolean) => {
  try {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      throw new Error("You must be logged in to save messages");
    }

    // Path depends on whether it's a group or 1-on-1 chat
    const path = isGroup ? `groups/${chatId}/messages/${messageId}` : `chats/${chatId}/messages/${messageId}`;
    
    // Get current message data
    const messageSnapshot = await get(ref(database, path));
    if (!messageSnapshot.exists()) {
      throw new Error("Message not found");
    }
    
    const messageData = messageSnapshot.val();
    
    // Toggle saved status
    const newSavedStatus = !messageData.saved;
    
    // Update the message
    await update(ref(database, path), { saved: newSavedStatus });
    
    return newSavedStatus;
  } catch (error) {
    console.error("Error toggling message save status:", error);
    throw error;
  }
};
