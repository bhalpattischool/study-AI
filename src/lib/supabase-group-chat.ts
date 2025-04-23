
import { supabase } from "@/integrations/supabase/client";

// TYPE DEFINITIONS
export type SupaGroup = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
};
export type SupaGroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  is_admin: boolean;
  joined_at: string;
};
export type SupaChatMessage = {
  id: string;
  group_id: string;
  sender_id: string;
  message_type: "text" | "image";
  text_content?: string | null;
  image_path?: string | null;
  created_at: string;
};

export async function getGroupDetails(groupId: string) {
  const { data: group, error } = await supabase
    .from("chat_groups")
    .select("*")
    .eq("id", groupId)
    .single();
  if (error) throw error;

  const { data: members } = await supabase
    .from("chat_group_members")
    .select("*")
    .eq("group_id", groupId);

  return {
    ...group,
    members: members || [],
  };
}

export async function getGroupMessages(groupId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as SupaChatMessage[];
}

export async function sendTextMessage(groupId: string, senderId: string, text: string) {
  // text only message
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
}

export async function sendImageMessage(groupId: string, senderId: string, file: File) {
  const fileName = `${groupId}/${Date.now()}-${file.name}`;
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
}

export function getPublicImageUrl(image_path: string | null) {
  if (!image_path) return null;
  return supabase.storage.from("chat_media").getPublicUrl(image_path).data?.publicUrl;
}

// Supabase realtime listener for new messages in group
export function listenForGroupMessages(groupId: string, callback: (messages: SupaChatMessage[]) => void) {
  let cancel = false;
  // 1. Initial fetch
  getGroupMessages(groupId).then(messages => { if (!cancel) callback(messages); });

  // 2. Realtime subscription
  const channel = supabase.channel('schema-db-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `group_id=eq.${groupId}` },
      (payload) => {
        if (!cancel) {
          getGroupMessages(groupId).then(callback);
        }
      }
    )
    .subscribe();

  return () => {
    cancel = true;
    supabase.removeChannel(channel);
  };
}
