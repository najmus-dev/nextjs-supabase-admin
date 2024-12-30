import { SupabaseClient } from "@supabase/supabase-js";

export async function getProfile(client: SupabaseClient, id: string) : Promise<{ data: Profile }> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", id).returns<Profile>()
    .single()
  if (error) {
    throw error;
  }
  return { data: data };
}

export function getSession(client: SupabaseClient) {
  return client.auth.getUser();
}
