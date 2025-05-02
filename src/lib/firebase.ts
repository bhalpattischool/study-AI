
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
import { getDatabase } from "firebase/database";
// Import all functions from modular files
import { 
  loginUser, 
  registerUser, 
  uploadProfileImage, 
  logoutUser, 
  resetPassword,
  getUserProfile 
} from './firebase/auth';
import { 
  sendMessage, 
  getGroupDetails, 
  deleteMessage, 
  toggleSaveMessage as toggleSaveMsgInternal, 
  listenForMessages,
  getUserChats,
  getUserGroups,
  startChat,
  createChatGroup,
  updateGroupMembership,
  deleteGroup
} from './firebase/chat';
import { 
  getLeaderboardData,
  observeLeaderboardData 
} from './firebase/leaderboard';
import { 
  addPointsToUserDb,
  getUserPointsHistory 
} from './firebase/points';
import { 
  auth as firebaseAuth, 
  database as firebaseDatabase, 
  storage as firebaseStorage 
} from './firebase/config';

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
const database = getDatabase(app);

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

// For backward compatibility, ensure we have all the functions exported
const toggleSaveMessage = toggleSaveMsgInternal;

// Export everything
export {
  auth,
  db,
  storage,
  database,
  ref,
  uploadBytes,
  getDownloadURL,
  onAuthStateChanged,
  loginUser,
  registerUser,
  uploadProfileImage,
  logoutUser,
  resetPassword,
  getUserProfile,
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
  deleteGroup,
  getLeaderboardData,
  observeLeaderboardData,
  addPointsToUserDb,
  getUserPointsHistory,
  onMessage
};
