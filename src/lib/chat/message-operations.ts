
import { getChat } from "./chat-operations";
import { saveChat } from "./chat-operations";
import { Message } from "./types";

export async function addMessage(
  chatId: string, 
  content: string, 
  role: "user" | "bot"
): Promise<Message> {
  const chat = await getChat(chatId);
  if (!chat) throw new Error("Chat not found");

  const message: Message = {
    id: crypto.randomUUID(),
    content,
    role,
    timestamp: Date.now(),
    chatId,
    bookmarked: false,
  };

  chat.messages.push(message);
  chat.timestamp = message.timestamp; // Update chat timestamp
  
  // Update chat title if it's first user message
  if (chat.title === "New Chat" && role === "user" && chat.messages.filter(m => m.role === "user").length === 1) {
    chat.title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
  }
  
  await saveChat(chat);
  return message;
}

export async function editMessage(
  chatId: string, 
  messageId: string, 
  content: string
): Promise<void> {
  const chat = await getChat(chatId);
  if (!chat) throw new Error("Chat not found");

  const messageIndex = chat.messages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) throw new Error("Message not found");

  chat.messages[messageIndex].content = content;
  await saveChat(chat);
}

export async function deleteMessage(
  chatId: string, 
  messageId: string
): Promise<void> {
  const chat = await getChat(chatId);
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

  await saveChat(chat);
}

export async function toggleMessageBookmark(
  chatId: string, 
  messageId: string
): Promise<boolean> {
  const chat = await getChat(chatId);
  if (!chat) throw new Error("Chat not found");

  const messageIndex = chat.messages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) throw new Error("Message not found");

  // Toggle bookmark status
  const isBookmarked = !chat.messages[messageIndex].bookmarked;
  chat.messages[messageIndex].bookmarked = isBookmarked;
  
  await saveChat(chat);
  return isBookmarked;
}
