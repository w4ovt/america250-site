'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './MorseBlock.module.css';

const MORSE = '·- -- · ·-· ·· -·-· ·- ··--- ····· -----';
const SUBTITLE = '“COMMEMORATING AMERICA\'S DECLARATION OF INDEPENDENCE”';

function playMorseAudio(morse: string, onDone: () => void) {
  const AudioContextClass =
    typeof window !== 'undefined'
      ? (window.AudioContext || (window as any).webkitAudioContext)
      : null;
  if (!AudioContextClass) return;
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
  setTimeout(onDone, (time - context.currentTime) * 1000 + 80);
}

export default function MorseBlock() {
  const [display, setDisplay] = useState('');
  const [playing, setPlaying] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Animate Morse code left-to-right
  const animate = () => {
    setDisplay('');
    let index = 0;
    if (animationRef.current) clearInterval(animationRef.current);
    animationRef.current = setInterval(() => {
      if (index <= MORSE.length) {
        setDisplay(MORSE.slice(0, index));
        index++;
      } else {
        if (animationRef.current) clearInterval(animationRef.current);
      }
    }, 80);
  };

  const handlePlay = () => {
    if (playing) return;
    setPlaying(true);
    animate();
    playMorseAudio(MORSE, () => setPlaying(false));
  };

  // On mount: animate code only (no sound)
  useEffect(() => {
    setPlaying(true);
    let index = 0;
    setDisplay('');
    if (animationRef.current) clearInterval(animationRef.current);
    animationRef.current = setInterval(() => {
      if (index <= MORSE.length) {
        setDisplay(MORSE.slice(0, index));
        index++;
      } else {
        if (animationRef.current) clearInterval(animationRef.current);
        setPlaying(false);
      }
    }, 80);
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  return (
    <div className={styles.morseCenterWrap}>
      <div className={styles.morseRow}>
        <button
          className={styles.playButton}
          onClick={handlePlay}
          disabled={playing}
          aria-label="Play Morse Code"
          type="button"
        >
          <Image
            src="/play-button.webp"
            alt="PLAY"
            width={150}
            height={88}
            style={{
              objectFit: 'contain',
              width: '100%',
              height: 'auto',
              maxWidth: '150px',
              maxHeight: '88px',
              display: 'block',
            }}
            draggable={false}
            priority
          />
        </button>
        <div className={styles.morseCodeShell}>
          <span className={styles.ghost}>{MORSE}</span>
          <span className={styles.morseCodeStream}>{display}</span>
        </div>
      </div>
    </div>
  );
}
