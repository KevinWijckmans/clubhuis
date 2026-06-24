import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clubhuis',
  description: 'A private social app for your friend group',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
