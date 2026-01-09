export const MEAL_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export const DIETARY_PREFERENCES = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Keto',
  'Paleo',
  'Dairy-free',
  'Nut-free',
  'None',
];

export const HEALTH_GOALS = [
  'Weight Loss',
  'Muscle Gain',
  'Maintenance',
  'Energy',
  'Overall Health',
  'Athletic Performance',
];

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const MEAL_PREP_CAPACITY = ['low', 'medium', 'high'] as const;

export const MOOD_OPTIONS = ['poor', 'fair', 'good', 'excellent'] as const;

export const ENERGY_LEVELS = [1, 2, 3, 4, 5] as const;

export const SOCIAL_EVENT_TYPES = [
  'restaurant',
  'dinner_party',
  'celebration',
  'family_gathering',
  'other',
] as const;

export const DEFAULT_CALORIE_ALLOCATION = {
  breakfast: 0.3,
  lunch: 0.4,
  dinner: 0.3,
  snack: 0,
};

export const MACRO_RANGES = {
  protein: {
    min: 10,
    max: 35,
    unit: '%',
  },
  carbs: {
    min: 45,
    max: 65,
    unit: '%',
  },
  fat: {
    min: 20,
    max: 35,
    unit: '%',
  },
};
