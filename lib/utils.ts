export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateCalorieAllocation(
  totalCalories: number,
  mealCount: number
): Record<string, number> {
  const baseCalories = totalCalories / mealCount;

  if (mealCount === 3) {
    return {
      breakfast: Math.round(baseCalories * 0.3),
      lunch: Math.round(baseCalories * 0.4),
      dinner: Math.round(baseCalories * 0.3),
    };
  } else if (mealCount === 4) {
    return {
      breakfast: Math.round(baseCalories * 0.25),
      lunch: Math.round(baseCalories * 0.35),
      dinner: Math.round(baseCalories * 0.3),
      snack: Math.round(baseCalories * 0.1),
    };
  } else if (mealCount === 5) {
    return {
      breakfast: Math.round(baseCalories * 0.2),
      snack1: Math.round(baseCalories * 0.1),
      lunch: Math.round(baseCalories * 0.35),
      snack2: Math.round(baseCalories * 0.1),
      dinner: Math.round(baseCalories * 0.25),
    };
  }

  return { all: totalCalories };
}

export function calculateMacroAllocation(
  protein: number,
  carbs: number,
  fat: number
): Record<string, number> {
  const total = protein + carbs + fat;
  return {
    proteinPercent: Math.round((protein / total) * 100),
    carbsPercent: Math.round((carbs / total) * 100),
    fatPercent: Math.round((fat / total) * 100),
  };
}

export function isWithinMacroTarget(
  actual: number,
  target: number,
  tolerance: number = 0.1
): boolean {
  const min = target * (1 - tolerance);
  const max = target * (1 + tolerance);
  return actual >= min && actual <= max;
}

export function generateWeeklyMealPlan(
  meals: any[],
  preferences: {
    dailyCalories: number;
    preferredCount: number;
    dietaryPreferences: string[];
  }
): any {
  // Placeholder implementation - would be more sophisticated in production
  return {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
}
