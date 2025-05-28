'use client';

import React, { useState, useEffect } from 'react';

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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <svg
          width="1504"
          height="1024"
          viewBox="0 0 1504 1024"
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Strong, warm drop shadow */}
            <filter id="lifted-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="36" stdDeviation="28" floodColor="#4b2e19" floodOpacity="0.40" />
            </filter>
            {/* Rich brown to mahogany gradient */}
            <linearGradient id="frame-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6e3b18" />
              <stop offset="50%" stopColor="#8b4513" />
              <stop offset="100%" stopColor="#3e1e0a" />
            </linearGradient>
            {/* Rounded corners for image */}
            <clipPath id="rounded-image">
              <rect x="32" y="32" width="1440" height="960" rx="16" ry="16" />
            </clipPath>
          </defs>
          {/* Frame with gradient and shadow */}
          <rect
            x="0"
            y="0"
            width="1504"
            height="1024"
            rx="32"
            fill="url(#frame-gradient)"
            filter="url(#lifted-shadow)"
          />
          {/* Header image centered inside frame, with rounded corners */}
          <image
            href="/america250-website-header.png"
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
            <img
              src="/enable-sound-button.png"
              alt="Enable Sound"
              className="enable-sound-image"
            />
          </button>

          <div className="morse-typewriter">{morseOutput}</div>
        </div>
      </div>

      <div className="onair-status-block">
        <img
          src={isOnAir ? '/onair-badge.png' : '/offair-badge.png'}
          alt={isOnAir ? 'ON AIR' : 'OFF AIR'}
          className="onair-badge"
        />
      </div>
    </main>
  );
}
