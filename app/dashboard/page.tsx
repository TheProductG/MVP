'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaysCalories: 0,
    mealPlans: 0,
    logs: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // Fetch user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const typedUserData = userData as any;
      setUser(typedUserData);

      // Fetch stats
      const today = new Date().toISOString().split('T')[0];
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', today);

      const { count: planCount } = await supabase
        .from('user_meal_plans')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);

      const { count: logCount } = await supabase
        .from('daily_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);

      const typedLogs = logs as any[];
      setStats({
        todaysCalories: typedLogs?.[0]?.total_calories || 0,
        mealPlans: planCount || 0,
        logs: logCount || 0,
      });

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Welcome back, {user?.full_name}!</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Today's Calories</div>
          <div className="text-3xl font-bold text-blue-600">{stats.todaysCalories}</div>
          <div className="text-xs text-gray-500 mt-2">
            Target: {user?.daily_calorie_target || 2000} kcal
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Active Meal Plans</div>
          <div className="text-3xl font-bold text-green-600">{stats.mealPlans}</div>
          <div className="text-xs text-gray-500 mt-2">Plans created</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Daily Logs</div>
          <div className="text-3xl font-bold text-purple-600">{stats.logs}</div>
          <div className="text-xs text-gray-500 mt-2">Total entries</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="/dashboard/meal-plans"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold text-blue-900">Meal Plans</div>
          </a>
          <a
            href="/dashboard/meals"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
          >
            <div className="text-2xl mb-2">🍽️</div>
            <div className="font-semibold text-green-900">Browse Meals</div>
          </a>
          <a
            href="/dashboard/daily-log"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold text-purple-900">Today's Log</div>
          </a>
          <a
            href="/dashboard/social-events"
            className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition text-center"
          >
            <div className="text-2xl mb-2">🎉</div>
            <div className="font-semibold text-yellow-900">Social Events</div>
          </a>
        </div>
      </div>
    </div>
  );
}
