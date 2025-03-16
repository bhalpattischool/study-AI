
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  role: "user" | "bot";
  timestamp: number;
  chatId: string;
}

export interface Chat {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

const DB_NAME = "gemini-chat-db";
const DB_VERSION = 1;
const CHATS_STORE = "chats";

export class ChatDB {
  private db: IDBDatabase | null = null;
  private dbReady: Promise<IDBDatabase>;

  constructor() {
    this.dbReady = this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error("IndexedDB error:", event);
        toast.error("Failed to open database");
        reject(new Error("Failed to open database"));
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(CHATS_STORE)) {
          const store = db.createObjectStore(CHATS_STORE, { keyPath: "id" });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };
    });
  }

  async getAllChats(): Promise<Chat[]> {
    const db = await this.dbReady;
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

  async getChat(id: string): Promise<Chat | null> {
    const db = await this.dbReady;
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

  async saveChat(chat: Chat): Promise<void> {
    const db = await this.dbReady;
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

  async updateChatTitle(id: string, title: string): Promise<void> {
    const chat = await this.getChat(id);
    if (!chat) throw new Error("Chat not found");

    chat.title = title;
    await this.saveChat(chat);
  }

  async deleteChat(id: string): Promise<void> {
    const db = await this.dbReady;
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

  async createNewChat(): Promise<Chat> {
    const id = crypto.randomUUID();
    const timestamp = Date.now();
    const chat: Chat = {
      id,
      title: "New Chat",
      timestamp,
      messages: [],
    };

    await this.saveChat(chat);
    return chat;
  }

  async addMessage(chatId: string, content: string, role: "user" | "bot"): Promise<Message> {
    const chat = await this.getChat(chatId);
    if (!chat) throw new Error("Chat not found");

    const message: Message = {
      id: crypto.randomUUID(),
      content,
      role,
      timestamp: Date.now(),
      chatId,
    };

    chat.messages.push(message);
    chat.timestamp = message.timestamp; // Update chat timestamp
    
    // Update chat title if it's first user message
    if (chat.title === "New Chat" && role === "user" && chat.messages.filter(m => m.role === "user").length === 1) {
      chat.title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
    }
    
    await this.saveChat(chat);
    return message;
  }

  async editMessage(chatId: string, messageId: string, content: string): Promise<void> {
    const chat = await this.getChat(chatId);
    if (!chat) throw new Error("Chat not found");

    const messageIndex = chat.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) throw new Error("Message not found");

    chat.messages[messageIndex].content = content;
    await this.saveChat(chat);
  }

  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    const chat = await this.getChat(chatId);
    if (!chat) throw new Error("Chat not found");

    const messageIndex = chat.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) throw new Error("Message not found");

    // Remove the message and also remove the bot response if it was a user message
    if (chat.messages[messageIndex].role === "user" && messageIndex + 1 < chat.messages.length && 
        chat.messages[messageIndex + 1].role === "bot") {
      chat.messages.splice(messageIndex, 2);
    } else {
      chat.messages.splice(messageIndex, 1);
    }

    await this.saveChat(chat);
  }
}

// Create a singleton instance
export const chatDB = new ChatDB();
