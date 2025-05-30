'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

function playMorseAudio(morse: string) {
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;
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
    handlePlayAndRestart(); // autoplay on initial load
    // eslint-disable-next-line
  }, []);

  return (
    <main className="parchment-bg">
      {/* SVG header with rich brown/mahogany frame and strong shadow */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          margin: '96px 96px 0 96px', // 1 inch top, left, right, zero bottom
          width: 'auto',
          maxWidth: 'calc(100vw - 192px)', // prevent overflow at small screens
          boxSizing: 'border-box',
        }}
      >
        <svg
          width="1504"
          height="1024"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            boxSizing: 'border-box',
            borderRadius: '22px',
            boxShadow: '0 6px 36px #b3905a99',
            background: 'none'
          }}
          viewBox="0 0 1504 1024"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ...SVG contents unchanged... */}
          <defs>
            <filter id="lifted-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="36" stdDeviation="28" floodColor="#4b2e19" floodOpacity="0.40" />
            </filter>
            <linearGradient id="frame-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6e3b18" />
              <stop offset="50%" stopColor="#8b4513" />
              <stop offset="100%" stopColor="#3e1e0a" />
            </linearGradient>
            <clipPath id="rounded-image">
              <rect x="32" y="32" width="1440" height="960" rx="16" ry="16" />
            </clipPath>
          </defs>
          <rect
            x="0"
            y="0"
            width="1504"
            height="1024"
            rx="32"
            fill="url(#frame-gradient)"
            filter="url(#lifted-shadow)"
          />
          <image
            href="/america250-website-header.webp"
            x="32"
            y="32"
            width="1440"
            height="960"
            clipPath="url(#rounded-image)"
            preserveAspectRatio="xMidYMin slice"
          />
        </svg>
      </div>

      <div className="america250-stack">
        <h1 className="handcarved-title">AMERICA250</h1>

        <div className="morse-block-wrapper">
          <button
            className="enable-sound-button-fixed"
            onClick={handlePlayAndRestart}
            disabled={isPlaying}
          >
            <Image
              src="/enable-sound-button.png"
              alt="Enable Sound"
              width={120}
              height={120}
              className="enable-sound-image"
            />
          </button>

          <div className="morse-typewriter">{morseOutput}</div>
        </div>
      </div>

      <div className="onair-status-block">
        <Image
          src={isOnAir ? '/onair-badge.png' : '/offair-badge.png'}
          alt={isOnAir ? 'ON AIR' : 'OFF AIR'}
          width={250}
          height={250}
          className="onair-badge"
        />
      </div>
    </main>
  );
}