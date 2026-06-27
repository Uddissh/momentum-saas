export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export type GoalCategory = 'academic' | 'technical' | 'personal' | 'fitness';
export type GoalStatus = 'active' | 'completed' | 'paused';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  target_date?: string;
  status: GoalStatus;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekly';
  color: string;
  icon: string;
  streak: number;
  longest_streak: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  mood: number;
  hours_coded: number;
  techs_used: string[];
  created_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  insight_type: 'weekly_digest' | 'goal_suggestion' | 'habit_tip';
  content: string;
  summary?: string;
  generated_at: string;
}
