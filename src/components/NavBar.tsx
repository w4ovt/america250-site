// src/components/NavBar.tsx

'use client';

import React from 'react';
import styles from './NavBar.module.css';
import Link from 'next/link';

export default function NavBar() {
  return (
    <>
      <div className={styles['brass-gradient-bar']} />
      <nav className={styles.navbar} aria-label="Main Navigation">
        <div className={styles['toolbar-inner']}>
          <ul className={styles.navlist}>
            <li className={styles.navitem}>
              <Link href="/" className={styles.navlink}>HOME</Link>
            </li>
            <li className={styles.navitem}>
              <Link href="/meet-the-signers" className={styles.navlink}>MEET THE SIGNERS</Link>
            </li>
            <li className={styles.navitem}>
              <Link href="/volunteer" className={styles.navlink}>VOLUNTEER PAGE</Link>
            </li>
            <li className={styles.navitem}>
              <Link href="/activations-history" className={styles.navlink}>ACTIVATION HISTORY</Link>
            </li>
            <li className={styles.navitem}>
              <Link href="/about-us" className={styles.navlink}>ABOUT US</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className={styles['brass-gradient-bar']} />
    </>
  );
}