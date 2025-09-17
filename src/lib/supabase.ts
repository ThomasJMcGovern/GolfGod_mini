// Supabase Database Client
// This file exports the Supabase client for use throughout the app
import { supabaseClient, checkSupabaseConnection, isDemoMode, supabaseQueries } from "./supabaseClient";

// Export the Supabase client as the default database
export const supabase = supabaseClient;

// Export validation function
export const validateConnection = checkSupabaseConnection;

// Export demo mode flag
export const isUsingDemoData = isDemoMode;

// Export query helpers
export const queries = supabaseQueries;