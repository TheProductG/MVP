'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function MealPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch meal plan
      const { data: planData } = await supabase
        .from('user_meal_plans')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();

      if (!planData) {
        router.push('/dashboard/meal-plans');
        return;
      }

      setPlan(planData);

      // Fetch associated daily logs
      const { data: logsData } = await supabase
        .from('daily_logs')
        .select(
          `
          *,
          breakfast_meal:master_meals!breakfast_meal_id(name, calories),
          lunch_meal:master_meals!lunch_meal_id(name, calories),
          dinner_meal:master_meals!dinner_meal_id(name, calories),
          snack_meal:master_meals!snack_meal_id(name, calories)
        `
        )
        .eq('meal_plan_id', planData.id)
        .order('date', { ascending: true });

      setLogs(logsData || []);
      setLoading(false);
    };

    fetchPlanDetails();
  }, [params.id, router]);

  const handleGenerateWeeklyPlan = async () => {
    try {
      // This would call the generateWeeklyPlan server action
      // Implementation would be added here
      alert('Weekly plan generation coming soon!');
    } catch (error) {
      console.error('Error generating plan:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading meal plan...</div>;
  }

  if (!plan) {
    return <div className="text-center py-8">Meal plan not found</div>;
  }

  const endDateDisplay = plan.end_date
    ? new Date(plan.end_date).toLocaleDateString()
    : 'Ongoing';

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{plan.name}</h1>
          <p className="text-gray-600">
            {new Date(plan.start_date).toLocaleDateString()} - {endDateDisplay}
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleGenerateWeeklyPlan}
            className="block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Generate Weekly Plan
          </button>
          {plan.is_active && (
            <span className="block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold text-center">
              Active
            </span>
          )}
        </div>
      </div>

      {plan.description && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-600">{plan.description}</p>
        </div>
      )}

      {/* Nutrition Targets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {plan.target_calories && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Target Calories</div>
            <div className="text-3xl font-bold text-blue-600">{plan.target_calories}</div>
          </div>
        )}
        {plan.target_protein && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Target Protein</div>
            <div className="text-3xl font-bold text-green-600">{plan.target_protein}g</div>
          </div>
        )}
        {plan.target_carbs && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Target Carbs</div>
            <div className="text-3xl font-bold text-yellow-600">{plan.target_carbs}g</div>
          </div>
        )}
        {plan.target_fat && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Target Fat</div>
            <div className="text-3xl font-bold text-red-600">{plan.target_fat}g</div>
          </div>
        )}
      </div>

      {/* Daily Logs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Planned Days ({logs.length})</h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No days planned yet. Generate a weekly plan to get started!
          </div>
        ) : (
          <div className="divide-y">
            {logs.map((log) => (
              <div key={log.id} className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">
                    {new Date(log.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h3>
                  <span className="text-sm text-gray-600">{log.total_calories} kcal</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {log.breakfast_meal && (
                    <div>
                      <div className="text-gray-600">Breakfast</div>
                      <div className="font-semibold">{log.breakfast_meal.name}</div>
                    </div>
                  )}
                  {log.lunch_meal && (
                    <div>
                      <div className="text-gray-600">Lunch</div>
                      <div className="font-semibold">{log.lunch_meal.name}</div>
                    </div>
                  )}
                  {log.dinner_meal && (
                    <div>
                      <div className="text-gray-600">Dinner</div>
                      <div className="font-semibold">{log.dinner_meal.name}</div>
                    </div>
                  )}
                  {log.snack_meal && (
                    <div>
                      <div className="text-gray-600">Snack</div>
                      <div className="font-semibold">{log.snack_meal.name}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
