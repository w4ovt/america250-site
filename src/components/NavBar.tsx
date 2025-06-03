'use client';

import React from 'react';
import styles from './NavBar.module.css';
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className={styles.navbar} aria-label="Main Navigation">
      <div className={styles.inner}>
        {/* Left: HOME */}
        <div className={styles.navleft}>
          <Link href="/" className={styles.homeLink}>HOME</Link>
        </div>
        {/* Center: Nav links */}
        <ul className={styles.navlist}>
          <li className={styles.navitem}>
            <Link href="/meet-the-signers" className={styles.navlink}>
              <span className={styles.navtop}>MEET THE</span>
              <span className={styles.navbottom}>SIGNERS</span>
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link href="/patriot-page" className={styles.navlink}>
              <span className={styles.navtop}>PATRIOT</span>
              <span className={styles.navbottom}>PAGE</span>
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link href="/upcoming-events" className={styles.navlink}>
              <span className={styles.navtop}>UPCOMING</span>
              <span className={styles.navbottom}>EVENTS</span>
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link href="/volunteer" className={styles.navlink}>
              <span className={styles.navtop}>VOLUNTEER</span>
              <span className={styles.navbottom}>PAGE</span>
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link href="/activations-history" className={styles.navlink}>
              <span className={styles.navtop}>ACTIVATIONS</span>
              <span className={styles.navbottom}>HISTORY</span>
            </Link>
          </li>
          <li className={styles.navitem}>
            <Link href="/donations" className={styles.navlink}>
              <span className={styles.navtop}>DONATIONS</span>
              <span className={styles.navbottom}>SPONSORS</span>
            </Link>
          </li>
        </ul>
        {/* Right: CONTACT */}
        <div className={styles.navright}>
          <Link href="/contact" className={styles.contactLink}>CONTACT</Link>
        </div>
      </div>
    </nav>
  );
}
