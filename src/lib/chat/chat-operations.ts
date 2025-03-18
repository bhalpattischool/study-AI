
import { Chat } from "./types";
import { CHATS_STORE } from "./db-init";

export async function getAllChats(db: IDBDatabase): Promise<Chat[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHATS_STORE, "readonly");
    const store = transaction.objectStore(CHATS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const chats = request.result.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp descending
      resolve(chats);
    };

    request.onerror = (event) => {
      console.error("Error getting chats:", event);
      reject(new Error("Failed to get chats"));
    };
  });
}

export async function getChat(db: IDBDatabase, id: string): Promise<Chat | null> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHATS_STORE, "readonly");
    const store = transaction.objectStore(CHATS_STORE);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = (event) => {
      console.error("Error getting chat:", event);
      reject(new Error("Failed to get chat"));
    };
  });
}

export async function saveChat(db: IDBDatabase, chat: Chat): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHATS_STORE, "readwrite");
    const store = transaction.objectStore(CHATS_STORE);
    const request = store.put(chat);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      console.error("Error saving chat:", event);
      reject(new Error("Failed to save chat"));
    };
  });
}

export async function deleteChat(db: IDBDatabase, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHATS_STORE, "readwrite");
    const store = transaction.objectStore(CHATS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      console.error("Error deleting chat:", event);
      reject(new Error("Failed to delete chat"));
    };
  });
}
