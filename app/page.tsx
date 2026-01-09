'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">FlexPlan</h1>
            </div>
            <div className="flex gap-4">
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/api/auth/logout"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Meal Planning with Behavioral Science
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            FlexPlan uses behavioral psychology and nutrition science to create personalized meal plans
            that adapt to your lifestyle, preferences, and social events.
          </p>
          {!loading && !isAuthenticated && (
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Why FlexPlan?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Behavioral Science',
                description: 'Plans based on psychological principles for sustainable change',
                icon: '🧠',
              },
              {
                title: 'Flexible Planning',
                description: 'Swap meals, adjust portions, and handle social events',
                icon: '🔄',
              },
              {
                title: 'Nutrition Tracking',
                description: 'Monitor calories, macros, and nutrients daily',
                icon: '📊',
              },
              {
                title: 'Meal Library',
                description: '100+ meals with complete nutrition information',
                icon: '🍽️',
              },
              {
                title: 'Personal Goals',
                description: 'Set and track custom health and fitness goals',
                icon: '🎯',
              },
              {
                title: 'Social Events',
                description: 'Plan ahead for dinners, celebrations, and gatherings',
                icon: '🎉',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-lg hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 FlexPlan MVP. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
