'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addMealToDay(
  date: string,
  mealSlot: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  mealId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get the meal details
  const { data: meal } = await supabase
    .from('master_meals')
    .select('*')
    .eq('id', mealId)
    .single();

  if (!meal) {
    throw new Error('Meal not found');
  }

  // Get or create daily log
  const { data: existingLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  const mealSlotField = `${mealSlot}_meal_id`;
  const calorieKey = 'total_calories';
  const proteinKey = 'total_protein';
  const carbsKey = 'total_carbs';
  const fatKey = 'total_fat';
  const fiberKey = 'total_fiber';

  if (existingLog) {
    // Update existing log
    const updatedCalories = (existingLog[calorieKey] || 0) + meal.calories;
    const updatedProtein = (existingLog[proteinKey] || 0) + meal.protein_grams;
    const updatedCarbs = (existingLog[carbsKey] || 0) + meal.carbs_grams;
    const updatedFat = (existingLog[fatKey] || 0) + meal.fat_grams;
    const updatedFiber = (existingLog[fiberKey] || 0) + (meal.fiber_grams || 0);

    const { error } = await supabase
      .from('daily_logs')
      .update({
        [mealSlotField]: mealId,
        [calorieKey]: updatedCalories,
        [proteinKey]: updatedProtein,
        [carbsKey]: updatedCarbs,
        [fatKey]: updatedFat,
        [fiberKey]: updatedFiber,
      })
      .eq('id', existingLog.id);

    if (error) throw error;
  } else {
    // Create new log
    const { error } = await supabase.from('daily_logs').insert([
      {
        user_id: user.id,
        date,
        [mealSlotField]: mealId,
        total_calories: meal.calories,
        total_protein: meal.protein_grams,
        total_carbs: meal.carbs_grams,
        total_fat: meal.fat_grams,
        total_fiber: meal.fiber_grams || 0,
      },
    ]);

    if (error) throw error;
  }

  revalidatePath('/dashboard/daily-log');
  return { success: true };
}

export async function swapMeal(
  date: string,
  mealSlot: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  originalMealId: string,
  newMealId: string,
  reason?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get both meals
  const { data: originalMeal } = await supabase
    .from('master_meals')
    .select('*')
    .eq('id', originalMealId)
    .single();

  const { data: newMeal } = await supabase
    .from('master_meals')
    .select('*')
    .eq('id', newMealId)
    .single();

  if (!originalMeal || !newMeal) {
    throw new Error('Meal not found');
  }

  // Get the daily log
  const { data: log } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (!log) {
    throw new Error('Daily log not found');
  }

  // Calculate nutrition difference
  const caloriesDiff = newMeal.calories - originalMeal.calories;
  const proteinDiff = newMeal.protein_grams - originalMeal.protein_grams;
  const carbsDiff = newMeal.carbs_grams - originalMeal.carbs_grams;
  const fatDiff = newMeal.fat_grams - originalMeal.fat_grams;
  const fiberDiff = (newMeal.fiber_grams || 0) - (originalMeal.fiber_grams || 0);

  // Update daily log
  const mealSlotField = `${mealSlot}_meal_id`;

  const { error: updateError } = await supabase
    .from('daily_logs')
    .update({
      [mealSlotField]: newMealId,
      total_calories: log.total_calories + caloriesDiff,
      total_protein: log.total_protein + proteinDiff,
      total_carbs: log.total_carbs + carbsDiff,
      total_fat: log.total_fat + fatDiff,
      total_fiber: log.total_fiber + fiberDiff,
    })
    .eq('id', log.id);

  if (updateError) throw updateError;

  // Record the swap in swap_history
  const { error: historyError } = await supabase.from('swap_history').insert([
    {
      user_id: user.id,
      date,
      meal_slot: mealSlot,
      original_meal_id: originalMealId,
      new_meal_id: newMealId,
      reason: reason || null,
    },
  ]);

  if (historyError) throw historyError;

  revalidatePath('/dashboard/daily-log');
  return { success: true };
}

export async function generateWeeklyPlan(startDate: string, mealPlanId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get user preferences
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!userData) {
    throw new Error('User not found');
  }

  // Get available meals
  const { data: meals } = await supabase
    .from('master_meals')
    .select('*')
    .order('category');

  if (!meals || meals.length === 0) {
    throw new Error('No meals available');
  }

  // Generate plan for 7 days
  const dailyPlans = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Select random meals for each category
    const breakfastMeals = meals.filter((m) => m.category === 'breakfast');
    const lunchMeals = meals.filter((m) => m.category === 'lunch');
    const dinnerMeals = meals.filter((m) => m.category === 'dinner');

    const selectedBreakfast = breakfastMeals[Math.floor(Math.random() * breakfastMeals.length)];
    const selectedLunch = lunchMeals[Math.floor(Math.random() * lunchMeals.length)];
    const selectedDinner = dinnerMeals[Math.floor(Math.random() * dinnerMeals.length)];

    dailyPlans.push({
      user_id: user.id,
      meal_plan_id: mealPlanId,
      date: dateStr,
      breakfast_meal_id: selectedBreakfast?.id || null,
      lunch_meal_id: selectedLunch?.id || null,
      dinner_meal_id: selectedDinner?.id || null,
      snack_meal_id: null,
      total_calories:
        (selectedBreakfast?.calories || 0) +
        (selectedLunch?.calories || 0) +
        (selectedDinner?.calories || 0),
      total_protein:
        (selectedBreakfast?.protein_grams || 0) +
        (selectedLunch?.protein_grams || 0) +
        (selectedDinner?.protein_grams || 0),
      total_carbs:
        (selectedBreakfast?.carbs_grams || 0) +
        (selectedLunch?.carbs_grams || 0) +
        (selectedDinner?.carbs_grams || 0),
      total_fat:
        (selectedBreakfast?.fat_grams || 0) +
        (selectedLunch?.fat_grams || 0) +
        (selectedDinner?.fat_grams || 0),
      total_fiber:
        (selectedBreakfast?.fiber_grams || 0) +
        (selectedLunch?.fiber_grams || 0) +
        (selectedDinner?.fiber_grams || 0),
    });
  }

  // Insert the daily plans
  const { error } = await supabase.from('daily_logs').insert(dailyPlans);

  if (error) throw error;

  revalidatePath('/dashboard/meal-plans');
  return { success: true, mealCount: dailyPlans.length };
}
