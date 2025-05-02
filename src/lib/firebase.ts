
// Re-export everything from modular Firebase structure
export { 
  auth, 
  database, 
  storage 
} from './firebase/config';

// Re-export all functions from modular files
export { 
  loginUser, 
  registerUser, 
  uploadProfileImage, 
  logoutUser, 
  resetPassword,
  getUserProfile 
} from './firebase/auth';

export { 
  sendMessage, 
  getGroupDetails, 
  deleteMessage, 
  toggleSaveMessage,
  listenForMessages,
  getUserChats,
  getUserGroups,
  startChat,
  createChatGroup,
  updateGroupMembership,
  deleteGroup
} from './firebase/chat';

export { 
  getLeaderboardData,
  observeLeaderboardData 
} from './firebase/leaderboard';

export { 
  addPointsToUserDb,
  getUserPointsHistory 
} from './firebase/points';

// Re-export firebase storage functions directly
export { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
export { getDatabase } from "firebase/database";
export { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged 
} from "firebase/auth";

export { 
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

// Message listener
const onMessage = (callback: (message: any) => void) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return () => {}; 

  // Database already initialized in config.ts
  const db = getFirestore();

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

// Export the message listener
export { onMessage };
