const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const meals = [
  // Breakfast meals
  {
    name: 'Oatmeal with Berries',
    description: 'Classic oatmeal topped with fresh mixed berries and honey',
    category: 'breakfast',
    ingredients: ['oatmeal', 'blueberries', 'strawberries', 'honey', 'almond milk'],
    instructions: ['Cook oatmeal', 'Add berries', 'Drizzle honey', 'Serve warm'],
    prep_time_minutes: 5,
    cook_time_minutes: 10,
    servings: 1,
    calories: 320,
    protein_grams: 8,
    carbs_grams: 58,
    fat_grams: 4,
    fiber_grams: 5,
    cost_usd: 1.50,
    dietary_tags: ['vegetarian', 'vegan', 'gluten-free-oats'],
    difficulty: 'easy',
  },
  {
    name: 'Scrambled Eggs with Toast',
    description: 'Fluffy scrambled eggs with whole wheat toast and avocado',
    category: 'breakfast',
    ingredients: ['eggs', 'bread', 'butter', 'avocado', 'salt', 'pepper'],
    instructions: ['Beat eggs', 'Cook in butter', 'Toast bread', 'Add avocado'],
    prep_time_minutes: 3,
    cook_time_minutes: 8,
    servings: 1,
    calories: 380,
    protein_grams: 15,
    carbs_grams: 35,
    fat_grams: 18,
    fiber_grams: 3,
    cost_usd: 2.00,
    dietary_tags: ['vegetarian'],
    difficulty: 'easy',
  },
  // Add more meals as needed
];

async function seed() {
  try {
    console.log('Starting database seed...');

    // Insert meals
    const { data, error } = await supabase
      .from('master_meals')
      .insert(meals)
      .select();

    if (error) {
      console.error('Error seeding meals:', error);
      process.exit(1);
    }

    console.log(`Successfully seeded ${data.length} meals`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
