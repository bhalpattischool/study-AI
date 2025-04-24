
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
