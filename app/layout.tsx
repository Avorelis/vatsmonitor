// app/layout.tsx
import './globals.css';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';

export const metadata = {
  title: 'VATSME Monitor',
  description: 'EU VAT threshold tracking for micro-sellers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // we create the client only once so it isn't re-created on every render
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <SessionContextProvider supabaseClient={supabaseClient}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  );
}
