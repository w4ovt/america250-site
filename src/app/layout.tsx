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
      <body
        style={{
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          width: '100vw',
          maxWidth: '100vw',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          // CRITICAL: No display: flex or alignItems here!
        }}
      >
        <NavBar />
        <main
          style={{
            minHeight: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            margin: 0,
            padding: 0,
            overflowX: 'hidden',
            boxSizing: 'border-box',
            // CRITICAL: No display: flex or alignItems here!
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
