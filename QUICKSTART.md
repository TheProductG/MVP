# FlexPlan MVP - Quick Start Guide

Get your FlexPlan MVP running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free at https://supabase.com)

## Steps

### 1. Install Dependencies (1 minute)

```bash
cd C:\Users\ifaiz\Desktop\flexplan-mvp
npm install
```

### 2. Set Up Supabase Database (2 minutes)

1. Log into your Supabase dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy all contents from `lib/schema.sql`
5. Paste and run in SQL Editor
6. Confirm all tables were created

### 3. Verify Environment Variables (1 minute)

Check that `.env.local` contains your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://cuqkbsrsvgbbagycqmve.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7V_F1WgnkV_gdWaiDeAG6w_KNGxjF7B
SUPABASE_SERVICE_ROLE_KEY=sb_secret__QTofYh9nqQDSMlZx3Fo8Q_aeHJtQk9
```

If missing, add them now.

### 4. Seed Sample Data (Optional - 1 minute)

Add sample meals to your database:

```bash
# Using Node.js script (if available)
npm run seed
```

Or manually add meals through Supabase dashboard:
1. Go to Table Editor
2. Click `master_meals` table
3. Add meals manually (sample data is in `lib/seed-data.ts`)

### 5. Start Development Server (automatic)

```bash
npm run dev
```

The server starts at: **http://localhost:3000**

## First Time Using the App

1. **Homepage**: Visit http://localhost:3000
2. **Sign Up**: Click "Sign Up Free"
   - Email: use any email (e.g., test@example.com)
   - Password: create a secure password
   - Name: enter your name
3. **Onboarding**: Complete the 3-step setup
   - Step 1: Enter age, weight, height, calorie target
   - Step 2: Select health goals and dietary preferences
   - Step 3: Choose meal count and prep capacity
4. **Dashboard**: Explore the dashboard features
   - Browse 100+ meals in the meal library
   - Create your first meal plan
   - Log your meals and track nutrition

## Features to Try

### Meal Planning
- Go to "Meal Plans" → "Create New Plan"
- Set dates and nutrition targets
- Generate a weekly meal plan

### Daily Tracking
- Go to "Daily Log"
- Select a date
- Log your meals
- Track mood and energy

### Social Events
- Go to "Social Events" → "Add Event"
- Plan for restaurants, parties, etc.
- Adjust your nutrition accordingly

### Analytics
- Go to "Analytics"
- View 30-day statistics
- Check mood distribution
- Track consistency

## Troubleshooting

### "User not found" error
- Complete the onboarding flow after signup

### Meals not showing
- Seed sample data manually through Supabase

### Port 3000 already in use
```bash
npm run dev -- -p 3001  # Use port 3001 instead
```

### Environment variables not loading
- Restart the dev server after updating `.env.local`

## Project Structure

```
flexplan-mvp/
├── app/                    # Pages and layouts
├── components/             # Reusable components
├── lib/                    # Utilities and database
├── types/                  # TypeScript definitions
├── middleware.ts           # Authentication middleware
├── tailwind.config.js      # Styling configuration
└── .env.local              # Environment variables
```

## Available Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Linting
npm run lint             # Run ESLint
```

## Key Files

- `app/layout.tsx` - Root layout
- `app/page.tsx` - Home page
- `lib/schema.sql` - Database schema
- `lib/seed-data.ts` - Sample meal data
- `.env.local` - Configuration

## Next Steps

1. Customize meal data in `lib/seed-data.ts`
2. Update colors in `tailwind.config.js`
3. Add your branding to the home page
4. Deploy to Vercel or self-host
5. Set up cron jobs for daily resets

## Documentation

- **Full Setup**: See `SETUP.md`
- **Project Overview**: See `README.md`
- **Complete Details**: See `PROJECT_SUMMARY.md`

## Need Help?

Check these resources:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs
- React: https://react.dev

## You're All Set!

Your FlexPlan MVP is ready to use. Start by:

1. Creating an account
2. Completing onboarding
3. Browsing the meal library
4. Creating your first meal plan
5. Logging your daily meals

Happy meal planning!
