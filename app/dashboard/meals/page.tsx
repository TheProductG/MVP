'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import MealCard from '@/components/meal-card';

export default function MealsPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchMeals = async () => {
      let query = supabase.from('master_meals').select('*');

      if (category) {
        query = query.eq('category', category);
      }

      if (filter) {
        query = query.ilike('name', `%${filter}%`);
      }

      const { data } = await query.order('name');
      setMeals(data || []);
      setLoading(false);
    };

    fetchMeals();
  }, [filter, category]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Meal Library</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search meals..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading meals...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}
