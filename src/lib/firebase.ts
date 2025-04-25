import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile 
} from "firebase/auth";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { 
  getDatabase, 
  ref as dbRef, 
  set, 
  get, 
  onValue, 
  update, 
  push, 
  query, 
  orderByChild, 
  serverTimestamp 
} from "firebase/database";
import { toast } from "sonner";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrd-WaRLM6C2Z5ZlCkhN20sXUObxUUYX0",
  authDomain: "edugine-01.firebaseapp.com",
  databaseURL: "https://edugine-01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "edugine-01",
  storageBucket: "edugine-01.appspot.com",
  messagingSenderId: "556004873116",
  appId: "1:556004873116:web:e1a41b28052a88d0432e59",
  measurementId: "G-MVSWT657FP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

// Export Firebase Storage related functions
export { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
};

// Authentication functions
export const registerUser = async (email: string, password: string, name: string, userCategory: string, educationLevel: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name
    });
    
    // Store additional user data in localStorage for now
    localStorage.setItem('userCategory', userCategory);
    localStorage.setItem('educationLevel', educationLevel);
    
    // Store user data in Firebase Realtime Database
    await set(dbRef(database, `users/${userCredential.user.uid}`), {
      displayName: name,
      email: userCredential.user.email,
      photoURL: userCredential.user.photoURL || null,
      userCategory,
      educationLevel,
      createdAt: new Date().toISOString()
    });
    
    // Initialize points and level
    await set(dbRef(database, `users/${userCredential.user.uid}/points`), 0);
    await set(dbRef(database, `users/${userCredential.user.uid}/level`), 1);
    
    return userCredential.user;
  } catch (error: any) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Sync data from Firebase to localStorage
    const userRef = dbRef(database, `users/${userCredential.user.uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      if (userData.userCategory) {
        localStorage.setItem('userCategory', userData.userCategory);
      }
      if (userData.educationLevel) {
        localStorage.setItem('educationLevel', userData.educationLevel);
      }
    }
    
    return userCredential.user;
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent. Check your inbox!");
  } catch (error: any) {
    console.error("Error sending reset email:", error);
    throw error;
  }
};

export const uploadProfileImage = async (userId: string, file: File) => {
  try {
    const storageRef = ref(storage, `profile-images/${userId}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    
    // Update profile with photo URL
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: photoURL
      });
      
      // Update in Firebase database
      await update(dbRef(database, `users/${userId}`), {
        photoURL: photoURL
      });
    }
    
    return photoURL;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

// Realtime Database Functions for Student Points System
export const getUserPoints = async (userId: string) => {
  const pointsRef = dbRef(database, `users/${userId}/points`);
  const snapshot = await get(pointsRef);
  return snapshot.exists() ? snapshot.val() : 0;
};

export const getUserLevel = async (userId: string) => {
  const levelRef = dbRef(database, `users/${userId}/level`);
  const snapshot = await get(levelRef);
  return snapshot.exists() ? snapshot.val() : 1;
};

export const observeUserPoints = (userId: string, callback: (points: number) => void) => {
  const pointsRef = dbRef(database, `users/${userId}/points`);
  return onValue(pointsRef, (snapshot) => {
    const points = snapshot.exists() ? snapshot.val() : 0;
    callback(points);
  });
};

export const observeUserLevel = (userId: string, callback: (level: number) => void) => {
  const levelRef = dbRef(database, `users/${userId}/level`);
  return onValue(levelRef, (snapshot) => {
    const level = snapshot.exists() ? snapshot.val() : 1;
    callback(level);
  });
};

export const addPointsToUserDb = async (userId: string, points: number, description: string, type: string) => {
  try {
    // Get current points
    const currentPoints = await getUserPoints(userId);
    const newTotalPoints = currentPoints + points;
    
    // Update points
    await set(dbRef(database, `users/${userId}/points`), newTotalPoints);
    
    // Calculate and update level (1 level per 100 points)
    const newLevel = Math.floor(newTotalPoints / 100) + 1;
    const currentLevel = await getUserLevel(userId);
    
    if (newLevel > currentLevel) {
      await set(dbRef(database, `users/${userId}/level`), newLevel);
      
      // Add level up bonus
      const levelUpRecord = {
        id: Date.now() + 1,
        type: 'achievement',
        points: 10,
        description: `लेवल ${newLevel} पर पहुंचने का बोनस`,
        timestamp: new Date().toISOString()
      };
      
      await set(dbRef(database, `users/${userId}/pointsHistory/${levelUpRecord.id}`), levelUpRecord);
      
      // Also add 10 more points for leveling up
      await set(dbRef(database, `users/${userId}/points`), newTotalPoints + 10);
    }
    
    // Add points record
    const pointRecord = {
      id: Date.now(),
      type,
      points,
      description,
      timestamp: new Date().toISOString()
    };
    
    await set(dbRef(database, `users/${userId}/pointsHistory/${pointRecord.id}`), pointRecord);
    
    return newTotalPoints;
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

export const getLeaderboardData = async () => {
  try {
    const usersRef = dbRef(database, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const users = snapshot.val();
    const leaderboardData = Object.keys(users).map(userId => {
      const user = users[userId];
      return {
        id: userId,
        name: user.displayName || `Student_${userId.substring(0, 5)}`,
        points: user.points || 0,
        level: user.level || 1,
        photoURL: user.photoURL,
        rank: 0 // Will be calculated after sorting
      };
    });
    
    // Sort by points (descending)
    leaderboardData.sort((a, b) => b.points - a.points);
    
    // Assign ranks
    leaderboardData.forEach((student, index) => {
      student.rank = index + 1;
    });
    
    return leaderboardData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
};

export const getUserPointsHistory = async (userId: string) => {
  try {
    const historyRef = dbRef(database, `users/${userId}/pointsHistory`);
    const snapshot = await get(historyRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const history = snapshot.val();
    return Object.values(history);
  } catch (error) {
    console.error("Error fetching points history:", error);
    return [];
  }
};

export const observeLeaderboardData = (callback: (data: any[]) => void) => {
  const usersRef = dbRef(database, 'users');
  return onValue(usersRef, async (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const users = snapshot.val();
    const leaderboardData = Object.keys(users).map(userId => {
      const user = users[userId];
      return {
        id: userId,
        name: user.displayName || `Student_${userId.substring(0, 5)}`,
        points: user.points || 0,
        level: user.level || 1,
        photoURL: user.photoURL,
        rank: 0 // Will be calculated after sorting
      };
    });
    
    // Sort by points (descending)
    leaderboardData.sort((a, b) => b.points - a.points);
    
    // Assign ranks
    leaderboardData.forEach((student, index) => {
      student.rank = index + 1;
    });
    
    callback(leaderboardData);
  });
};

// Chat System Functions

// Generate a unique chat ID for two users
export const getChatId = (uid1: string, uid2: string) => {
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

// Create a new group chat
export const createChatGroup = async (name: string, members: {[uid: string]: boolean}) => {
  try {
    const groupsRef = dbRef(database, 'groups');
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
    await set(dbRef(database, `groups/${groupId}`), {
      name,
      members,
      admins,
      createdAt: Date.now(),
      createdBy: currentUserUid
    });
    
    // Add welcome message
    const messagesRef = dbRef(database, `groups/${groupId}/messages`);
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
    const senderSnapshot = await get(dbRef(database, `users/${senderUid}`));
    const senderName = senderSnapshot.exists() 
      ? senderSnapshot.val().displayName || `User_${senderUid.substring(0, 5)}`
      : `User_${senderUid.substring(0, 5)}`;
    
    // Create message object
    const message = {
      sender: senderUid,
      senderName,
      text,
      timestamp: Date.now()
    };
    
    // Path depends on whether it's a group or 1-on-1 chat
    const path = isGroup ? `groups/${chatId}/messages` : `chats/${chatId}/messages`;
    const messagesRef = dbRef(database, path);
    
    // Add message
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, message);
    
    // Update last message for easier retrieval
    const lastMessagePath = isGroup ? `groups/${chatId}` : `chats/${chatId}`;
    await update(dbRef(database, lastMessagePath), {
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
  const messagesRef = dbRef(database, path);
  
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      const messagesList = Object.keys(messagesData).map(key => ({
        id: key,
        ...messagesData[key]
      }));
      
      // Sort by timestamp
      messagesList.sort((a, b) => a.timestamp - b.timestamp);
      
      callback(messagesList);
    } else {
      callback([]);
    }
  });
  
  return unsubscribe;
};

// Get user's 1-on-1 chats
export const getUserChats = async (userId: string) => {
  try {
    const chatsSnapshot = await get(dbRef(database, 'chats'));
    if (!chatsSnapshot.exists()) {
      return [];
    }
    
    const chatsData = chatsSnapshot.val();
    const userChats = Object.entries(chatsData)
      .filter(([chatId]) => chatId.includes(userId))
      .map(async ([chatId, chatData]: [string, any]) => {
        // Extract the other user's ID
        const otherUserId = chatId.replace(userId, '').replace('_', '');
        const userSnapshot = await get(dbRef(database, `users/${otherUserId}`));
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
    const groupsSnapshot = await get(dbRef(database, 'groups'));
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
    const groupSnapshot = await get(dbRef(database, `groups/${groupId}`));
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
    const userSnapshot = await get(dbRef(database, `users/${userId}`));
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
    const groupSnapshot = await get(dbRef(database, `groups/${groupId}`));
    if (!groupSnapshot.exists()) {
      throw new Error("Group not found");
    }
    
    const groupData = groupSnapshot.val();
    if (!groupData.admins || !groupData.admins[currentUserUid]) {
      throw new Error("Only group admins can update membership");
    }
    
    // Update membership
    if (isAdding) {
      await update(dbRef(database, `groups/${groupId}/members`), {
        [userId]: true
      });
    } else {
      // Remove member
      await update(dbRef(database, `groups/${groupId}/members/${userId}`), null);
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
    const chatSnapshot = await get(dbRef(database, `chats/${chatId}`));
    if (!chatSnapshot.exists()) {
      // Create new chat
      await set(dbRef(database, `chats/${chatId}`), {
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

export { auth, database };
