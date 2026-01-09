'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SocialEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('social_events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });

      setEvents(data || []);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const deleteEvent = async (id: string) => {
    await supabase.from('social_events').delete().eq('id', id);
    setEvents(events.filter((e) => e.id !== id));
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Social Events</h1>
        <Link
          href="/dashboard/social-events/new"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-semibold mb-2">No Events Planned</h2>
          <p className="text-gray-600 mb-6">Add upcoming social events to plan ahead!</p>
          <Link
            href="/dashboard/social-events/new"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Date</div>
                      <div className="font-semibold">
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Type</div>
                      <div className="font-semibold capitalize">{event.event_type}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Location</div>
                      <div className="font-semibold">{event.location || 'TBD'}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Meals</div>
                      <div className="font-semibold">{event.expected_meal_count}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
