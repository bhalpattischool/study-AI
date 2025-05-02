
import { ref, push, set, get, update, remove } from "firebase/database";
import { database, auth } from '../config';

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
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours expiration
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
