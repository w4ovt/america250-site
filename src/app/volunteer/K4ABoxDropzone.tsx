// src/app/volunteer/K4ABoxDropzone.tsx

import React, { useRef, useState, useEffect } from 'react';
import styles from './VolunteerForm.module.css';

const BOX_WIDTH = 700;
const BOX_HEIGHT = 380;

export default function K4ABoxDropzone() {
  const [containerWidth, setContainerWidth] = useState(BOX_WIDTH);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      const max = Math.min(window.innerWidth * 0.97, BOX_WIDTH);
      setContainerWidth(max);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag animation state
  const [isDragging, setIsDragging] = useState(false);

  // Drag event handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);
    audioRef.current?.play();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Handle dropped files here
      console.log('Dropped files:', files);
    }
  };

  // Scale factor for responsiveness
  const scale = containerWidth / BOX_WIDTH;

  return (
    <div className={styles.panelContainer} style={{ marginTop: '100px' }}>
      <div className={styles.panelTitle}>Drop .adi Log Files Here</div>
      <div
        style={{
          color: '#b40000',
          fontWeight: 'bold',
          fontSize: '1.35rem',
          textAlign: 'center',
          marginBottom: '1rem',
          lineHeight: '1.3',
        }}
      >
        NOTE: Your .adi file must include<br />
        &lt;Station_Callsign:3&gt;K4A
      </div>
      <div
        style={{
          color: '#4a2e05',
          fontWeight: 'bold',
          fontSize: '1.22rem',
          textAlign: 'center',
          marginBottom: '2.5rem',
          marginTop: '0.2rem'
        }}
      >
        Drag and Drop Your Log File Into the Box Below
      </div>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: `${containerWidth}px`,
          height: `${BOX_HEIGHT * scale}px`,
          margin: '0 auto',
          zIndex: 10,
          userSelect: 'none',
          maxWidth: '100vw',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          transition: 'box-shadow 0.3s',
          boxShadow: isDragging
            ? '0 12px 40px #d38e14b8, 0 2.5px 32px #a17c2399'
            : '0 8px 32px #b39c6866, 0 1.5px 22px #a68c5360',
        }}
        tabIndex={0}
        aria-label="K4A Log Dropbox"
        onDragEnter={handleDragEnter}
        onDragOver={handleDrag}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="region"
      >
        <img
          src="/K4A-Log-Dropbox.png"
          alt="K4A Log Dropbox"
          style={{
            width: `${BOX_WIDTH * scale}px`,
            height: `${BOX_HEIGHT * scale}px`,
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block',
            objectFit: 'contain',
            zIndex: 1,
            filter: isDragging
              ? 'brightness(1.10) contrast(1.17) drop-shadow(0 7px 44px #a17c2366)'
              : 'brightness(1.07) contrast(1.14) drop-shadow(0 4px 32px #3b230755)',
            transition: 'transform 0.28s cubic-bezier(.18,.85,.64,1.2), filter 0.25s',
            transform: isDragging
              ? 'perspective(400px) rotateX(17deg) scale(1.05)'
              : 'none',
          }}
          draggable={false}
        />
        <audio
          ref={audioRef}
          src="/logdrop.mp3"
          preload="auto"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}