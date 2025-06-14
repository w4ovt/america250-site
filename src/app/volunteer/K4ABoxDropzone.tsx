// src/app/volunteer/K4ABoxDropzone.tsx

'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './VolunteerForm.module.css';

// --- Constants for dropbox image dimensions ---
const BOX_WIDTH = 700;
const BOX_HEIGHT = 380;

// --- Props type for K4ABoxDropzone ---
type K4ABoxDropzoneProps = {
  locked?: boolean; // If true, disables drop/upload actions
};

// --- K4ABoxDropzone Component ---
export default function K4ABoxDropzone({ locked = false }: K4ABoxDropzoneProps) {
  // --- Ref for playing audio feedback on drop ---
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- State for drag animation (highlight dropzone on drag) ---
  const [isDragging, setIsDragging] = useState(false);

  // --- Handler: Prevent default drag behavior and bubbling ---
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // --- Handler: When drag enters dropzone, highlight it ---
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(true);
  };

  // --- Handler: When drag leaves dropzone, remove highlight ---
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);
  };

  // --- Handler: When file is dropped on dropzone ---
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);

    // --- If locked, prevent upload and alert user ---
    if (locked) {
      alert('Please enter volunteer PIN to upload logs.');
      return;
    }

    // --- Play drop sound for feedback ---
    audioRef.current?.play();

    // --- Access dropped files and handle upload logic ---
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Handle dropped files here (e.g., upload to server)
      console.log('Dropped files:', files);
      // ...your file upload/processing logic here
    }
  };

  // --- Render the dropzone with all visual and accessibility features ---
  return (
    <div className={styles.panelContainer} style={{ marginTop: '100px' }}>
      {/* --- Title for the dropzone panel --- */}
      <div className={styles.panelTitle}>Drop .adi Log Files Here</div>
      {/* --- Instructional note about file requirements --- */}
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
      {/* --- Secondary instruction --- */}
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
      {/* --- Main dropzone area --- */}
      <div
        style={{
          width: '100%',
          minHeight: `${BOX_HEIGHT}px`,
          background: 'none',
          transition: 'box-shadow 0.3s',
          boxShadow: isDragging
            ? '0 12px 40px #d38e14b8, 0 2.5px 32px #a17c2399'
            : '0 8px 32px #b39c6866, 0 1.5px 22px #a68c5360',
          userSelect: 'none',
          touchAction: 'none',
          margin: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          boxSizing: 'border-box',
          cursor: locked ? 'not-allowed' : 'pointer',
          opacity: 1, // Always fully visible
        }}
        tabIndex={0}
        aria-label="K4A Log Dropbox"
        onDragEnter={handleDragEnter}
        onDragOver={handleDrag}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="region"
      >
        {/* --- Dropbox image with drag animation and accessibility --- */}
        <Image
          src="/K4A-Log-Dropbox.png"
          alt="K4A Log Dropbox"
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
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
          priority={false}
        />
        {/* --- Hidden audio element for drop sound --- */}
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
