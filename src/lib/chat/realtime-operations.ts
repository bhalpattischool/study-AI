
import { supabase } from "@/integrations/supabase/client";
import { SupaChatMessage } from "./types";
import { getGroupMessages } from "./message-operations";

export function listenForGroupMessages(groupId: string, callback: (messages: SupaChatMessage[]) => void) {
  try {
    let cancel = false;
    
    getGroupMessages(groupId).then(messages => { 
      if (!cancel) {
        if (messages && messages.length > 0) {
          callback(messages);
        } else {
          callback([]);
        }
      }
    }).catch(error => {
      console.error("Error in initial fetch of messages:", error);
      callback([]);
    });

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
  console.log("Realtime subscription is handled automatically by Supabase client");
  return true;
}
