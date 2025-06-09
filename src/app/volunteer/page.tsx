'use client';

import React, { useState } from 'react';
import VolunteerForm from './VolunteerForm';
import K4ABoxDropzone from './K4ABoxDropzone';

const VOLUNTEER_PIN = '7317';

export default function VolunteerPage() {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim() === VOLUNTEER_PIN) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  }

  return (
    <main
      className="parchment-bg fullwidth-block"
      style={{
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        boxSizing: 'border-box',

      }}
    >
      {/* --- NCS GUIDE BUTTON (ornate, increased by 25%) --- */}
      <div style={{
  background: 'linear-gradient(90deg, #f5e1bc 0%, #c5a564 100%)',
  border: '4.5px solid #a47c37', // was 3px
  borderRadius: 25.5,             // was 17
  padding: '2.25rem 3.75rem',     // was 1.5rem 2.5rem
  margin: '3.75rem 0 3.75rem 0',  // was 2.5rem 0 2.5rem 0
  boxShadow: '0 6px 24px #7c552028, 0 2.25px 15px #9a7c4722',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: 900,                  // was 600
  fontFamily: "'old claude', 'baskerville-old-style', serif"
}}>
  <a
    href="/ncs-guide.pdf"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-block',
      background: 'linear-gradient(180deg, #fff6e0 70%, #b49768 100%)',
      color: '#43290c',
      border: '3.75px solid #ad8a45',    // was 2.5px
      borderRadius: 13.5,                // was 9
      fontWeight: 700,
      padding: '1.5rem 3.75rem',         // was 1rem 2.5rem
      fontSize: '2.1rem',                // was 1.4rem
      textDecoration: 'none',
      boxShadow: '0 3px 13.5px #cfad7533',
      letterSpacing: '0.045em',
      transition: 'background 0.18s, box-shadow 0.18s',
      textAlign: 'center'
    }}
    onMouseOver={e => (e.currentTarget.style.background = '#f5e1bc')}
    onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(180deg, #fff6e0 70%, #b49768 100%)')}
  >
    <span role="img" aria-label="scroll" style={{ marginRight: 18, fontSize: '1.8em' }}>📜</span>
    View the NCS Guide (PDF)
  </a>
</div>

{/* --- PIN CHALLENGE (make 50% larger, centered) --- */}
<div style={{
  width: 1500,                     // was 1000
  maxWidth: '98vw',
  margin: '0 0 3.75rem 0',         // was 2.5rem
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}}>
  <form onSubmit={handlePinSubmit}
    style={{
      background: 'linear-gradient(180deg, #f8ecd8 80%, #ede0c5 100%)',
      border: '12px solid #6e4314',         // was 8px
      borderRadius: 27,                     // was 18
      padding: '3.75rem 4.5rem',            // was 2.5rem 3rem
      boxShadow: '0 6px 33px #ab864e44, inset 0 0 66px #d6ba8255',
      minWidth: 555,                        // was 370
      maxWidth: 1050,                       // was 700
      width: '100%',
      display: unlocked ? 'none' : 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '0'
    }}>
    <div style={{
      fontSize: '2.55rem',                  // was 1.7rem
      fontWeight: 700,
      color: '#513404',
      letterSpacing: '0.03em',
      marginBottom: '3rem',                 // was 2rem
      fontFamily: "'goudystd', serif"
    }}>
      ENTER VOLUNTEER PIN:
    </div>
    <input
      type="password"
      value={pin}
      onChange={e => setPin(e.target.value)}
      autoFocus
      style={{
        fontSize: '2.25rem',                // was 1.5rem
        border: '3px solid #ad782e',        // was 2px
        borderRadius: 12,                   // was 8
        padding: '1.2rem 1.65rem',          // was 0.8rem 1.1rem
        width: 225,                         // was 150
        textAlign: 'center',
        letterSpacing: '0.19em',
        background: '#fff6e1',
        fontFamily: "'goudystd', serif",
        marginBottom: 15                    // was 10
      }}
      maxLength={12}
      inputMode="numeric"
      autoComplete="off"
    />
    <button
      type="submit"
      style={{
        background: '#4a2e05',
        color: '#fffbea',
        border: 'none',
        borderRadius: 15,                   // was 10
        padding: '1.3rem 3.75rem',          // was 0.85rem 2.5rem
        fontSize: '1.92rem',                // was 1.28rem
        fontWeight: 700,
        letterSpacing: '0.06em',
        marginTop: 27,                      // was 18
        boxShadow: '0 3px 13.5px #7c552040'
      }}
    >
      Unlock Volunteer Tools
    </button>
    {pinError &&
      <div style={{
        color: '#b40000',
        background: '#fff3ef',
        fontWeight: 600,
        fontSize: '1.8rem',                 // was 1.2rem
        marginTop: 24,                      // was 16
        borderRadius: 9,
        padding: '0.75rem 2rem'
      }}>
        {pinError}
      </div>
          }
        </form>
      </div>

      {/* --- MAIN CONTENT: Volunteer Form (wide) --- */}
      <VolunteerForm locked={!unlocked} />

      {/* --- LOG DROPBOX (DO NOT WRAP, render directly) --- */}
      <K4ABoxDropzone locked={!unlocked} />
    </main>
  );
}