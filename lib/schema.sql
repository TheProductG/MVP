-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  height DECIMAL,
  weight DECIMAL,
  gender TEXT,
  dietary_preferences TEXT[],
  health_goals TEXT[],
  daily_calorie_target INTEGER,
  daily_protein_target DECIMAL,
  daily_carbs_target DECIMAL,
  daily_fat_target DECIMAL,
  weekly_activity_hours DECIMAL,
  preferred_meal_count INTEGER DEFAULT 3,
  meal_prep_capacity TEXT DEFAULT 'medium',
  budget_per_day DECIMAL,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Master Meals table
CREATE TABLE IF NOT EXISTS public.master_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  ingredients TEXT[],
  instructions TEXT[],
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 1,
  calories INTEGER NOT NULL,
  protein_grams DECIMAL NOT NULL,
  carbs_grams DECIMAL NOT NULL,
  fat_grams DECIMAL NOT NULL,
  fiber_grams DECIMAL,
  cost_usd DECIMAL,
  dietary_tags TEXT[],
  difficulty TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Meal Plans table
CREATE TABLE IF NOT EXISTS public.user_meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  target_calories INTEGER,
  target_protein DECIMAL,
  target_carbs DECIMAL,
  target_fat DECIMAL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily Logs table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES public.user_meal_plans(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  breakfast_meal_id UUID REFERENCES public.master_meals(id),
  lunch_meal_id UUID REFERENCES public.master_meals(id),
  dinner_meal_id UUID REFERENCES public.master_meals(id),
  snack_meal_id UUID REFERENCES public.master_meals(id),
  total_calories INTEGER DEFAULT 0,
  total_protein DECIMAL DEFAULT 0,
  total_carbs DECIMAL DEFAULT 0,
  total_fat DECIMAL DEFAULT 0,
  total_fiber DECIMAL DEFAULT 0,
  mood TEXT,
  energy_level INTEGER,
  hunger_level INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Social Events table
CREATE TABLE IF NOT EXISTS public.social_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL,
  location TEXT,
  expected_meal_count INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reset History table
CREATE TABLE IF NOT EXISTS public.reset_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reset_date DATE NOT NULL,
  reason TEXT,
  previous_plan_id UUID REFERENCES public.user_meal_plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Swap History table
CREATE TABLE IF NOT EXISTS public.swap_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_slot TEXT NOT NULL,
  original_meal_id UUID NOT NULL REFERENCES public.master_meals(id),
  new_meal_id UUID NOT NULL REFERENCES public.master_meals(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_daily_logs_user_date ON public.daily_logs(user_id, date);
CREATE INDEX idx_daily_logs_meal_plan ON public.daily_logs(meal_plan_id);
CREATE INDEX idx_user_meal_plans_user ON public.user_meal_plans(user_id);
CREATE INDEX idx_social_events_user ON public.social_events(user_id);
CREATE INDEX idx_social_events_date ON public.social_events(event_date);
CREATE INDEX idx_swap_history_user_date ON public.swap_history(user_id, date);
CREATE INDEX idx_reset_history_user ON public.reset_history(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reset_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swap_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_meals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for master_meals (public read access)
CREATE POLICY "Master meals are readable by all authenticated users"
  ON public.master_meals FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policies for user_meal_plans
CREATE POLICY "Users can read own meal plans"
  ON public.user_meal_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create meal plans"
  ON public.user_meal_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
  ON public.user_meal_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
  ON public.user_meal_plans FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for daily_logs
CREATE POLICY "Users can read own daily logs"
  ON public.daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create daily logs"
  ON public.daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
  ON public.daily_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON public.daily_logs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for social_events
CREATE POLICY "Users can read own social events"
  ON public.social_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create social events"
  ON public.social_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social events"
  ON public.social_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social events"
  ON public.social_events FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for reset_history
CREATE POLICY "Users can read own reset history"
  ON public.reset_history FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for swap_history
CREATE POLICY "Users can read own swap history"
  ON public.swap_history FOR SELECT
  USING (auth.uid() = user_id);
