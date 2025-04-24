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
    // Use a basic query without joining tables to avoid recursion issues
    const { data: group, error } = await supabase
      .from("chat_groups")
      .select("*")
      .eq("id", groupId)
      .single();
    
    if (error) {
      console.error("Error fetching group:", error);
      return null;
    }

    // Fetch members separately
    const { data: members, error: memberError } = await supabase
      .from("chat_group_members")
      .select("*")
      .eq("group_id", groupId);
    
    if (memberError) {
      console.error("Error fetching members:", memberError);
      return { ...group, members: [] };
    }

    return {
      ...group,
      members: members || [],
    };
  } catch (error) {
    console.error("Error in getGroupDetails:", error);
    // Return a fallback object instead of throwing
    return { 
      id: groupId,
      name: "Group Chat",
      created_by: "",
      created_at: new Date().toISOString(),
      members: []
    };
  }
}

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
    
    // Initial fetch of messages
    getGroupMessages(groupId).then(messages => { 
      if (!cancel) {
        // If we got messages, call the callback
        if (messages && messages.length > 0) {
          callback(messages);
        } else {
          // Otherwise, initialize with empty array
          callback([]);
        }
      }
    }).catch(error => {
      console.error("Error in initial fetch of messages:", error);
      // Call callback with empty array on error
      callback([]);
    });

    // Set up real-time channel for updates
    const channel = supabase.channel(`group-${groupId}`);
    
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
            console.log('New message received via realtime:', payload);
            // Fetch all messages again to ensure we have the complete list
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
  // Since the RPC function doesn't exist, let's handle gracefully
  console.log("Realtime subscription is handled automatically by Supabase client");
  return true;
}

export async function ensureChatMediaBucketExists() {
  try {
    const { data, error } = await supabase.storage.getBucket('chat_media');
    
    if (error) {
      console.log("Chat media bucket doesn't exist or couldn't be accessed");
      // We can't create buckets from the client, so just return false
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking chat media bucket:", error);
    return false;
  }
}
