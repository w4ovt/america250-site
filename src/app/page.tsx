'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

function playMorseAudio(morse: string) {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const context = new AudioContextClass();
  let time = context.currentTime;

  for (let char of morse) {
    if (char === '·' || char === '-') {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.frequency.setValueAtTime(700, time);
      osc.type = 'sine';

      const duration = char === '·' ? 0.1 : 0.3;

      osc.connect(gain);
      gain.connect(context.destination);
      gain.gain.setValueAtTime(0.5, time);
      osc.start(time);
      osc.stop(time + duration);

      time += duration + 0.05;
    } else {
      time += 0.15;
    }
  }
}

export default function Home() {
  const morseCode = '·- -- · ·-· ·· -·-· ·- ··--- ····· -----';
  const [morseOutput, setMorseOutput] = useState('');
  const [isOnAir, setIsOnAir] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [enableSoundLeft, setEnableSoundLeft] = useState<number | null>(null);

  const handlePlayAndRestart = () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setMorseOutput('');
    playMorseAudio(morseCode);

    let index = 0;
    let buffer = '';
    const interval = setInterval(() => {
      if (index < morseCode.length) {
        buffer += morseCode.charAt(index);
        setMorseOutput(buffer);
        index++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 100);
  };

  useEffect(() => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setEnableSoundLeft(rect.left);
    }
  }, []);

  useEffect(() => {
    handlePlayAndRestart();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="parchment-bg">
      {/* HEADER IMAGE - Centered, Framed, No White Box */}
      <div className="america250-header-image-container">
        <img
          src="/america250-website-header.webp"
          alt="Painting of a bald eagle, Betsy Ross flag, Independence Hall, K4A Amateur Radio Special Event—Signaling the American Spirit, Pennsylvania State House plaque"
          className="america250-header-image"
          draggable={false}
        />
      </div>

      {/* HEADER TEXT */}
      <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '0.5rem', position: 'relative' }}>
        <h1
          ref={headerRef}
          className="handcarved-title"
          style={{ fontSize: '6.5rem', marginBottom: '0.4rem', marginTop: '1.2rem', lineHeight: '1.08' }}
        >
          AMERICA250
        </h1>
        <h2 className="subtitle-tagline" style={{
          fontFamily: "'Goudy Oldstyle', serif",
          fontWeight: 800,
          fontSize: '2.15rem',
          color: '#7a5230',
          letterSpacing: '0.22em',
          textShadow: '1px 1px 0 #fff6e3, 0 2px 8px #bca47a, 2px 2px 7px #f9ecd1',
          margin: 0,
          textTransform: 'uppercase'
        }}>
          SIGNALING THE SPIRIT OF AMERICA
        </h2>
      </div>

      {/* Morse code and Enable Sound container */}
      <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
        {/* Enable Sound button absolute aligned to left edge of "A" */}
        {enableSoundLeft !== null && (
          <button
            onClick={handlePlayAndRestart}
            disabled={isPlaying}
            aria-label="Enable Morse code sound"
            style={{
              position: 'absolute',
              top: '50%',
              left: enableSoundLeft,
              transform: 'translate(-100%, -50%)',
              width: '120px',
              height: '120px',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <Image
              src="/enable-sound-button.png"
              alt="Enable Sound"
              width={120}
              height={120}
              style={{ display: 'block', height: 'auto' }}
            />
          </button>
        )}

        {/* Morse code text centered - NO WRAP */}
        <div
          className="morse-typewriter"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '1.8rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            lineHeight: '2rem',
            paddingLeft: '1.25rem',
            userSelect: 'none',
          }}
        >
          {morseOutput}
        </div>
      </div>

      {/* ON AIR / OFF AIR badge - Correct size, not boxed */}
      <div
        className="onair-status-block"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2rem 0 2.8rem 0' }}
      >
        <Image
          src={isOnAir ? '/onair-badge.png' : '/offair-badge.png'}
          alt={isOnAir ? 'ON AIR' : 'OFF AIR'}
          width={210}
          height={210}
          className="onair-badge"
        />
      </div>
    </main>
  );
}