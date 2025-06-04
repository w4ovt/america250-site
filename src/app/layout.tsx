// src/app/layout.tsx

import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'America250',
  description: 'Signaling the Spirit of America',
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}