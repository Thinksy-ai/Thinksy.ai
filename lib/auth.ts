import { supabase } from "./supabase/client";

export async function signInEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signUpEmail(email: string, password: string) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signInGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
}

export async function logout() {
  return await supabase.auth.signOut();
}
