import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FlexPlan MVP - Behavioral Meal Planning',
  description: 'Smart meal planning system with behavioral science approach',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
