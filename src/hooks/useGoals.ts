import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Goal, GoalCategory, GoalStatus } from '../types';
import toast from 'react-hot-toast';

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) { toast.error('Failed to load goals'); console.error(error); }
    else setGoals(data as Goal[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const addGoal = async (goal: {
    title: string;
    description?: string;
    category: GoalCategory;
    target_date?: string;
    progress?: number;
  }) => {
    if (!userId) return;
    const { error } = await supabase.from('goals').insert({
      ...goal,
      user_id: userId,
      status: 'active' as GoalStatus,
      progress: goal.progress ?? 0,
    });
    if (error) { toast.error('Failed to add goal'); return; }
    toast.success('Goal added!');
    fetchGoals();
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const { error } = await supabase
      .from('goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) { toast.error('Failed to update goal'); return; }
    toast.success('Goal updated!');
    fetchGoals();
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) { toast.error('Failed to delete goal'); return; }
    toast.success('Goal deleted');
    fetchGoals();
  };

  const updateProgress = async (id: string, progress: number) => {
    const status: GoalStatus = progress >= 100 ? 'completed' : 'active';
    await updateGoal(id, { progress, status });
  };

  return { goals, loading, addGoal, updateGoal, deleteGoal, updateProgress, refetch: fetchGoals };
}
