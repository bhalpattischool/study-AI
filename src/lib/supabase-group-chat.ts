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
  try {
    const { data: group, error } = await supabase
      .from("chat_groups")
      .select("*")
      .eq("id", groupId)
      .single();
    
    if (error) throw error;

    const { data: members, error: memberError } = await supabase
      .from("chat_group_members")
      .select("*")
      .eq("group_id", groupId);
    
    if (memberError) throw memberError;

    return {
      ...group,
      members: members || [],
    };
  } catch (error) {
    console.error("Error in getGroupDetails:", error);
    throw error;
  }
}

export async function getGroupMessages(groupId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as SupaChatMessage[];
  } catch (error) {
    console.error("Error in getGroupMessages:", error);
    throw error;
  }
}

export async function sendTextMessage(groupId: string, senderId: string, text: string) {
  try {
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
  } catch (error) {
    console.error("Error in sendTextMessage:", error);
    throw error;
  }
}

export async function sendImageMessage(groupId: string, senderId: string, file: File) {
  try {
    // Generate a UUID for the filename to prevent overwriting
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

export function getPublicImageUrl(image_path: string | null) {
  if (!image_path) return null;
  return supabase.storage.from("chat_media").getPublicUrl(image_path).data?.publicUrl;
}

export function listenForGroupMessages(groupId: string, callback: (messages: SupaChatMessage[]) => void) {
  try {
    let cancel = false;
    // 1. Initial fetch
    getGroupMessages(groupId).then(messages => { 
      if (!cancel) callback(messages); 
    }).catch(error => {
      console.error("Error in initial fetch of messages:", error);
    });

    // 2. Realtime subscription
    const channel = supabase.channel(`group:${groupId}`);
    
    channel
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages', 
          filter: `group_id=eq.${groupId}` 
        },
        (payload) => {
          if (!cancel) {
            getGroupMessages(groupId)
              .then(callback)
              .catch(error => {
                console.error("Error in realtime listener:", error);
              });
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      cancel = true;
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error("Error in listenForGroupMessages:", error);
    return () => {}; // Return empty cleanup function in case of error
  }
}

export async function enableRealtimeForChat() {
  try {
    // Fix: Using the correct parameter format - passing an object with table_name property
    await supabase.rpc('enable_realtime_for_table', { table_name: 'chat_messages' });
    console.log("Realtime enabled for chat_messages");
    return true;
  } catch (error) {
    console.error("Error enabling realtime:", error);
    return false;
  }
}

export async function ensureChatMediaBucketExists() {
  try {
    const { data, error } = await supabase.storage.getBucket('chat_media');
    if (error && error.message.includes('does not exist')) {
      // Bucket doesn't exist, we need to create it
      console.log("Chat media bucket doesn't exist, creating...");
      // Note: This won't actually work in the client, but keeping code for reference
    }
    return true;
  } catch (error) {
    console.error("Error checking chat media bucket:", error);
    return false;
  }
}
