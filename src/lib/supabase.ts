import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          target_date: string | null;
          status: string;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['goals']['Insert']>;
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          frequency: string;
          color: string;
          icon: string;
          streak: number;
          longest_streak: number;
          created_at: string;
        };
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_at: string;
          notes: string | null;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          content: string;
          mood: number;
          hours_coded: number;
          techs_used: string[];
          created_at: string;
        };
      };
      ai_insights: {
        Row: {
          id: string;
          user_id: string;
          insight_type: string;
          content: string;
          summary: string | null;
          generated_at: string;
        };
      };
    };
  };
};
