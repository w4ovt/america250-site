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
      {/* --- HEADER IMAGE --- */}
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
      {/* Bronze separator bar beneath header image */}
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
      {/* --- MAIN CONTENT --- */}
      <div
        style={{
          width: '100vw',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* --- PAGE TITLE --- */}
        <h1 className="america250-header-text">
          AMERICA 250
        </h1>

        {/* --- MORSE CODE ANIMATION --- */}
        <div style={{ marginBottom: '0.6rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <MorseBlock />
        </div>

        {/* --- SUBTITLE --- */}
        <div className="america250-header-subtitle">
          “AND FOR THE SUPPORT OF THIS DECLARATION, 
          WITH A FIRM RELIANCE ON THE PROTECTION OF DIVINE PROVIDENCE, 
          WE MUTUALLY PLEDGE TO EACH OTHER OUR LIVES, OUR FORTUNES, 
          AND OUR SACRED HONOR”
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
          .america250-header-text {
            font-family: 'baskerville-old-style', serif;
            font-size: clamp(2rem, 6vw, 3.5rem);
            letter-spacing: 0.09em;
            color: #6c4624;
            font-weight: 700;
            margin-top: 1.2rem;
            margin-bottom: 0.7rem;
            text-transform: uppercase;
            text-align: center;
          }
          .america250-header-subtitle {
            font-family: 'lamarpen', serif;
            font-size: clamp(1rem, 4vw, 1.6rem);
            color: #6c4624;
            margin-bottom: 1.2rem;
            margin-top: 2rem;
            font-style: italic;
            letter-spacing: 0.04em;
            text-transform: uppercase;
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
            .america250-header-text {
              margin-top: 0.7rem;
              margin-bottom: 0.5rem;
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
      </div>
    </main>
  );
}
