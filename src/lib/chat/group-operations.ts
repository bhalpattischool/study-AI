
import { supabase } from "@/integrations/supabase/client";
import { SupaGroup, SupaGroupMember } from "./types";

export async function getGroupDetails(groupId: string) {
  try {
    const { data: group, error } = await supabase
      .from("chat_groups")
      .select("*")
      .eq("id", groupId)
      .single();
    
    if (error) {
      console.error("Error fetching group:", error);
      return null;
    }

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
    return { 
      id: groupId,
      name: "Group Chat",
      created_by: "",
      created_at: new Date().toISOString(),
      members: []
    };
  }
}
