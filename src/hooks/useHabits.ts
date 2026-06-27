import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Habit, HabitLog } from '../types';
import toast from 'react-hot-toast';

export function useHabits(userId: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const fetchHabits = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const [habitsRes, logsRes] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('habit_logs').select('*').eq('user_id', userId)
        .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    ]);

    if (!habitsRes.error) setHabits(habitsRes.data as Habit[]);
    if (!logsRes.error) setLogs(logsRes.data as HabitLog[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const addHabit = async (habit: { name: string; category: string; color: string; icon: string }) => {
    if (!userId) return;
    const { error } = await supabase.from('habits').insert({
      ...habit,
      user_id: userId,
      frequency: 'daily',
      streak: 0,
      longest_streak: 0,
    });
    if (error) { toast.error('Failed to add habit'); return; }
    toast.success('Habit added!');
    fetchHabits();
  };

  const toggleHabitToday = async (habitId: string) => {
    if (!userId) return;
    const existingLog = logs.find(
      l => l.habit_id === habitId && l.completed_at === today
    );

    if (existingLog) {
      await supabase.from('habit_logs').delete().eq('id', existingLog.id);
    } else {
      await supabase.from('habit_logs').insert({
        habit_id: habitId,
        user_id: userId,
        completed_at: today,
      });
      // Update streak
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        const newStreak = habit.streak + 1;
        await supabase.from('habits').update({
          streak: newStreak,
          longest_streak: Math.max(newStreak, habit.longest_streak),
        }).eq('id', habitId);
      }
    }
    fetchHabits();
  };

  const deleteHabit = async (id: string) => {
    await supabase.from('habits').delete().eq('id', id);
    toast.success('Habit removed');
    fetchHabits();
  };

  const isCompletedToday = (habitId: string) =>
    logs.some(l => l.habit_id === habitId && l.completed_at === today);

  const getCompletionDates = (habitId: string) =>
    logs.filter(l => l.habit_id === habitId).map(l => l.completed_at);

  return { habits, logs, loading, addHabit, toggleHabitToday, deleteHabit, isCompletedToday, getCompletionDates, refetch: fetchHabits };
}
