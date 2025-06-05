'use client';

import React, { useState } from 'react';
import styles from './NavBar.module.css';
import Link from 'next/link';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on navigation for all mobile/tablet ≤1024px
  const handleNavClick = () => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(max-width: 1024px)').matches) {
        setMenuOpen(false);
      }
    }
  };

  return (
    <>
      <div className={styles.brassGradientBar} aria-hidden="true" />
      <nav className={styles.navbar} aria-label="Main Navigation">
        <div className={styles.toolbarInner}>
          {/* Hamburger for mobile/tablet */}
          <button
            className={styles.hamburger}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="navlist"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            tabIndex={0}
          >
            <span className={styles.hamburgerIcon} aria-hidden="true" />
          </button>
          <ul
            id="navlist"
            className={
              styles.navlist +
              (menuOpen ? ' ' + styles.menuOpen : '')
            }
            role="menubar"
          >
            <li className={styles.navitem} role="none">
              <Link href="/" className={styles.navlink} role="menuitem" tabIndex={0} onClick={handleNavClick}>
                HOME
              </Link>
            </li>
            <li className={styles.navitem} role="none">
              <Link href="/meet-the-signers" className={styles.navlink} role="menuitem" tabIndex={0} onClick={handleNavClick}>
                MEET THE SIGNERS
              </Link>
            </li>
            <li className={styles.navitem} role="none">
              <Link href="/volunteer" className={styles.navlink} role="menuitem" tabIndex={0} onClick={handleNavClick}>
                VOLUNTEER PAGE
              </Link>
            </li>
            <li className={styles.navitem} role="none">
              <Link href="/activation-history" className={styles.navlink} role="menuitem" tabIndex={0} onClick={handleNavClick}>
                ACTIVATION HISTORY
              </Link>
            </li>
            <li className={styles.navitem} role="none">
              <Link href="/qsl-card" className={styles.navlink} role="menuitem" tabIndex={0} onClick={handleNavClick}>
                QSL CARD
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className={styles.brassGradientBar} aria-hidden="true" />
    </>
  );
}