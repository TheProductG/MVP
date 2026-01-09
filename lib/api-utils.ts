export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  };
}

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function formatCalories(calories: number): string {
  return `${calories.toLocaleString()} kcal`;
}

export function formatMacro(grams: number): string {
  return `${grams.toFixed(1)}g`;
}

export function calculateMacroPercentages(
  protein: number,
  carbs: number,
  fat: number
): { proteinPercent: number; carbsPercent: number; fatPercent: number } {
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;
  const totalCalories = proteinCalories + carbsCalories + fatCalories;

  if (totalCalories === 0) {
    return { proteinPercent: 0, carbsPercent: 0, fatPercent: 0 };
  }

  return {
    proteinPercent: Math.round((proteinCalories / totalCalories) * 100),
    carbsPercent: Math.round((carbsCalories / totalCalories) * 100),
    fatPercent: Math.round((fatCalories / totalCalories) * 100),
  };
}

export function isNutritionGoalMet(
  actual: number,
  target: number,
  tolerance: number = 0.1
): boolean {
  if (target === 0) return true;
  const difference = Math.abs(actual - target) / target;
  return difference <= tolerance;
}
