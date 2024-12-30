import { SupabaseClient } from "@supabase/supabase-js";

export async function signIn(
  client: SupabaseClient,
  email: string,
  password: string
) {
  const { data, error } = await client.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw error;
  }

  return { data };
}

export async function logout(
  client: SupabaseClient,
) {
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }

  return { error };
}
