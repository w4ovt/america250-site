'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MorseBlock from '@/components/MorseBlock';

// Dummy fetch function; replace with actual Neon DB/API fetch for production
async function fetchIsOnAir(): Promise<boolean> {
  return false; // Replace with API call logic
}

export default function Home() {
  const [isOnAir, setIsOnAir] = useState(false);

  useEffect(() => {
    fetchIsOnAir().then(setIsOnAir);
  }, []);

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
      {/* --- LARGE HEADER IMAGE (PARCHMENT MOTIF) --- */}
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
      {/* --- BRONZE SEPARATOR BAR --- */}
      <div
        style={{
          width: '100vw',
          height: '7px',
          background: 'linear-gradient(90deg, rgba(255,226,154,0) 0%, #ffe29a 12%, #d5a94a 26%, #fff4c0 50%, #d5a94a 74%, #ffe29a 88%, rgba(255,226,154,0) 100%)',
          margin: 0,
          padding: 0,
          border: 'none',
          boxShadow: '0 2px 8px #a9781396',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      {/* --- CROPPED IMAGE-BASED PAGE TITLE (SORA HEADER) --- */}
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
              maxWidth: "1200px", // Adjust as needed for your preferred size
              height: "auto",
              display: "block",
              margin: 0,
              padding: 0,
            }}
            draggable={false}
          />
        </picture>
      </div>
      {/* --- MORSE CODE ANIMATION --- */}
      <div style={{ marginBottom: '0.6rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <MorseBlock />
      </div>

      {/* --- SUBTITLE & PLAQUE --- */}
      <div className="subtitle-plaque">
        <div className="america250-header-subtitle">
          “And for the support of this Declaration, with a firm reliance on the protection of divine Providence, we mutually pledge to each other our Lives, our Fortunes and our sacred Honor.”
        </div>
        <div className="subtitle-brass-plate">
          Declaration of Independence - Signers Pledge, July 4th, 1776
        </div>
      </div>

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

      {/* --- ON AIR FLASH ANIMATION KEYFRAMES & RESPONSIVE STYLES --- */}
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
        .america250-header-subtitle {
          font-family: 'lamarpen', serif;
          font-size: clamp(1rem, 4vw, 1.6rem);
          color: #6c4624;
          margin-bottom: 1.2rem;
          margin-top: 2rem;
          font-style: normal;
          letter-spacing: 0.04em;
          text-transform: none;
          text-align: center;
          max-width: 90vw;
          margin-left: auto;
          margin-right: auto;
        }
        .onair-badge {
          width: 100%;
          max-width: clamp(180px, 80vw, 350px);
          height: auto;
        }
        @media (max-width: 600px) {
          .america250-header-image {
            max-width: 98vw !important;
          }
          .america250-header-subtitle {
            margin-top: 1rem;
            margin-bottom: 0.7rem;
          }
          .onair-status-block {
            min-height: 90px;
          }
        }
      `}</style>
    </main>
  );
}
