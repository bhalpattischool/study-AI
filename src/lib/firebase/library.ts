
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc,
  increment,
  Timestamp,
  serverTimestamp,
  FieldValue
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "./config";
import { getFirestore } from "firebase/firestore";
import { Book, BookUploadForm } from "@/types/library";

const db = getFirestore();
const COLLECTION_NAME = "library_books";

// पुस्तक अपलोड करने का फंक्शन
export const uploadBook = async (bookData: BookUploadForm): Promise<string> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("आपको लॉगिन करना होगा");

    const bookToUpload: Partial<Book> = {
      title: bookData.title,
      author: bookData.author,
      description: bookData.description,
      category: bookData.category,
      tags: bookData.tags,
      externalLink: bookData.externalLink || "",
      uploadedBy: currentUser.uid,
      uploadedAt: serverTimestamp(), // Now FieldValue is an accepted type
      likes: 0,
      downloads: 0,
      isPublic: bookData.isPublic
    };

    // अगर कवर इमेज है तो अपलोड करें
    if (bookData.coverImage) {
      const coverImageRef = ref(storage, `library/covers/${Date.now()}_${bookData.coverImage.name}`);
      const coverSnapshot = await uploadBytes(coverImageRef, bookData.coverImage);
      bookToUpload.coverImageUrl = await getDownloadURL(coverSnapshot.ref);
    }

    // अगर पुस्तक फाइल है तो अपलोड करें
    if (bookData.bookFile) {
      const bookFileRef = ref(storage, `library/files/${Date.now()}_${bookData.bookFile.name}`);
      const bookSnapshot = await uploadBytes(bookFileRef, bookData.bookFile);
      bookToUpload.fileUrl = await getDownloadURL(bookSnapshot.ref);
    }

    // फायरस्टोर में पुस्तक सेव करें
    const bookRef = await addDoc(collection(db, COLLECTION_NAME), bookToUpload);
    return bookRef.id;
  } catch (error) {
    console.error("पुस्तक अपलोड में त्रुटि:", error);
    throw error;
  }
};

// सभी सार्वजनिक पुस्तकें प्राप्त करें
export const getPublicBooks = async (): Promise<Book[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("isPublic", "==", true),
      orderBy("uploadedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Book[];
  } catch (error) {
    console.error("पुस्तकें लोड करने में त्रुटि:", error);
    throw error;
  }
};

// श्रेणी के अनुसार पुस्तकें प्राप्त करें
export const getBooksByCategory = async (category: string): Promise<Book[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("category", "==", category),
      where("isPublic", "==", true),
      orderBy("uploadedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Book[];
  } catch (error) {
    console.error("श्रेणी पुस्तकें लोड करने में त्रुटि:", error);
    throw error;
  }
};

// उपयोगकर्ता की अपलोड की गई पुस्तकें प्राप्त करें
export const getUserBooks = async (userId?: string): Promise<Book[]> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser && !userId) throw new Error("उपयोगकर्ता लॉगिन नहीं है");
    
    const uid = userId || currentUser?.uid;
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where("uploadedBy", "==", uid),
      orderBy("uploadedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Book[];
  } catch (error) {
    console.error("उपयोगकर्ता की पुस्तकें लोड करने में त्रुटि:", error);
    throw error;
  }
};

// विशिष्ट पुस्तक की जानकारी प्राप्त करें
export const getBookById = async (bookId: string): Promise<Book> => {
  try {
    const bookDoc = await getDoc(doc(db, COLLECTION_NAME, bookId));
    
    if (!bookDoc.exists()) {
      throw new Error("पुस्तक नहीं मिली");
    }
    
    return {
      id: bookDoc.id,
      ...bookDoc.data()
    } as Book;
  } catch (error) {
    console.error("पुस्तक लोड करने में त्रुटि:", error);
    throw error;
  }
};

// लोकप्रिय पुस्तकें प्राप्त करें
export const getPopularBooks = async (limitCount = 10): Promise<Book[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isPublic", "==", true),
      orderBy("likes", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Book[];
  } catch (error) {
    console.error("लोकप्रिय पुस्तकें लोड करने में त्रुटि:", error);
    throw error;
  }
};

// पुस्तक को लाइक करें
export const likeBook = async (bookId: string): Promise<void> => {
  try {
    const bookRef = doc(db, COLLECTION_NAME, bookId);
    await updateDoc(bookRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error("पुस्तक लाइक करने में त्रुटि:", error);
    throw error;
  }
};

// पुस्तक डाउनलोड काउंट बढ़ाएं
export const incrementDownload = async (bookId: string): Promise<void> => {
  try {
    const bookRef = doc(db, COLLECTION_NAME, bookId);
    await updateDoc(bookRef, {
      downloads: increment(1)
    });
  } catch (error) {
    console.error("डाउनलोड काउंट बढ़ाने में त्रुटि:", error);
    throw error;
  }
};

// पुस्तक हटाएं
export const deleteBook = async (bookId: string): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("आपको लॉगिन करना होगा");
    
    // पहले जांचें कि क्या यह पुस्तक वर्तमान उपयोगकर्ता की है
    const bookData = await getBookById(bookId);
    if (bookData.uploadedBy !== currentUser.uid) {
      throw new Error("आप इस पुस्तक को हटाने के अधिकृत नहीं हैं");
    }
    
    await deleteDoc(doc(db, COLLECTION_NAME, bookId));
  } catch (error) {
    console.error("पुस्तक हटाने में त्रुटि:", error);
    throw error;
  }
};
