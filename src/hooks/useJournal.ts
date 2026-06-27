import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { JournalEntry } from '../types';
import toast from 'react-hot-toast';

export function useJournal(userId: string | undefined) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error) setEntries(data as JournalEntry[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const addEntry = async (entry: {
    title?: string;
    content: string;
    mood: number;
    hours_coded: number;
    techs_used: string[];
  }) => {
    if (!userId) return;
    const { error } = await supabase.from('journal_entries').insert({
      ...entry,
      user_id: userId,
    });
    if (error) { toast.error('Failed to save entry'); return; }
    toast.success('Entry saved!');
    fetchEntries();
  };

  const deleteEntry = async (id: string) => {
    await supabase.from('journal_entries').delete().eq('id', id);
    toast.success('Entry deleted');
    fetchEntries();
  };

  const getTotalHoursCoded = () =>
    entries.reduce((sum, e) => sum + (e.hours_coded || 0), 0);

  const getTopTechs = () => {
    const techCount: Record<string, number> = {};
    entries.forEach(e => e.techs_used?.forEach(t => {
      techCount[t] = (techCount[t] || 0) + 1;
    }));
    return Object.entries(techCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
  };

  return { entries, loading, addEntry, deleteEntry, getTotalHoursCoded, getTopTechs, refetch: fetchEntries };
}
