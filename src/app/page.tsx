// src/app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NavBar from './components/NavBar';      // Adjust path as needed
import MorseBlock from './components/MorseBlock'; // Adjust path as needed

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
      {/* --- NAVIGATION BAR AT TOP --- */}
      <NavBar />

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
        <img
          src="/america250-website-header.webp"
          alt="America 250 Header"
          style={{
            display: 'block',
            width: '100vw',
            height: 'auto',
            maxWidth: '100%',
            objectFit: 'cover',
            margin: 0,
            padding: 0,
            border: 'none',
          }}
          draggable={false}
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
          AMERICA250
        </h1>

        {/* --- MORSE CODE ANIMATION --- */}
        <MorseBlock />

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
              width={600}
              height={600}
              className="onair-badge onair-flash"
              style={{
                width: 600,
                height: 'auto',
                maxWidth: '98vw',
                animation: 'onAirFlash 1s steps(1) infinite',
                boxShadow: '0 0 36px #e73c07, 0 0 10px #ffd700',
              }}
              priority
              draggable={false}
            />
          ) : (
            <Image
              src="/offair-badge.png"
              alt="OFF AIR"
              width={600}
              height={600}
              className="onair-badge"
              style={{
                width: 600,
                height: 'auto',
                maxWidth: '98vw',
                filter: 'grayscale(35%)',
              }}
              priority
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* --- ON AIR FLASH ANIMATION KEYFRAMES --- */}
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
      `}</style>
    </main >
  );
}