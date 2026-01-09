'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    avgCalories: 0,
    avgProtein: 0,
    avgCarbs: 0,
    avgFat: 0,
    moodBreakdown: {} as Record<string, number>,
    weeklyTrend: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get last 30 days of data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];

      const { data: logs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .order('date', { ascending: true });

      const typedLogs = logs as any[];

      if (typedLogs && typedLogs.length > 0) {
        const totalCalories = typedLogs.reduce((sum, log) => sum + log.total_calories, 0);
        const totalProtein = typedLogs.reduce((sum, log) => sum + log.total_protein, 0);
        const totalCarbs = typedLogs.reduce((sum, log) => sum + log.total_carbs, 0);
        const totalFat = typedLogs.reduce((sum, log) => sum + log.total_fat, 0);

        const moodCounts: Record<string, number> = {};
        typedLogs.forEach((log) => {
          if (log.mood) {
            moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
          }
        });

        setStats({
          totalLogs: typedLogs.length,
          avgCalories: Math.round(totalCalories / typedLogs.length),
          avgProtein: Math.round((totalProtein / typedLogs.length) * 10) / 10,
          avgCarbs: Math.round((totalCarbs / typedLogs.length) * 10) / 10,
          avgFat: Math.round((totalFat / typedLogs.length) * 10) / 10,
          moodBreakdown: moodCounts,
          weeklyTrend: typedLogs,
        });
      }

      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Average Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Avg Daily Calories</div>
          <div className="text-3xl font-bold text-blue-600">{stats.avgCalories}</div>
          <div className="text-xs text-gray-500 mt-2">From {stats.totalLogs} logged days</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Avg Protein (g)</div>
          <div className="text-3xl font-bold text-green-600">{stats.avgProtein}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Avg Carbs (g)</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.avgCarbs}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Avg Fat (g)</div>
          <div className="text-3xl font-bold text-red-600">{stats.avgFat}</div>
        </div>
      </div>

      {/* Mood Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>
          <div className="space-y-4">
            {Object.entries(stats.moodBreakdown).length > 0 ? (
              Object.entries(stats.moodBreakdown).map(([mood, count]) => (
                <div key={mood}>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {mood}
                    </label>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / stats.totalLogs) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No mood data yet</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-semibold">Total Logged Days:</span> {stats.totalLogs}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Most Logged Mood:</span>{' '}
              {Object.entries(stats.moodBreakdown).length > 0
                ? Object.entries(stats.moodBreakdown).sort(([, a], [, b]) => b - a)[0][0]
                : 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Tracking Consistency:</span>{' '}
              {Math.round((stats.totalLogs / 30) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
