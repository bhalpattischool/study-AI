
import { toast } from "sonner";
import { Chat, Message } from "./types";
import { initDB } from "./db-init";
import { 
  getAllChats as getAllChatsOperation,
  getChat as getChatOperation,
  saveChat as saveChatOperation,
  deleteChat as deleteChatOperation
} from "./chat-operations";
import {
  addMessage as addMessageOperation,
  editMessage as editMessageOperation,
  deleteMessage as deleteMessageOperation
} from "./message-operations";

export class ChatDB {
  private db: IDBDatabase | null = null;
  private dbReady: Promise<IDBDatabase>;

  constructor() {
    this.dbReady = this.initDB();
  }

  private async initDB(): Promise<IDBDatabase> {
    this.db = await initDB();
    return this.db;
  }

  async getAllChats(): Promise<Chat[]> {
    const db = await this.dbReady;
    return getAllChatsOperation(db);
  }

  async getChat(id: string): Promise<Chat | null> {
    const db = await this.dbReady;
    return getChatOperation(db, id);
  }

  async saveChat(chat: Chat): Promise<void> {
    const db = await this.dbReady;
    return saveChatOperation(db, chat);
  }

  async updateChatTitle(id: string, title: string): Promise<void> {
    const chat = await this.getChat(id);
    if (!chat) throw new Error("Chat not found");

    chat.title = title;
    await this.saveChat(chat);
  }

  async deleteChat(id: string): Promise<void> {
    const db = await this.dbReady;
    return deleteChatOperation(db, id);
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
    const db = await this.dbReady;
    return addMessageOperation(db, chatId, content, role);
  }

  async editMessage(chatId: string, messageId: string, content: string): Promise<void> {
    const db = await this.dbReady;
    return editMessageOperation(db, chatId, messageId, content);
  }

  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    const db = await this.dbReady;
    return deleteMessageOperation(db, chatId, messageId);
  }
}

// Create a singleton instance
export const chatDB = new ChatDB();
