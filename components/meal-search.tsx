'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import MealCard from './meal-card';

interface MealSearchProps {
  onSelect?: (mealId: string) => void;
  category?: string;
  compact?: boolean;
}

export default function MealSearch({ onSelect, category, compact = false }: MealSearchProps) {
  const [meals, setMeals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchMeals = async () => {
      setLoading(true);

      let query = supabase.from('master_meals').select('*');

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data } = await query.order('name');
      setMeals(data || []);
      setLoading(false);
    };

    const timer = setTimeout(searchMeals, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Searching...</div>
      ) : (
        <div className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'}`}>
          {meals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => onSelect?.(meal.id)}
              className={onSelect ? 'cursor-pointer' : ''}
            >
              <MealCard meal={meal} />
            </div>
          ))}
        </div>
      )}

      {!loading && meals.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No meals found. Try adjusting your search.
        </div>
      )}
    </div>
  );
}
