import { z } from 'zod';

export const createMealPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  description: z.string().optional(),
  startDate: z.string().date(),
  endDate: z.string().date().optional(),
  targetCalories: z.number().positive().optional(),
  targetProtein: z.number().positive().optional(),
  targetCarbs: z.number().positive().optional(),
  targetFat: z.number().positive().optional(),
});

export const createSocialEventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  eventDate: z.string().date(),
  eventType: z.enum(['restaurant', 'dinner_party', 'celebration', 'family_gathering', 'other']),
  location: z.string().optional(),
  expectedMealCount: z.number().positive().default(1),
  notes: z.string().optional(),
});

export const updateUserProfileSchema = z.object({
  fullName: z.string().min(1),
  age: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dailyCalories: z.number().positive().optional(),
  dailyProtein: z.number().positive().optional(),
  dailyCarbs: z.number().positive().optional(),
  dailyFat: z.number().positive().optional(),
  mealPrepCapacity: z.enum(['low', 'medium', 'high']).optional(),
  preferredMealCount: z.number().min(3).max(5).optional(),
});

export const logMealSchema = z.object({
  date: z.string().date(),
  mealSlot: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  mealId: z.string().uuid(),
});

export const swapMealSchema = z.object({
  date: z.string().date(),
  mealSlot: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  originalMealId: z.string().uuid(),
  newMealId: z.string().uuid(),
  reason: z.string().optional(),
});

export type CreateMealPlanInput = z.infer<typeof createMealPlanSchema>;
export type CreateSocialEventInput = z.infer<typeof createSocialEventSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type LogMealInput = z.infer<typeof logMealSchema>;
export type SwapMealInput = z.infer<typeof swapMealSchema>;
