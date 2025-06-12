'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ActivationTable from '../components/ActivationTable';

export default function Home() {
  const [isOnAir, setIsOnAir] = useState(false);

  // Poll every 15 seconds for ON AIR status
  useEffect(() => {
    let mounted = true;

    async function fetchOnAirStatus() {
      try {
        const res = await fetch('/api/activations/onair');
        const data = await res.json();
        if (mounted) setIsOnAir(Boolean(data.onAir));
      } catch {
        if (mounted) setIsOnAir(false);
      }
    }

    fetchOnAirStatus();
    const interval = setInterval(fetchOnAirStatus, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const pledgeText = `And for the support of this Declaration, with a firm reliance on the protection of divine Providence, we mutually pledge to each other our Lives, our Fortunes and our sacred Honor.`;

  return (
    <main
      className="parchment-bg fullwidth-block"
      style={{
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* --- HEADER IMAGE (HERO ART) --- */}
      <div className="fullwidth-block" style={{ position: 'relative', overflow: 'hidden' }}>
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
      <div className="header-image-container fullwidth-block" style={{
        display: "flex",
        justifyContent: "center",
        margin: "2rem 0",
      }}>
        <picture>
          <source srcSet="/america250-header.webp" type="image/webp" />
          <img
            src="/america250-header.png"
            alt="AMERICA 250"
            className="america250-header-image"
            style={{
              width: "100vw",
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
      <div className="mahogany-separator fullwidth-block" aria-hidden="true"></div>

      {/* --- MAIN TITLE TEXT BLOCK WITH DATE ON NEW LINE --- */}
      <div className="america250-page-title fullwidth-block">
        <span className="america250-title-line">america250</span>
        <span className="america250-title-line">amateur radio</span>
        <span className="america250-title-line">special event</span>
        <span className="america250-page-title-date">july 01 – 13, 2025</span>
      </div>

      {/* --- MAHOGANY SEPARATOR BELOW TITLE BLOCK --- */}
      <div className="mahogany-separator fullwidth-block" aria-hidden="true"></div>

      {/* === PLEDGE QUOTE WITH QUILL/INKWELL (Responsive) === */}
      <section className="fullwidth-block">
        <div className="pledge-quote-block">
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
        <div className="mahogany-separator fullwidth-block" aria-hidden="true"></div>
      </section>

      {/* --- ON AIR / OFF AIR BADGE --- */}
      <div
        className="onair-status-block fullwidth-block"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '2.5vw 0 1.2vw 0',
          minHeight: 210,
        }}
      >
        {isOnAir ? (
         // === ON AIR BADGE STACK: BG + FLASHING TEXT ===
<div
  className="onair-badge-stack"
  style={{
    position: 'relative',
    width: 'clamp(220px, 95vw, 700px)',  // Match off-air badge clamp
    maxWidth: 700,                      // Match off-air badge maxWidth
    margin: '0 auto',
    display: 'block',
    background: 'transparent',
    height: 'auto'
  }}
>
  {/* Static badge background */}
  <img
    src="/onair-badge-blank.png"
    alt="ON AIR Badge Background"
    width={700}
    height={466}
    style={{
      width: '100%',
      height: 'auto',
      display: 'block',
      border: 'none',
      position: 'relative',
      zIndex: 1,
      maxWidth: '100%',                // Ensures full scaling
    }}
    draggable={false}
  />
  {/* Flashing ON AIR text */}
  <img
    src="/onair-badge-text.png"
    alt="ON AIR"
    width={700}
    height={466}
    className="onair-text-flash"
    style={{
      width: '100%',
      height: 'auto',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2,
      pointerEvents: 'none',
      userSelect: 'none',
      maxWidth: '100%',                // Ensures full scaling
    }}
    draggable={false}
            />
          </div>
        ) : (
          <Image
            src="/offair-badge.png"
            alt="OFF AIR"
            width={500}
            height={333}
            sizes="(max-width: 900px) 95vw, 700px"
            className="onair-badge"
            style={{
              maxWidth: 'clamp(220px, 95vw, 700px)',
              width: '100%',
              height: 'auto',
              filter: 'grayscale(35%)',
            }}
            priority
            draggable={false}
          />
        )}
      </div>

      {/* --- ACTIVATION TABLE (patriotic form overlay) --- */}
      <div className="fullwidth-block">
        <ActivationTable />
      </div>

      {/* --- ON AIR FLASH ANIMATION KEYFRAMES & RESPONSIVE BADGE SIZING --- */}
      <style jsx global>{`
        @keyframes onAirFlash {
          0%, 60% {
            opacity: 1;
            filter: drop-shadow(0 0 54px #e73c07) brightness(1.22);
          }
          70%, 100% {
            opacity: 0.58;
            filter: drop-shadow(0 0 4px #e73c07) brightness(0.93);
          }
        }
        .onair-flash {
          animation: onAirFlash 1.09s steps(1) infinite;
          will-change: filter, opacity;
        }
        @media (max-width: 900px) {
          .onair-badge {
            max-width: 96vw !important;
            width: 100% !important;
          }
        }
      `}</style>
    </main>
  );
}
