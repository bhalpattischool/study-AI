
import { ref, push, set, get, onValue, update, remove } from "firebase/database";
import { database, auth } from './config';

// Generate a unique chat ID for two users
export const getChatId = (uid1: string, uid2: string) => {
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

// Create a new group chat
export const createChatGroup = async (name: string, members: {[uid: string]: boolean}) => {
  try {
    const groupsRef = ref(database, 'groups');
    const newGroupRef = push(groupsRef);
    const groupId = newGroupRef.key;
    
    if (!groupId) {
      throw new Error("Failed to generate group ID");
    }
    
    // Add creator as admin by default
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      throw new Error("User must be logged in to create a group");
    }
    
    const admins = {
      [currentUserUid]: true
    };
    
    // Create welcome message
    const welcomeMessage = {
      sender: "system",
      senderName: "System",
      text: `Welcome to ${name}!`,
      timestamp: Date.now()
    };
    
    // Set group data
    await set(ref(database, `groups/${groupId}`), {
      name,
      members,
      admins,
      createdAt: Date.now(),
      createdBy: currentUserUid
    });
    
    // Add welcome message
    const messagesRef = ref(database, `groups/${groupId}/messages`);
    await push(messagesRef, welcomeMessage);
    
    return groupId;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

// Send a message (works for both 1-on-1 and group chats)
export const sendMessage = async (chatId: string, senderUid: string, text: string, isGroup: boolean) => {
  try {
    // Get sender's display name
    const senderSnapshot = await get(ref(database, `users/${senderUid}`));
    const senderName = senderSnapshot.exists() 
      ? senderSnapshot.val().displayName || `User_${senderUid.substring(0, 5)}`
      : `User_${senderUid.substring(0, 5)}`;
    
    // Create message object
    const message = {
      sender: senderUid,
      senderName,
      text,
      timestamp: Date.now(),
      expiresAt: Date.now() + (48 * 60 * 60 * 1000), // 48 hours in milliseconds
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

// Get user's 1-on-1 chats
export const getUserChats = async (userId: string) => {
  try {
    const chatsSnapshot = await get(ref(database, 'chats'));
    if (!chatsSnapshot.exists()) {
      return [];
    }
    
    const chatsData = chatsSnapshot.val();
    const userChats = Object.entries(chatsData)
      .filter(([chatId]) => chatId.includes(userId))
      .map(async ([chatId, chatData]: [string, any]) => {
        // Extract the other user's ID
        const otherUserId = chatId.replace(userId, '').replace('_', '');
        const userSnapshot = await get(ref(database, `users/${otherUserId}`));
        let userName = 'Unknown User';
        
        if (userSnapshot.exists()) {
          userName = userSnapshot.val().displayName || `User_${otherUserId.substring(0, 5)}`;
        }
        
        return {
          id: chatId,
          type: 'user',
          name: userName,
          lastMessage: chatData.lastMessage || '',
          timestamp: chatData.lastMessageTime || 0,
          partnerId: otherUserId
        };
      });
    
    return await Promise.all(userChats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
};

// Get user's group chats
export const getUserGroups = async (userId: string) => {
  try {
    const groupsSnapshot = await get(ref(database, 'groups'));
    if (!groupsSnapshot.exists()) {
      return [];
    }
    
    const groupsData = groupsSnapshot.val();
    const userGroups = Object.entries(groupsData)
      .filter(([_, groupData]: [string, any]) => {
        return groupData.members && groupData.members[userId];
      })
      .map(([groupId, groupData]: [string, any]) => {
        return {
          id: groupId,
          type: 'group',
          name: groupData.name || 'Unnamed Group',
          lastMessage: groupData.lastMessage || '',
          timestamp: groupData.lastMessageTime || groupData.createdAt || 0,
        };
      });
    
    return userGroups;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
};

// Get details of a specific group
export const getGroupDetails = async (groupId: string) => {
  try {
    const groupSnapshot = await get(ref(database, `groups/${groupId}`));
    if (!groupSnapshot.exists()) {
      throw new Error("Group not found");
    }
    
    return groupSnapshot.val();
  } catch (error) {
    console.error("Error fetching group details:", error);
    throw error;
  }
};

// Get a user's display name
export const getUserName = async (userId: string) => {
  try {
    const userSnapshot = await get(ref(database, `users/${userId}`));
    if (!userSnapshot.exists()) {
      return null;
    }
    
    return userSnapshot.val().displayName || `User_${userId.substring(0, 5)}`;
  } catch (error) {
    console.error("Error fetching user name:", error);
    return null;
  }
};

// Add or remove a user from a group
export const updateGroupMembership = async (groupId: string, userId: string, isAdding: boolean) => {
  try {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      throw new Error("You must be logged in to update group membership");
    }
    
    // Check if current user is an admin
    const groupSnapshot = await get(ref(database, `groups/${groupId}`));
    if (!groupSnapshot.exists()) {
      throw new Error("Group not found");
    }
    
    const groupData = groupSnapshot.val();
    if (!groupData.admins || !groupData.admins[currentUserUid]) {
      throw new Error("Only group admins can update membership");
    }
    
    // Update membership
    if (isAdding) {
      await update(ref(database, `groups/${groupId}/members`), {
        [userId]: true
      });
    } else {
      // Remove member
      await update(ref(database, `groups/${groupId}/members/${userId}`), null);
    }
    
    return true;
  } catch (error) {
    console.error("Error updating group membership:", error);
    throw error;
  }
};

// Start a 1-on-1 chat with another user
export const startChat = async (currentUserId: string, otherUserId: string) => {
  try {
    const chatId = getChatId(currentUserId, otherUserId);
    
    // Check if chat already exists
    const chatSnapshot = await get(ref(database, `chats/${chatId}`));
    if (!chatSnapshot.exists()) {
      // Create new chat
      await set(ref(database, `chats/${chatId}`), {
        participants: {
          [currentUserId]: true,
          [otherUserId]: true
        },
        createdAt: Date.now()
      });
    }
    
    return chatId;
  } catch (error) {
    console.error("Error starting chat:", error);
    throw error;
  }
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

// Toggle save status of a message
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

// Delete a group chat (only for admins)
export const deleteGroup = async (groupId: string) => {
  try {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) {
      throw new Error("You must be logged in to delete a group");
    }
    
    // Check if the current user is an admin
    const groupSnapshot = await get(ref(database, `groups/${groupId}`));
    if (!groupSnapshot.exists()) {
      throw new Error("Group not found");
    }
    
    const groupData = groupSnapshot.val();
    if (!groupData.admins || !groupData.admins[currentUserUid]) {
      throw new Error("Only group admins can delete the group");
    }
    
    // Delete the entire group
    await remove(ref(database, `groups/${groupId}`));
    return true;
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
};
