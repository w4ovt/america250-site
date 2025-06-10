'use client';

import React, { useState, useEffect } from 'react';
import styles from './NavBar.module.css';
import Link from 'next/link';

const MENU_ITEMS = [
  { href: '/', label: 'HOME' },
  { href: '/meet-the-signers', label: 'MEET THE SIGNERS' },
  { href: '/volunteer', label: 'VOLUNTEER PAGE' },
  { href: '/activation-history', label: 'ACTIVATION HISTORY' },
  { href: '/qsl-card', label: 'QSL CARD' }
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [forceHamburger, setForceHamburger] = useState(false);

  // Use effect to trigger hamburger if window is too narrow for nav
  useEffect(() => {
    function handleResize() {
      // Adjust 1050px breakpoint as needed for your font/spacing
      setForceHamburger(window.innerWidth < 1050);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Always close menu on nav click in hamburger mode
  const handleNavClick = () => {
    if (forceHamburger) setMenuOpen(false);
  };

  return (
    <>
      <div className={styles.brassGradientBar} aria-hidden="true" />
      <nav className={styles.navbar} aria-label="Main Navigation">
        <div className={styles.toolbarInner}>
          {/* Hamburger only appears when forced by window size */}
          <button
            className={styles.hamburger}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="navlist"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            tabIndex={0}
            style={{
              display: forceHamburger ? 'block' : 'none'
            }}
          >
            <span className={styles.hamburgerIcon} aria-hidden="true" />
          </button>
          <ul
            id="navlist"
            className={
              styles.navlist +
              (menuOpen && forceHamburger ? ' ' + styles.menuOpen : '')
            }
            role="menubar"
            style={{
              display: forceHamburger ? (menuOpen ? 'flex' : 'none') : 'flex'
            }}
          >
            {MENU_ITEMS.map((item, idx) => (
              <li className={styles.navitem} role="none" key={item.href}>
                <Link href={item.href} className={styles.navlink} role="menuitem" tabIndex={0} onClick={handleNavClick}>
                  {item.label}
                </Link>
                {/* Keep the vertical separator except after the last item */}
                {idx !== MENU_ITEMS.length - 1 && (
                  <span className={styles.vseparator} aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className={styles.brassGradientBar} aria-hidden="true" />
    </>
  );
}
