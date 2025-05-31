// src/app/layout.tsx

import './globals.css';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'America250',
  description: 'Signaling the Spirit of America',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="parchment-bg">
        {/* Navbar appears on every page */}
        <NavBar />
        {/* Main page content */}
        {children}
      </body>
    </html>
  );
}