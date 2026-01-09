'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function MealPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('user_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPlans(data || []);
      setLoading(false);
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading meal plans...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meal Plans</h1>
        <Link
          href="/dashboard/meal-plans/new"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold mb-2">No Meal Plans Yet</h2>
          <p className="text-gray-600 mb-6">Create your first meal plan to get started!</p>
          <Link
            href="/dashboard/meal-plans/new"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Meal Plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/dashboard/meal-plans/${plan.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {new Date(plan.start_date).toLocaleDateString()} -{' '}
                  {plan.end_date ? new Date(plan.end_date).toLocaleDateString() : 'Ongoing'}
                </span>
                {plan.is_active && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    Active
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
