
import { supabase } from "@/integrations/supabase/client";
import { SupaChatMessage, Message } from "./types";

export async function getGroupMessages(groupId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    return data as SupaChatMessage[];
  } catch (error) {
    console.error("Error in getGroupMessages:", error);
    return [];
  }
}

export async function sendTextMessage(groupId: string, senderId: string, text: string) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        group_id: groupId,
        sender_id: senderId,
        message_type: "text",
        text_content: text,
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in sendTextMessage:", error);
    throw error;
  }
}

export async function sendImageMessage(groupId: string, senderId: string, file: File) {
  try {
    const fileName = `${groupId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9-.]/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("chat_media")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        group_id: groupId,
        sender_id: senderId,
        message_type: "image",
        image_path: fileName,
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in sendImageMessage:", error);
    throw error;
  }
}

// Add missing functions for the chat-db.ts
export async function addMessage(chatId: string, content: string, role: "user" | "bot"): Promise<Message> {
  const message: Message = {
    id: crypto.randomUUID(),
    chatId,
    content,
    role,
    timestamp: Date.now(),
  };
  
  // Implementation would depend on how messages are stored
  console.log("Adding message:", message);
  return message;
}

export async function editMessage(chatId: string, messageId: string, content: string): Promise<void> {
  console.log("Editing message:", chatId, messageId, content);
  // Implementation would depend on how messages are edited
}

export async function deleteMessage(chatId: string, messageId: string): Promise<void> {
  console.log("Deleting message:", chatId, messageId);
  // Implementation would depend on how messages are deleted
}

export async function toggleMessageBookmark(chatId: string, messageId: string): Promise<boolean> {
  console.log("Toggling bookmark for message:", chatId, messageId);
  // Implementation would depend on how bookmarks are toggled
  return true; // Return new bookmark status
}
