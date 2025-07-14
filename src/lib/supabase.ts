import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured, using mock client');
    // Return a mock client that doesn't make real API calls
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) })
      })
    };
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string;
          type: 'expense' | 'income';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          icon?: string;
          type: 'expense' | 'income';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string;
          type?: 'expense' | 'income';
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          date: string;
          description: string;
          paid_by: 'user' | 'household';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          date?: string;
          description?: string;
          paid_by?: 'user' | 'household';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          amount?: number;
          category?: string;
          date?: string;
          description?: string;
          paid_by?: 'user' | 'household';
          created_at?: string;
          updated_at?: string;
        };
      };
      incomes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          date: string;
          description: string;
          earned_by: 'user' | 'household';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          date?: string;
          description?: string;
          earned_by?: 'user' | 'household';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          amount?: number;
          category?: string;
          date?: string;
          description?: string;
          earned_by?: 'user' | 'household';
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          amount: number;
          period: 'weekly' | 'monthly' | 'yearly';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          amount: number;
          period?: 'weekly' | 'monthly' | 'yearly';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          amount?: number;
          period?: 'weekly' | 'monthly' | 'yearly';
          created_at?: string;
        };
      };
      tithes: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          date: string;
          description: string;
          recipient: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          date?: string;
          description?: string;
          recipient: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          date?: string;
          description?: string;
          recipient?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tithe_goals: {
        Row: {
          id: string;
          user_id: string;
          target_percentage: number;
          period: 'weekly' | 'monthly' | 'yearly';
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_percentage: number;
          period?: 'weekly' | 'monthly' | 'yearly';
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_percentage?: number;
          period?: 'weekly' | 'monthly' | 'yearly';
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}