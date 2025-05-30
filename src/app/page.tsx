'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

function playMorseAudio(morse: string, onDone: () => void) {
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

      // GENTLE GAIN RAMP (no pop)
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.55, time + 0.01);

      const duration = char === '·' ? 0.1 : 0.3;
      osc.connect(gain);
      gain.connect(context.destination);

      osc.start(time);
      osc.stop(time + duration);

      // RAMP DOWN gain before stopping
      gain.gain.linearRampToValueAtTime(0, time + duration - 0.015);

      time += duration + 0.05;
    } else {
      time += 0.15;
    }
  }

  setTimeout(onDone, (time - context.currentTime) * 1000 + 100);
}

export default function Home() {
  const morseCode = '·- -- · ·-· ·· -·-· ·- ··--- ····· -----';
  const [morseOutput, setMorseOutput] = useState('');
  const [isOnAir, setIsOnAir] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // === ON AIR/OFF AIR POLLING LOGIC ===
  useEffect(() => {
    const fetchOnAirStatus = async () => {
      try {
        const res = await fetch('/api/activations/count');
        const data = await res.json();
        setIsOnAir(data.count > 0);
      } catch {
        setIsOnAir(false);
      }
    };
    fetchOnAirStatus();
    intervalRef.current = setInterval(fetchOnAirStatus, 10000); // every 10s
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // === MORSE PLAY/ANIMATION LOGIC ===
  const handlePlayAndRestart = () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setMorseOutput('');
    let index = 0;
    let buffer = '';

    playMorseAudio(morseCode, () => setIsPlaying(false));

    const interval = setInterval(() => {
      if (index < morseCode.length) {
        buffer += morseCode.charAt(index);
        setMorseOutput(buffer);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  useEffect(() => {
    handlePlayAndRestart();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="parchment-bg">
      {/* HEADER IMAGE */}
      <div className="svg-header-wrapper">
        <Image
          src="/america250-website-header.webp"
          alt="America250 Header"
          width={1440}
          height={960}
          priority
          className="america250-header-image"
          draggable={false}
        />
      </div>

      <div>
        <div className="america250-stack">
          <h1 className="handcarved-title">AMERICA250</h1>

          /* <div className="morse-block-wrapper">
            <button
              className="enable-sound-button-fixed"
              onClick={handlePlayAndRestart}
              disabled={isPlaying}
              aria-label="Enable Sound"
            >
              <Image
                src="/enable-sound-button.png"
                alt="Enable Sound"
                width={120}
                height={120}
                className="enable-sound-image"
                draggable={false}
              />
            </button>
            <div className="morse-typewriter">{morseOutput}</div>
          </div>
        </div> */

        // ==== STATIC TEST BLOCK BELOW ====

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '2px solid red',
          margin: '1rem',
          padding: '1rem'
        }}>
          <button
            style={{
              width: 60,
              height: 60,
              border: '2px solid blue',
              borderRadius: '50%',
              marginBottom: 12,
              background: '#fff'
            }}
          >🔊</button>
          <div style={{
            width: '90vw',
            maxWidth: 520,
            fontSize: '2.2rem',
            border: '2px dashed green',
            padding: 12,
            overflowX: 'auto',
            whiteSpace: 'pre'
          }}>
            ·- -- · ·-· ·· -·-· ·- ··--- ····· -----
          </div>
        </div>

        <div className="onair-status-block">
          <Image
            src={isOnAir ? '/onair-badge.png' : '/offair-badge.png'}
            alt={isOnAir ? 'ON AIR' : 'OFF AIR'}
            width={250}
            height={250}
            className="onair-badge"
            draggable={false}
          />
        </div>
      </div>
    </main>
  );
}