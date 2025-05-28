// src/app/layout.tsx
import './globals.css'; // ✅ Correct import here for App Router

export const metadata = {
  title: 'America250 Radio',
  description: 'Commemorating 250 Years of American Independence',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
