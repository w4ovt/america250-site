'use client';

import React, { useState } from 'react';
import styles from './NavBar.module.css';
import Link from 'next/link';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Helper to close menu on link click (only for mobile portrait)
  const handleNavClick = () => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(max-width: 600px) and (orientation: portrait)').matches) {
        setMenuOpen(false);
      }
    }
  };

  return (
    <>
      <div className={styles.brassGradientBar} />
      <nav className={styles.navbar} aria-label="Main Navigation">
        <div className={styles.toolbarInner}>
          {/* Hamburger for mobile portrait */}
          <button
            className={styles.hamburger}
            aria-label="Open navigation menu"
            aria-controls="navlist"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            <span className={styles.hamburgerIcon} />
          </button>
          <ul
            id="navlist"
            className={
              styles.navlist +
              (menuOpen ? ' ' + styles.menuOpen : '')
            }
          >
            <li className={styles.navitem}>
              <Link href="/" className={styles.navlink} onClick={handleNavClick}>HOME</Link>
            </li>
            <li className={styles.navitem}>
              <Link href="/meet-the-signers" className={styles.navlink} onClick={handleNavClick}>
                <span className={styles.meetResponsive}>
                  <span className={styles.meetWord}>MEET</span>
                  <span className={styles.meetWord}>THE</span>
                  <span className={styles.meetWord}>SIGNERS</span>
                </span>
              </Link>
            </li>
            <li className={styles.navitem}>
              <Link href="/volunteer" className={styles.navlink} onClick={handleNavClick}>VOLUNTEER PAGE</Link>
            </li>
            <li className={styles.navitem}>
              <Link href="/activation-history" className={styles.navlink} onClick={handleNavClick}>ACTIVATION HISTORY</Link>
            </li>
            <li className={`${styles.navitem} ${styles.aboutUs}`}>
              <Link href="/about-us" className={styles.navlink} onClick={handleNavClick}>ABOUT US</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className={styles.brassGradientBar} />
    </>
  );
}
