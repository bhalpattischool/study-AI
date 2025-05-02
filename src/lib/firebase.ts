
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  User,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-hHn3RRif66Rldx0njeRnLdmVcOqP4Ak",
  authDomain: "study-ai-chat-8cc2c.firebaseapp.com",
  projectId: "study-ai-chat-8cc2c",
  storageBucket: "study-ai-chat-8cc2c.appspot.com",
  messagingSenderId: "673966481134",
  appId: "1:673966481134:web:be6a9578480741bd276e9c",
  measurementId: "G-C1VV8BY2Y7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Authentication functions
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in firestore, if not create profile
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        created: serverTimestamp(),
        points: 0,
        level: 1
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

// Email/Password Authentication
const signUpWithEmailAndPassword = async (email: string, password: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: name
    });
    
    // Create user in firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      photoURL: null,
      created: serverTimestamp(),
      points: 0,
      level: 1
    });
    
    return user;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error resetting password: ", error);
    throw error;
  }
};

// User Profile functions
const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile: ", error);
    throw error;
  }
};

const updateUserProfile = async (uid: string, data: any) => {
  try {
    await updateDoc(doc(db, "users", uid), data);
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};

// Chat functions
const createChatGroup = async (name: string, members: Record<string, boolean>) => {
  try {
    const groupRef = await addDoc(collection(db, "groups"), {
      name,
      members,
      admins: { [auth.currentUser?.uid || '']: true },
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: null
    });
    
    return groupRef.id;
  } catch (error) {
    console.error("Error creating group: ", error);
    throw error;
  }
};

const deleteGroup = async (groupId: string) => {
  try {
    await deleteDoc(doc(db, "groups", groupId));
    
    // TODO: Delete all messages in the group
    // This would require a subcollection query and batch delete
  } catch (error) {
    console.error("Error deleting group: ", error);
    throw error;
  }
};

const updateGroupMembership = async (groupId: string, userId: string, isAdd: boolean) => {
  try {
    const groupRef = doc(db, "groups", groupId);
    
    if (isAdd) {
      await updateDoc(groupRef, {
        [`members.${userId}`]: true
      });
    } else {
      await updateDoc(groupRef, {
        [`members.${userId}`]: false
      });
    }
  } catch (error) {
    console.error("Error updating group membership: ", error);
    throw error;
  }
};

const sendMessage = async (chatId: string, userId: string, text: string, isGroup: boolean = false) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    
    let chatRef;
    let groupData = null;

    if (isGroup) {
      chatRef = collection(db, "groups", chatId, "messages");
      const groupDoc = await getDoc(doc(db, "groups", chatId));
      if (groupDoc.exists()) {
        groupData = { id: chatId, ...groupDoc.data() };
      }
    } else {
      chatRef = collection(db, "chats", chatId, "messages");
    }
    
    // Add the message
    await addDoc(chatRef, {
      text,
      sender: userId,
      senderName: user.displayName || "User",
      timestamp: serverTimestamp(),
      // Set message to expire after 24 hours unless saved
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
    });
    
    // Update group's last message
    if (isGroup && groupData) {
      await updateDoc(doc(db, "groups", chatId), {
        lastMessage: text.startsWith('[image:') ? '📷 Photo' : text,
        lastMessageTime: serverTimestamp(),
        lastSender: user.displayName || "User"
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};

// Leaderboard functions
const getLeaderboardData = async () => {
  try {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by level and points
    return users.sort((a, b) => {
      if (b.level !== a.level) {
        return b.level - a.level;
      }
      return b.points - a.points;
    });
  } catch (error) {
    console.error("Error getting leaderboard data: ", error);
    throw error;
  }
};

// Message listener
const onMessage = (callback: (message: any) => void) => {
  const user = auth.currentUser;
  if (!user) return () => {}; 

  // Listen for all group messages where the user is a member
  const groupsQuery = query(collection(db, "groups"));
  
  const unsubscribe = onSnapshot(groupsQuery, async (snapshot) => {
    const groups = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((group: any) => group.members && group.members[user.uid]);
    
    // Set up message listeners for each group
    const messageListeners = groups.map((group: any) => {
      const messagesQuery = query(
        collection(db, "groups", group.id, "messages")
      );
      
      return onSnapshot(messagesQuery, (messagesSnapshot) => {
        messagesSnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const messageData = change.doc.data();
            const message = {
              id: change.doc.id,
              chatId: group.id,
              isGroup: true,
              groupName: group.name,
              sender: messageData.sender,
              senderName: messageData.senderName,
              text: messageData.text,
              timestamp: messageData.timestamp?.toDate().getTime() || Date.now()
            };
            
            // Only notify about new messages that are from other users
            if (message.sender !== user.uid && Date.now() - message.timestamp < 60000) {
              callback(message);
            }
          }
        });
      });
    });
    
    // Clean up all listeners when the main one is unsubscribed
    return () => {
      messageListeners.forEach(unsubscribe => unsubscribe());
    };
  });
  
  return unsubscribe;
};

export {
  auth,
  db,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  onAuthStateChanged,
  signInWithGoogle,
  signUpWithEmailAndPassword,
  loginWithEmailAndPassword,
  logoutUser,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  createChatGroup,
  deleteGroup,
  updateGroupMembership,
  sendMessage,
  getLeaderboardData,
  onMessage
};
