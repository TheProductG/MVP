'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

// Force Vercel cache clear v2

export default function DailyLogPage() {
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchLog = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', selectedDate)
        .single();

      setLog(data);
      setLoading(false);
    };

    fetchLog();
  }, [selectedDate]);

  const handleMoodChange = async (mood: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (log) {
      const updateData = { mood };
      // @ts-ignore - Dynamic property keys with Supabase
      await supabase.from('daily_logs').update(updateData).eq('id', log.id);
    } else {
      const insertData = [
        {
          user_id: user.id,
          date: selectedDate,
          mood,
        },
      ];
      // @ts-ignore - Dynamic property keys with Supabase
      const { data } = await supabase.from('daily_logs').insert(insertData).select();

      if (data) {
        setLog(data[0]);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Daily Log</h1>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Calories</div>
            <div className="text-2xl font-bold text-blue-600">{log?.total_calories || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Protein (g)</div>
            <div className="text-2xl font-bold text-green-600">{log?.total_protein || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Carbs (g)</div>
            <div className="text-2xl font-bold text-yellow-600">{log?.total_carbs || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Fat (g)</div>
            <div className="text-2xl font-bold text-red-600">{log?.total_fat || 0}</div>
          </div>
        </div>

        {/* Mood & Energy */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Mood</label>
            <div className="flex gap-3">
              {['poor', 'fair', 'good', 'excellent'].map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodChange(mood)}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    log?.mood === mood
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Notes</label>
            <textarea
              defaultValue={log?.notes || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about your day..."
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
