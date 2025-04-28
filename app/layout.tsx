// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'VATSME Monitor',
  description: 'EU VAT threshold tracking for micro-sellers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
