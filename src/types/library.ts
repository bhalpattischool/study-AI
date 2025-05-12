
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl?: string;
  fileUrl?: string;
  externalLink?: string;
  category: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: Date | string | firebase.firestore.Timestamp;
  likes: number;
  downloads: number;
  isPublic: boolean;
}

export type BookCategory = 
  | "पाठ्यपुस्तकें"
  | "रेफरेंस"
  | "प्रैक्टिस सेट"
  | "नोट्स"
  | "अन्य";

export interface BookUploadForm {
  title: string;
  author: string;
  description: string;
  coverImage?: File;
  bookFile?: File;
  externalLink?: string;
  category: BookCategory;
  tags: string[];
  isPublic: boolean;
}

// Add this import at the top
import firebase from 'firebase/app';
