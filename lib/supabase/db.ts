import { supabase } from "./client";

export async function saveChatsToDB(userId: string, chats: any) {
  return await supabase
    .from("chats")
    .upsert({ user_id: userId, data: chats });
}

export async function loadChatsFromDB(userId: string) {
  const { data } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data?.data || [];
}
