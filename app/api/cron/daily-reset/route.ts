import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a trusted source (cron job)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Get all users
    const { data: users } = await supabaseAdmin.from('users').select('id');

    if (!users) {
      return NextResponse.json({ success: true, message: 'No users to reset' });
    }

    // Create daily logs for each user if they don't exist
    for (const user of users) {
      const { data: existingLog } = await supabaseAdmin
        .from('daily_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (!existingLog) {
        await supabaseAdmin.from('daily_logs').insert([
          {
            user_id: user.id,
            date: today,
            total_calories: 0,
            total_protein: 0,
            total_carbs: 0,
            total_fat: 0,
            total_fiber: 0,
          },
        ]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Daily reset completed',
    });
  } catch (error) {
    console.error('Error in daily reset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
