# FlexPlan MVP Setup Guide

This guide walks you through setting up the FlexPlan MVP application from scratch.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- A Supabase account (free tier available at https://supabase.com)
- Git (optional)

## Step 1: Supabase Project Setup

1. Create a new Supabase project at https://supabase.com/dashboard
2. Copy your project credentials:
   - Project URL
   - Anon Key (public key)
   - Service Role Key (from project settings)

## Step 2: Database Setup

1. In your Supabase dashboard, navigate to the SQL Editor
2. Create a new query
3. Open `lib/schema.sql` from this project
4. Copy all the SQL content and paste it into the Supabase SQL Editor
5. Click "Run" to execute
6. Wait for confirmation that all tables, indexes, and RLS policies are created

The schema includes:
- `users` - User profiles with nutrition goals
- `master_meals` - Database of meals with nutrition info
- `user_meal_plans` - User's meal plans
- `daily_logs` - Daily nutrition and mood tracking
- `social_events` - Social event planning
- `reset_history` - Plan reset history
- `swap_history` - Meal swap history

## Step 3: Environment Variables

1. Copy the provided credentials into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Keep these credentials secure and never commit them to version control.

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Seed Meal Data

### Option A: Using the seed script

1. Create a Node.js script to seed meals:

```bash
# Create a seed file
cat > scripts/seed-meals.mjs << 'EOF'
import { createClient } from '@supabase/supabase-js';
import { generateExtendedSeedData } from './lib/seed-data.ts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const meals = generateExtendedSeedData();

const { data, error } = await supabase
  .from('master_meals')
  .insert(meals)
  .select();

if (error) {
  console.error('Error seeding meals:', error);
  process.exit(1);
}

console.log(`Successfully seeded ${data.length} meals!`);
process.exit(0);
EOF
```

2. Run the seed script:

```bash
node scripts/seed-meals.mjs
```

### Option B: Manual seeding through Supabase Dashboard

1. Go to your Supabase dashboard
2. Navigate to "Table Editor"
3. Select the `master_meals` table
4. Click "Insert row" and add meals manually
5. Or use the Data Editor to paste CSV/JSON data

## Step 6: Start Development Server

```bash
npm run dev
```

The application should be available at http://localhost:3000

## Step 7: Test the Application

1. Visit http://localhost:3000
2. Click "Sign Up" to create a new account
3. Complete the onboarding flow
4. Explore the dashboard and features

## Deployment

### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository at https://vercel.com/new
3. Add environment variables in the project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### Option B: Self-hosted (Docker)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t flexplan-mvp .
docker run -p 3000:3000 --env-file .env.local flexplan-mvp
```

## Common Issues and Troubleshooting

### Issue: "User not found" when accessing dashboard

**Solution**: Make sure you've completed the onboarding flow after signing up. The user profile is created during onboarding.

### Issue: Meals not showing in meal library

**Solution**: Ensure you've seeded the `master_meals` table with meal data.

### Issue: Authentication errors

**Solution**:
1. Verify your Supabase credentials in `.env.local`
2. Check that authentication is enabled in your Supabase project
3. Make sure the session is being properly stored

### Issue: Images not loading

**Solution**: The application has placeholder support for meal images. You can add image URLs in the `master_meals` table's `image_url` field.

## Configuration

### Daily Calorie Targets

Edit defaults in `lib/constants.ts`:

```typescript
export const DEFAULT_CALORIE_TARGETS = {
  sedentary: 1800,
  lightly_active: 2200,
  moderately_active: 2600,
  very_active: 3000,
};
```

### Meal Categories

Customize available categories in `lib/constants.ts`:

```typescript
export const MEAL_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack'];
```

## Features to Enable/Disable

### Cron Jobs

To enable daily reset cron jobs:

1. Set up a CRON_SECRET environment variable
2. Configure an external cron service (e.g., EasyCron, AWS EventBridge) to call:
   - `POST /api/cron/daily-reset` with header `Authorization: Bearer {CRON_SECRET}`

### Analytics

Analytics are enabled by default and use data from the `daily_logs` table.

## Next Steps

1. Customize meal data in `master_meals`
2. Adjust nutrition targets based on your users
3. Configure email notifications (optional)
4. Add meal images/photos
5. Implement payment system for premium features
6. Set up monitoring and error tracking

## Support and Resources

- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React: https://react.dev

## Database Backup

Regularly backup your Supabase database:

1. In Supabase dashboard, go to Settings > Database
2. Click "Backups"
3. Create manual backups or enable automatic backups

## Security Best Practices

1. Never commit `.env.local` to version control
2. Rotate your service role key regularly
3. Use Row Level Security (RLS) policies (already configured)
4. Keep dependencies updated: `npm audit` and `npm update`
5. Use HTTPS in production
6. Enable Supabase rate limiting
7. Monitor database queries for performance issues

## Performance Optimization

1. Enable database query caching in Supabase
2. Add indexes to frequently queried fields (already done)
3. Implement pagination for large meal lists
4. Use Next.js image optimization
5. Enable compression in your server configuration

## Monitoring

Set up error tracking:

1. Use Sentry, LogRocket, or similar service
2. Add error logging to API routes
3. Monitor database query performance
4. Track user engagement metrics

---

For more help, refer to the main README.md or consult the documentation for individual technologies used.
