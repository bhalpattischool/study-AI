
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
    
    return userCredential.user;
  } catch (error: any) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
    }
    
    return photoURL;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

export { auth };
