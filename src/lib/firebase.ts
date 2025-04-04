
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, get, onValue, update } from "firebase/database";
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

export { auth, database };
