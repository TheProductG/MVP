# FlexPlan MVP - Behavioral Meal Planning System

A comprehensive Next.js 16 application for smart meal planning with behavioral science approach.

## Features

- Behavioral psychology-based meal planning
- 100+ meals database with complete nutrition information
- Flexible meal swapping and adjustments
- Social event planning and management
- Daily nutrition tracking with mood/energy logging
- Weekly meal plan generation
- Analytics and insights
- User profiles with customizable preferences
- Responsive design with Tailwind CSS
- Type-safe with TypeScript
- Server-side rendering and server actions

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **Form Management**: React Hook Form
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. **Set up database schema:**
- Log into your Supabase dashboard
- Go to SQL Editor
- Create a new query
- Copy the contents of `lib/schema.sql` into the editor
- Run the query to create all tables, indexes, and RLS policies

4. **Seed the database with meals:**
- You can create a script to seed the database using data from `lib/seed-data.ts`
- Or manually insert meals through Supabase dashboard

## Project Structure

```
flexplan-mvp/
├── app/                           # Next.js app directory
│   ├── api/                       # API routes and server actions
│   │   ├── auth/callback/         # Authentication callback
│   │   └── cron/daily-reset/      # Cron job for daily resets
│   ├── dashboard/                 # Dashboard pages
│   │   ├── analytics/             # Analytics and insights
│   │   ├── daily-log/             # Daily nutrition logging
│   │   ├── meals/                 # Meal browsing
│   │   ├── meal-plans/            # Meal plan management
│   │   ├── settings/              # User settings
│   │   └── social-events/         # Social event planning
│   ├── login/                     # Login page
│   ├── signup/                    # Sign up page
│   ├── onboarding/                # User onboarding flow
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/                    # Reusable React components
│   ├── dashboard-nav.tsx          # Dashboard navigation
│   ├── meal-card.tsx              # Meal card component
│   └── nutrition-tracker.tsx      # Nutrition tracking UI
├── lib/                           # Utility functions and helpers
│   ├── supabase/                  # Supabase clients
│   │   ├── client.ts              # Client-side Supabase
│   │   └── server.ts              # Server-side Supabase
│   ├── schema.sql                 # Database schema
│   ├── seed-data.ts               # Meal seed data
│   ├── utils.ts                   # Utility functions
│   ├── constants.ts               # Constants and enums
│   └── validators.ts              # Zod schemas
├── types/                         # TypeScript type definitions
│   └── database.ts                # Database schema types
├── middleware.ts                  # Next.js middleware
├── tsconfig.json                  # TypeScript configuration
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── package.json                   # Dependencies
└── .env.local                     # Environment variables
```

## Key Features

### 1. Authentication
- Email/password signup and login
- Supabase Auth integration
- Protected routes with middleware
- User profile creation on signup

### 2. Meal Management
- Browse 100+ meals categorized by type
- Filter by category or search
- Complete nutrition information for each meal
- Meal cards with macros visualization
- Difficulty levels and prep time

### 3. Meal Planning
- Create custom meal plans with dates
- Set nutrition targets
- Generate weekly meal plans automatically
- Flexible meal swapping
- Track meal history

### 4. Daily Logging
- Log meals by date
- Track nutrition automatically
- Record mood and energy levels
- Add notes about your day
- View daily nutrition summary

### 5. Social Events
- Plan ahead for social gatherings
- Record event details and type
- Estimate meal counts
- Track event history
- Adjust nutrition goals accordingly

### 6. Analytics
- View 30-day statistics
- Track calorie and macro trends
- Mood distribution analysis
- Consistency tracking
- Weekly trends visualization

### 7. User Preferences
- Customize daily calorie targets
- Set macro targets
- Select dietary preferences
- Choose health goals
- Manage meal prep capacity

## Database Tables

1. **users** - User profiles and preferences
2. **master_meals** - Library of all available meals
3. **user_meal_plans** - User's meal plans
4. **daily_logs** - Daily nutrition and mood logs
5. **social_events** - User's social events
6. **reset_history** - History of plan resets
7. **swap_history** - History of meal swaps

## Server Actions

- `addMealToDay` - Add a meal to a specific day
- `swapMeal` - Swap one meal for another
- `generateWeeklyPlan` - Generate a week's worth of meals

## API Routes

- `GET /api/auth/callback` - OAuth callback handler
- `POST /api/cron/daily-reset` - Daily reset cron job

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

Required environment variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server-side operations)
- `CRON_SECRET` - Secret for cron jobs (optional)

## Security

- Row Level Security (RLS) policies implemented on all tables
- Users can only access their own data
- Service role key used only on server-side
- Password hashing handled by Supabase
- CSRF protection with server actions

## Performance

- Server-side rendering for fast initial page loads
- Client-side caching with Supabase
- Optimized queries with proper indexing
- Code splitting with Next.js
- Image optimization ready

## Future Enhancements

- Meal recommendation algorithm
- Social sharing and meal plan recommendations
- Mobile app with React Native
- Payment integration for premium features
- Grocery list generation
- Recipe scaling and portioning
- Integration with fitness trackers
- Community meal sharing
- AI-powered meal suggestions

## Contributing

This is an MVP project. Feel free to extend and customize features as needed.

## License

MIT

## Support

For issues or questions about the FlexPlan MVP, please refer to the documentation or contact support.
