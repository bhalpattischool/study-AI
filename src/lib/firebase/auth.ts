
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile 
} from "firebase/auth";
import { auth, database } from './config';
import { ref, set, get } from "firebase/database";
import { toast } from "sonner";

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
    await set(ref(database, `users/${userCredential.user.uid}`), {
      displayName: name,
      email: userCredential.user.email,
      photoURL: userCredential.user.photoURL || null,
      userCategory,
      educationLevel,
      createdAt: new Date().toISOString()
    });
    
    // Initialize points and level
    await set(ref(database, `users/${userCredential.user.uid}/points`), 0);
    await set(ref(database, `users/${userCredential.user.uid}/level`), 1);
    
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
    const userRef = ref(database, `users/${userCredential.user.uid}`);
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

