// lib/supabase.ts
// 🔐 Supabase Client Factory - Safe initialization for API routes

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cached clients
let anonClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

/**
 * Get Supabase client with anon key (for client-side and basic API operations)
 * Uses RLS policies
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  }
  
  if (!anonClient) {
    anonClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return anonClient;
}

/**
 * Get Supabase client with service role key (for admin operations)
 * Bypasses RLS - use with caution!
 */
export function getSupabaseServiceClient(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  
  // Fall back to anon key if service key not available
  const key = supabaseServiceRoleKey || supabaseAnonKey;
  
  if (!key) {
    throw new Error('Missing Supabase key environment variable');
  }
  
  if (!serviceClient) {
    serviceClient = createClient(supabaseUrl, key);
  }
  
  return serviceClient;
}

/**
 * Create a fresh Supabase client (for isolated operations)
 */
export function createSupabaseClient(useServiceRole = false): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  
  const key = useServiceRole 
    ? (supabaseServiceRoleKey || supabaseAnonKey)
    : supabaseAnonKey;
    
  if (!key) {
    throw new Error('Missing Supabase key environment variable');
  }
  
  return createClient(supabaseUrl, key);
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

