import './globals.css';

export const metadata = {
  title: 'America250 Radio',
  description: 'Commemorating 250 Years of American Independence',
};

import NavBar from './components/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}