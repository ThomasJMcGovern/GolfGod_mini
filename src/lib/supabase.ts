import { createClient } from "@supabase/supabase-js";

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No auth needed for this app
  },
});

// Helper function to validate Supabase connection
export async function validateConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("players").select("id").limit(1);
    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to connect to Supabase:", error);
    return false;
  }
}