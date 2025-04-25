
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, database } from './config';
import { auth } from './config';
import { ref as dbRef, update } from "firebase/database";

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

// Re-export storage functions for direct use
export { ref, uploadBytes, getDownloadURL };

