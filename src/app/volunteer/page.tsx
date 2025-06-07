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
    <main style={{
      minHeight: '100vh',
      width: '100vw',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'none'
    }}>
      {/* --- FIELD MANUAL HEADER IMAGE --- */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1.2rem',
        marginBottom: '1.5rem',
      }}>
        <img
          src="/volunteer-header.webp"
          alt="Net Control Station Guide"
          style={{
            width: '100%',
            maxWidth: 1000,
            height: 'auto',
            borderRadius: 13,
            boxShadow: '0 6px 38px #53310d33, 0 0 0 3px #af9768',
            border: '1px solid #b29357',
            background: '#f3e4c4',
          }}
          draggable={false}
        />
      </div>

      {/* --- DOWNLOAD NCS GUIDE BUTTON --- */}
      <div style={{
        background: 'linear-gradient(90deg, #f5e1bc 0%, #c5a564 100%)',
        border: '3px solid #a47c37',
        borderRadius: 17,
        padding: '1.5rem 2.5rem',
        margin: '0 0 2.5rem 0',
        boxShadow: '0 4px 16px #7c552028, 0 1.5px 10px #9a7c4722',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 600,
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
            border: '2.5px solid #ad8a45',
            borderRadius: 9,
            fontWeight: 700,
            padding: '1rem 2.5rem',
            fontSize: '1.4rem',
            textDecoration: 'none',
            boxShadow: '0 2px 9px #cfad7533',
            letterSpacing: '0.03em',
            transition: 'background 0.18s, box-shadow 0.18s'
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#f5e1bc')}
          onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(180deg, #fff6e0 70%, #b49768 100%)')}
        >
          <span role="img" aria-label="scroll" style={{ marginRight: 12, fontSize: '1.2em' }}>📜</span>
          View the NCS Guide (PDF)
        </a>
      </div>

      {/* --- PIN CHALLENGE --- */}
      <form onSubmit={handlePinSubmit}
        style={{
          background: 'linear-gradient(180deg, #f8ecd8 80%, #ede0c5 100%)',
          border: '8px solid #6e4314',
          borderRadius: 18,
          padding: '2.5rem 3rem',
          boxShadow: '0 4px 22px #ab864e44, inset 0 0 44px #d6ba8255',
          minWidth: 370,
          maxWidth: 430,
          display: unlocked ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2.2rem'
        }}>
        <div style={{
          fontSize: '1.7rem',
          fontWeight: 700,
          color: '#513404',
          letterSpacing: '0.02em',
          marginBottom: '2rem',
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
            fontSize: '1.5rem',
            border: '2px solid #ad782e',
            borderRadius: 8,
            padding: '0.8rem 1.1rem',
            width: 150,
            textAlign: 'center',
            letterSpacing: '0.19em',
            background: '#fff6e1',
            fontFamily: "'goudystd', serif",
            marginBottom: 10
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
            borderRadius: 10,
            padding: '0.85rem 2.5rem',
            fontSize: '1.28rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginTop: 18,
            boxShadow: '0 2px 9px #7c552040'
          }}
        >
          Unlock Volunteer Tools
        </button>
        {pinError &&
          <div style={{
            color: '#b40000',
            background: '#fff3ef',
            fontWeight: 600,
            fontSize: '1.2rem',
            marginTop: 16,
            borderRadius: 6,
            padding: '0.5rem 1.3rem'
          }}>
            {pinError}
          </div>
        }
      </form>

      {/* --- ALWAYS VISIBLE, LOCKED OR UNLOCKED --- */}
      <VolunteerForm locked={!unlocked} />
      <K4ABoxDropzone locked={!unlocked} />
    </main>
  );
}