'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react'; // <-- FIXED: add useEffect here

const TwoLineLabel = ({ top, bottom }: { top: string; bottom: string }) => (
  <span
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 'max-content',
      margin: '0 auto',
    }}
  >
    <span style={{ lineHeight: '1.12', margin: 0 }}>{top}</span>
    <span style={{ lineHeight: '1.12', margin: 0 }}>{bottom}</span>
  </span>
);

const navLinks = [
  { name: <TwoLineLabel top="MEET THE" bottom="SIGNERS" />, path: '/signers' },
  { name: <TwoLineLabel top="PATRIOT" bottom="PAGE" />, path: '/patriots' },
  { name: <TwoLineLabel top="UPCOMING" bottom="EVENTS" />, path: '/events' },
  { name: <TwoLineLabel top="VOLUNTEER" bottom="PAGE" />, path: '/volunteers' },
  { name: <TwoLineLabel top="ACTIVATIONS" bottom="HISTORY" />, path: '/history' },
  { name: 'DONATIONS', path: '/donate' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close nav on route change (for accessibility)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="america250-navbar" aria-label="Main Navigation">
      <div className="america250-navbar-inner">
        <Link href="/" className="america250-navbar-homeicon" aria-label="Home">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Image
              src="/inkwell.webp"
              alt="Home"
              width={120}
              height={120}
              style={{
                objectFit: 'contain',
                width: '4.5rem',
                height: '4.5rem',
                background: 'none',
                marginRight: '0',
                marginBottom: '-0.3rem',
                display: 'block',
              }}
              draggable={false}
              priority
            />
            <span className="america250-navbar-link-text navbar-home-label">HOME</span>
          </div>
        </Link>
        <button
          className="america250-navbar-hamburger"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="america250-navbar-links"
          onClick={() => setMobileOpen(open => !open)}
        >
          ☰
        </button>
        <div
          className={
            "america250-navbar-links" + (mobileOpen ? " open" : "")
          }
          id="america250-navbar-links"
        >
          {navLinks.map(link => (
            <Link
              key={typeof link.name === 'string' ? link.path : link.path}
              href={link.path}
              className={
                'america250-navbar-link' +
                (pathname === link.path ? ' active' : '')
              }
              tabIndex={0}
              onClick={() => setMobileOpen(false)}
            >
              <span className="america250-navbar-link-text" style={{ textAlign: 'center', width: '100%' }}>
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="america250-navbar-separator" />
    </nav>
  );
}