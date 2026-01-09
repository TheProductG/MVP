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

  const typedMeal = meal as Record<string, any>;

  if (existingLog) {
    // Update existing log
    const typedLog = existingLog as Record<string, any>;
    const updatedCalories = (typedLog[calorieKey] || 0) + typedMeal.calories;
    const updatedProtein = (typedLog[proteinKey] || 0) + typedMeal.protein_grams;
    const updatedCarbs = (typedLog[carbsKey] || 0) + typedMeal.carbs_grams;
    const updatedFat = (typedLog[fatKey] || 0) + typedMeal.fat_grams;
    const updatedFiber = (typedLog[fiberKey] || 0) + (typedMeal.fiber_grams || 0);

    const updateData = {
      [mealSlotField]: mealId,
      [calorieKey]: updatedCalories,
      [proteinKey]: updatedProtein,
      [carbsKey]: updatedCarbs,
      [fatKey]: updatedFat,
      [fiberKey]: updatedFiber,
    };
    // @ts-ignore - Dynamic property keys with Supabase
    const { error } = await supabase.from('daily_logs').update(updateData).eq('id', typedLog.id);

    if (error) throw error;
  } else {
    // Create new log
    const newLogData = {
      user_id: user.id,
      date,
      [mealSlotField]: mealId,
      total_calories: typedMeal.calories,
      total_protein: typedMeal.protein_grams,
      total_carbs: typedMeal.carbs_grams,
      total_fat: typedMeal.fat_grams,
      total_fiber: typedMeal.fiber_grams || 0,
    };
    // @ts-ignore - Dynamic property keys with Supabase
    const { error } = await supabase.from('daily_logs').insert([newLogData]);

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

  const typedOriginalMeal = originalMeal as Record<string, any>;
  const typedNewMeal = newMeal as Record<string, any>;

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

  const typedLog = log as Record<string, any>;

  // Calculate nutrition difference
  const caloriesDiff = typedNewMeal.calories - typedOriginalMeal.calories;
  const proteinDiff = typedNewMeal.protein_grams - typedOriginalMeal.protein_grams;
  const carbsDiff = typedNewMeal.carbs_grams - typedOriginalMeal.carbs_grams;
  const fatDiff = typedNewMeal.fat_grams - typedOriginalMeal.fat_grams;
  const fiberDiff = (typedNewMeal.fiber_grams || 0) - (typedOriginalMeal.fiber_grams || 0);

  // Update daily log
  const mealSlotField = `${mealSlot}_meal_id`;

  const swapUpdateData = {
    [mealSlotField]: newMealId,
    total_calories: typedLog.total_calories + caloriesDiff,
    total_protein: typedLog.total_protein + proteinDiff,
    total_carbs: typedLog.total_carbs + carbsDiff,
    total_fat: typedLog.total_fat + fatDiff,
    total_fiber: typedLog.total_fiber + fiberDiff,
  };
  // @ts-ignore - Dynamic property keys with Supabase
  const { error: updateError } = await supabase.from('daily_logs').update(swapUpdateData).eq('id', typedLog.id);

  if (updateError) throw updateError;

  // Record the swap in swap_history
  const swapHistoryData = {
    user_id: user.id,
    date,
    meal_slot: mealSlot,
    original_meal_id: originalMealId,
    new_meal_id: newMealId,
    reason: reason || null,
  };
  // @ts-ignore - Supabase type compatibility
  const { error: historyError } = await supabase.from('swap_history').insert([swapHistoryData]);

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

  const typedMeals = meals as any[];

  // Generate plan for 7 days
  const dailyPlans = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Select random meals for each category
    const breakfastMeals = typedMeals.filter((m) => m.category === 'breakfast');
    const lunchMeals = typedMeals.filter((m) => m.category === 'lunch');
    const dinnerMeals = typedMeals.filter((m) => m.category === 'dinner');

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
        ((selectedBreakfast as any)?.calories || 0) +
        ((selectedLunch as any)?.calories || 0) +
        ((selectedDinner as any)?.calories || 0),
      total_protein:
        ((selectedBreakfast as any)?.protein_grams || 0) +
        ((selectedLunch as any)?.protein_grams || 0) +
        ((selectedDinner as any)?.protein_grams || 0),
      total_carbs:
        ((selectedBreakfast as any)?.carbs_grams || 0) +
        ((selectedLunch as any)?.carbs_grams || 0) +
        ((selectedDinner as any)?.carbs_grams || 0),
      total_fat:
        ((selectedBreakfast as any)?.fat_grams || 0) +
        ((selectedLunch as any)?.fat_grams || 0) +
        ((selectedDinner as any)?.fat_grams || 0),
      total_fiber:
        ((selectedBreakfast as any)?.fiber_grams || 0) +
        ((selectedLunch as any)?.fiber_grams || 0) +
        ((selectedDinner as any)?.fiber_grams || 0),
    });
  }

  // Insert the daily plans
  // @ts-ignore - Supabase type compatibility with generated meal plans
  const { error } = await supabase.from('daily_logs').insert(dailyPlans as any);

  if (error) throw error;

  revalidatePath('/dashboard/meal-plans');
  return { success: true, mealCount: dailyPlans.length };
}
