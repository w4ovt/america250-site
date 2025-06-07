// src/app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Dummy fetch function; replace with actual Neon DB/API fetch for production
async function fetchIsOnAir(): Promise<boolean> {
  return false; // Replace with API call logic
}

export default function Home() {
  const [isOnAir, setIsOnAir] = useState(false);

  useEffect(() => {
    fetchIsOnAir().then(setIsOnAir);
  }, []);

  // Optimized pledge text formatting for different screen sizes
  const pledgeText = `And for the support of this Declaration, with a firm reliance on the protection of divine Providence, we mutually pledge to each other our Lives, our Fortunes and our sacred Honor.`;

  return (
    <main
      className="parchment-bg"
      style={{
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      {/* --- HEADER IMAGE (HERO ART) --- */}
      <div
        style={{
          width: '100vw',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          position: 'relative',
        }}
      >
        <Image
          src="/america250-website-header.webp"
          alt="America 250 Header"
          width={1440}
          height={960}
          className="america250-header-image"
          style={{
            display: 'block',
            width: '100vw',
            height: 'auto',
            maxWidth: '100%',
            objectFit: 'cover',
            margin: 0,
            padding: 0,
            border: 'none',
            filter: 'brightness(1.4) contrast(1.24)',
          }}
          draggable={false}
          priority
        />
      </div>

      {/* --- SORA AMERICA250 TITLE IMAGE --- */}
      <div
        className="header-image-container"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          margin: "2rem 0",
        }}
      >
        <picture>
          <source srcSet="/america250-header.webp" type="image/webp" />
          <img
            src="/america250-header.png"
            alt="AMERICA 250"
            className="america250-header-image"
            style={{
              width: "100%",
              maxWidth: "1200px",
              height: "auto",
              display: "block",
              margin: 0,
              padding: 0,
            }}
            draggable={false}
          />
        </picture>
      </div>

      {/* --- MAHOGANY SEPARATOR ABOVE TITLE BLOCK --- */}
      <div className="mahogany-separator" aria-hidden="true"></div>

      {/* --- MAIN TITLE TEXT BLOCK WITH DATE ON NEW LINE --- */}
      <div className="america250-page-title">
        <span className="america250-title-line">america250</span>
        <span className="america250-title-line">amateur radio</span>
        <span className="america250-title-line">special event</span>
        <span className="america250-page-title-date">july 01 – 13, 2025</span>
      </div>

      {/* --- MAHOGANY SEPARATOR BELOW TITLE BLOCK --- */}
      <div className="mahogany-separator" aria-hidden="true"></div>

      {/* === PLEDGE QUOTE WITH QUILL/INKWELL (Responsive) === */}
      <section>
        <div className="pledge-quote-block">
          {/* Quill positioned based on screen size */}
          <img
            src="/inkwell.webp"
            alt="Quill and Inkwell"
            className="pledge-quill-img"
            draggable={false}
          />
          <div className="pledge-quote-text">
            {pledgeText}
          </div>
        </div>
        <div className="pledge-plaque">
          <img
            src="/plague.webp"
            alt="Declaration of Independence Signer's Pledge Plaque"
            style={{ display: 'block', margin: '0 auto', borderRadius: 5 }}
            draggable={false}
          />
        </div>
        <div className="mahogany-separator" aria-hidden="true"></div>
      </section>

      {/* --- ON AIR / OFF AIR BADGE --- */}
      <div
        className="onair-status-block"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '2.5vw 0 1.2vw 0',
          width: '100%',
          minHeight: 150,
        }}
      >
        {isOnAir ? (
          <Image
            src="/onair-badge.png"
            alt="ON AIR"
            width={350}
            height={233}
            sizes="(max-width: 600px) 80vw, 350px"
            className="onair-badge onair-flash"
            style={{
              maxWidth: 'clamp(180px, 80vw, 350px)',
              height: 'auto',
              boxShadow: '0 0 36px #e73c07, 0 0 10px #ffd700'
            }}
            priority
            draggable={false}
          />
        ) : (
          <Image
            src="/offair-badge.png"
            alt="OFF AIR"
            width={350}
            height={233}
            sizes="(max-width: 600px) 80vw, 350px"
            className="onair-badge"
            style={{
              maxWidth: 'clamp(180px, 80vw, 350px)',
              height: 'auto',
              filter: 'grayscale(35%)'
            }}
            priority
            draggable={false}
          />
        )}
      </div>

      {/* --- ON AIR FLASH ANIMATION KEYFRAMES & RESPONSIVE TITLE STYLES --- */}
      <style jsx global>{`
        @keyframes onAirFlash {
          0%, 60% {
            opacity: 1;
            filter: drop-shadow(0 0 32px #e73c07) brightness(1.15);
          }
          70%, 100% {
            opacity: 0.4;
            filter: drop-shadow(0 0 2px #e73c07) brightness(0.85);
          }
        }
        .onair-flash {
          animation: onAirFlash 1.07s steps(1) infinite;
        }

        /* === AMERICA250 TITLE RESPONSIVE LINE CONTROL === */
        /* Desktop: 3 lines (amateur radio + special event on one line) */
        @media (min-width: 1200px) {
          .america250-title-line {
            display: block;
            white-space: normal;
          }
          .america250-title-line:nth-child(2),
          .america250-title-line:nth-child(3) {
            display: inline;
            white-space: pre;
          }
          .america250-title-line:nth-child(3)::before {
            content: " ";
          }
        }
        /* Portrait/mobile: 4 lines, each phrase on its own line */
        @media (max-width: 1199px) {
          .america250-title-line {
            display: block !important;
            white-space: nowrap;
          }
        }
      `}</style>
    </main>
  );
}
